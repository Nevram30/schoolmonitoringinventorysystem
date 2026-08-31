import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { serialize } from "@/server/api/serialize";
import { loadFeeSettings } from "@/server/api/fee-settings";
import { calculateOverdueFee, DEFAULT_FEE_SETTINGS } from "@/lib/fees";
import { isKnownDepartment } from "@/lib/departments";

const insensitive = { mode: "insensitive" } as const;

/**
 * Midnight today. Overdue is counted in whole days, so an item due today is not late until
 * tomorrow — comparing against `new Date()` would flag anything due earlier this morning.
 */
const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const borrowsRouter = createTRPCRouter({
  // GET /api/borrows
  list: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        search: z.string().default(""),
        status: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit, search, status } = input;
        const offset = (page - 1) * limit;

        const where: any = {};

        if (search) {
          // Search in related models
          where.OR = [
            { Item: { i_model: { contains: search, ...insensitive } } },
            { Item: { i_deviceID: { contains: search, ...insensitive } } },
            { Member: { m_fname: { contains: search, ...insensitive } } },
            { Member: { m_lname: { contains: search, ...insensitive } } },
            { Room: { r_name: { contains: search, ...insensitive } } },
          ];
        }

        // The UI sends named statuses ("borrowed", "returned", "overdue"); a bare
        // parseInt on those yields NaN and matches nothing. Overdue mirrors the
        // dashboard count in reports.summary: still out, and past its due date.
        if (status) {
          switch (status) {
            case "borrowed":
              where.b_status = 1;
              break;
            case "returned":
              where.b_status = 2;
              break;
            case "overdue":
              where.b_status = 1;
              where.b_due_date = { lt: new Date() };
              break;
            default: {
              const numericStatus = parseInt(status, 10);
              if (!Number.isNaN(numericStatus)) {
                where.b_status = numericStatus;
              }
            }
          }
        }

        const [rows, count] = await ctx.db.$transaction([
          ctx.db.borrow.findMany({
            where,
            include: {
              // i_photo / i_brand drive the thumbnail shown next to an item in the UI.
              Item: {
                select: {
                  i_model: true,
                  i_deviceID: true,
                  i_photo: true,
                  i_brand: true,
                },
              },
              Member: {
                select: { m_fname: true, m_lname: true, m_department: true },
              },
              Room: { select: { r_name: true } },
            },
            take: limit,
            skip: offset,
            orderBy: { id: "desc" },
          }),
          ctx.db.borrow.count({ where }),
        ]);

        return {
          success: true as const,
          data: rows.map(serialize),
          pagination: {
            page,
            limit,
            total: count,
            totalPages: Math.ceil(count / limit),
          },
        };
      } catch (error) {
        console.error("Get borrows error:", error);
        return {
          success: false as const,
          error: "Failed to fetch borrows",
          data: [],
          pagination: {
            page: input.page,
            limit: input.limit,
            total: 0,
            totalPages: 0,
          },
        };
      }
    }),

  // GET /api/borrows/unreturned
  //
  // Items that are still out. Each row carries the late fee accrued so far, worked out from the
  // admin's fee policy against today's date — no damage fee, because the item is not back yet and
  // its condition is unknown until it is returned.
  //
  // Admin-only: it exposes what every borrower currently owes.
  unreturned: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        search: z.string().default(""),
        /** "overdue" = past the due date, "pending" = still within it. */
        filter: z.enum(["all", "overdue", "pending"]).default("overdue"),
      })
    )
    .query(async ({ ctx, input }) => {
      const emptyResult = {
        data: [] as never[],
        pagination: {
          page: input.page,
          limit: input.limit,
          total: 0,
          totalPages: 0,
        },
        summary: { unreturned: 0, overdue: 0, totalFees: 0 },
        policy: DEFAULT_FEE_SETTINGS,
        asOf: new Date(),
      };

      try {
        const { page, limit, search, filter } = input;
        const offset = (page - 1) * limit;
        const today = startOfToday();

        // Never returned, whatever b_status says — the status column is set by hand in places
        // and a missing return date is the fact that actually matters here.
        const base: any = { b_date_returned: null };

        if (search) {
          base.OR = [
            { Item: { i_model: { contains: search, ...insensitive } } },
            { Item: { i_deviceID: { contains: search, ...insensitive } } },
            { Member: { m_fname: { contains: search, ...insensitive } } },
            { Member: { m_lname: { contains: search, ...insensitive } } },
            { Member: { m_school_id: { contains: search, ...insensitive } } },
            { Room: { r_name: { contains: search, ...insensitive } } },
          ];
        }

        const where = { ...base };
        if (filter === "overdue") {
          where.b_due_date = { lt: today };
        } else if (filter === "pending") {
          where.b_due_date = { gte: today };
        }

        const settings = await loadFeeSettings(ctx.db);

        const [rows, count, unreturnedCount, overdueRows] =
          await ctx.db.$transaction([
            ctx.db.borrow.findMany({
              where,
              include: {
                Item: {
                  select: {
                    i_model: true,
                    i_deviceID: true,
                    i_photo: true,
                    i_brand: true,
                  },
                },
                Member: {
                  select: {
                    m_fname: true,
                    m_lname: true,
                    m_school_id: true,
                    m_contact: true,
                    m_department: true,
                  },
                },
                Room: { select: { r_name: true } },
              },
              take: limit,
              skip: offset,
              // Most overdue first: the borrower who has held an item longest needs chasing.
              orderBy: { b_due_date: "asc" },
            }),
            ctx.db.borrow.count({ where }),
            ctx.db.borrow.count({ where: base }),
            // Due dates of everything overdue, so the running total covers all pages, not just
            // the one on screen.
            ctx.db.borrow.findMany({
              where: { ...base, b_due_date: { lt: today } },
              select: { b_due_date: true },
            }),
          ]);

        const totalFees = overdueRows.reduce(
          (sum, row) =>
            sum + calculateOverdueFee(settings, row.b_due_date, today).fee,
          0
        );

        return {
          success: true as const,
          data: rows.map((row) => {
            const overdue = calculateOverdueFee(settings, row.b_due_date, today);
            return {
              ...serialize(row),
              daysOverdue: overdue.daysLate,
              chargeableDays: overdue.chargeableDays,
              lateFee: overdue.fee,
              lateFeeCapped: overdue.capped,
            };
          }),
          pagination: {
            page,
            limit,
            total: count,
            totalPages: Math.ceil(count / limit),
          },
          summary: {
            unreturned: unreturnedCount,
            overdue: overdueRows.length,
            totalFees: Math.round(totalFees * 100) / 100,
          },
          // The policy the amounts above were worked out from, so the screen can explain a fee of
          // 0.00 — a grace period longer than the delay is the usual reason.
          policy: settings,
          // The fees are accurate as of this moment; the UI shows it so a stale tab is obvious.
          asOf: new Date(),
        };
      } catch (error) {
        console.error("Get unreturned borrows error:", error);
        return {
          success: false as const,
          error: "Failed to fetch unreturned items",
          ...emptyResult,
        };
      }
    }),

  // POST /api/borrows
  create: protectedProcedure
    .input(
      z.object({
        member_id: z.number(),
        item_id: z.number(),
        stock_id: z.number(),
        room_assigned: z.number().nullish(),
        time_limit: z.string(),
        purpose: z.string().optional(),
        /** Department picked on the form; kept on the borrower rather than on the borrow. */
        department: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if item has enough stock
        const item = await ctx.db.item.findUnique({
          where: { id: input.item_id },
        });
        if (!item) {
          return { success: false as const, error: "Item not found" };
        }

        if (item.item_rawstock < input.stock_id) {
          return {
            success: false as const,
            error: "Insufficient stock available",
          };
        }

        // The department lives on the borrower, so recording a borrow for someone whose program
        // has changed (or was never filled in) keeps their record current.
        const department = input.department?.trim();
        if (department) {
          if (!isKnownDepartment(department)) {
            return {
              success: false as const,
              error: "Unknown department",
            };
          }
          await ctx.db.borrower.update({
            where: { id: input.member_id },
            data: { m_department: department },
          });
        }

        const newBorrow = await ctx.db.borrow.create({
          data: {
            member_id: input.member_id,
            item_id: input.item_id,
            room_id: input.room_assigned ?? null,
            b_due_date: new Date(input.time_limit),
            b_quantity: input.stock_id,
            b_status: 1, // 1 = borrowed
            b_purpose: input.purpose?.trim() || null,
            b_notes: null,
          },
        });

        // Update item stock
        await ctx.db.item.update({
          where: { id: input.item_id },
          data: { item_rawstock: item.item_rawstock - input.stock_id },
        });

        return {
          success: true as const,
          data: newBorrow,
          message: "Borrow record created successfully",
        };
      } catch (error) {
        console.error("Create borrow error:", error);
        console.error(
          "Error details:",
          error instanceof Error ? error.message : "Unknown error"
        );
        return {
          success: false as const,
          error: `Failed to create borrow record: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        };
      }
    }),
});
