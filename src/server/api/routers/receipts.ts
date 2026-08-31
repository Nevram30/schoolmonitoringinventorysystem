import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { serialize } from "@/server/api/serialize";

const insensitive = { mode: "insensitive" } as const;

/**
 * Hand-over records: who physically collected an approved borrow.
 *
 * Approving a request creates the `Borrow` and takes the stock, but the item is still on the
 * shelf until someone walks up to the counter for it. Everything here is admin-only — it is the
 * admin standing at that counter who photographs the receiver and signs the item out.
 */

/** What both tabs render: the item, who it is for, where it is going. */
const borrowInclude = {
  Item: {
    select: {
      i_model: true,
      i_deviceID: true,
      i_photo: true,
      i_brand: true,
      i_category: true,
    },
  },
  Member: {
    select: {
      m_fname: true,
      m_lname: true,
      m_school_id: true,
      m_contact: true,
      m_department: true,
      m_type: true,
    },
  },
  Room: { select: { r_name: true } },
  // Present only for a borrow that started life as a request, which is what lets the page show
  // who asked for it and which admin approved it.
  request: {
    select: {
      id: true,
      br_reviewed_at: true,
      Requester: { select: { name: true, role: true } },
      Reviewer: { select: { name: true } },
    },
  },
} as const;

const receiptInclude = {
  Borrow: { include: borrowInclude },
  Releaser: { select: { name: true } },
} as const;

/** Fields the counter form collects, shared by `create` and `update`. */
const receiptDetails = {
  rc_receiver_name: z.string().trim().min(1, "Receiver name is required").max(150),
  rc_receiver_id: z.string().trim().max(50).nullish(),
  rc_contact: z.string().trim().max(20).nullish(),
  rc_relationship: z.string().trim().max(50).default("self"),
  rc_id_presented: z.string().trim().max(50).nullish(),
  rc_receiver_photo: z.string().trim().max(255).nullish(),
  rc_quantity: z.number().int().min(1),
  rc_condition: z.string().trim().max(50).default("Good"),
  rc_notes: z.string().trim().nullish(),
  /** Defaults to now when the hand-over is logged as it happens. */
  rc_received_at: z.string().nullish(),
};

/** Empty strings from the form mean "not given", not an empty value worth storing. */
const orNull = (value: string | null | undefined) =>
  value && value.trim() ? value.trim() : null;

export const receiptsRouter = createTRPCRouter({
  /**
   * Borrows that have been approved but not yet collected — the work queue of the page.
   *
   * Only borrows still out (`b_status: 1`) are listed: one that has already come back is history,
   * and offering to log its hand-over now would only produce a misleading record.
   */
  pending: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        search: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, search } = input;

      try {
        const where: any = { b_status: 1, receipt: { is: null } };

        if (search) {
          where.OR = [
            { Item: { i_model: { contains: search, ...insensitive } } },
            { Item: { i_deviceID: { contains: search, ...insensitive } } },
            { Member: { m_fname: { contains: search, ...insensitive } } },
            { Member: { m_lname: { contains: search, ...insensitive } } },
            { Member: { m_school_id: { contains: search, ...insensitive } } },
          ];
        }

        const [rows, count, awaiting] = await ctx.db.$transaction([
          ctx.db.borrow.findMany({
            where,
            include: borrowInclude,
            take: limit,
            skip: (page - 1) * limit,
            orderBy: { b_date_borrowed: "desc" },
          }),
          ctx.db.borrow.count({ where }),
          // Unfiltered, so the tab badge keeps showing the true backlog while a search is active.
          ctx.db.borrow.count({ where: { b_status: 1, receipt: { is: null } } }),
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
          awaitingTotal: awaiting,
        };
      } catch (error) {
        console.error("Get pending receipts error:", error);
        return {
          success: false as const,
          error: "Failed to fetch items awaiting hand-over",
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
          awaitingTotal: 0,
        };
      }
    }),

  /** Hand-overs already recorded, newest first. */
  list: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        search: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, search } = input;

      try {
        const where: any = {};

        if (search) {
          where.OR = [
            { rc_receiver_name: { contains: search, ...insensitive } },
            { rc_receiver_id: { contains: search, ...insensitive } },
            { Borrow: { Item: { i_model: { contains: search, ...insensitive } } } },
            {
              Borrow: {
                Item: { i_deviceID: { contains: search, ...insensitive } },
              },
            },
            {
              Borrow: {
                Member: { m_fname: { contains: search, ...insensitive } },
              },
            },
            {
              Borrow: {
                Member: { m_lname: { contains: search, ...insensitive } },
              },
            },
          ];
        }

        const [rows, count] = await ctx.db.$transaction([
          ctx.db.itemReceipt.findMany({
            where,
            include: receiptInclude,
            take: limit,
            skip: (page - 1) * limit,
            orderBy: { rc_received_at: "desc" },
          }),
          ctx.db.itemReceipt.count({ where }),
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
        console.error("Get receipts error:", error);
        return {
          success: false as const,
          error: "Failed to fetch received items",
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
        };
      }
    }),

  /** Log a hand-over. One per borrow — the unique `borrow_id` is what enforces that. */
  create: adminProcedure
    .input(z.object({ borrow_id: z.number(), ...receiptDetails }))
    .mutation(async ({ ctx, input }) => {
      try {
        const borrow = await ctx.db.borrow.findUnique({
          where: { id: input.borrow_id },
          include: { receipt: { select: { id: true } } },
        });

        if (!borrow) {
          return { success: false as const, error: "Borrow record not found" };
        }
        // Two admins on the queue at once, or a double-submit.
        if (borrow.receipt) {
          return {
            success: false as const,
            error: "This borrow has already been handed over",
          };
        }
        if (borrow.b_status === 2) {
          return {
            success: false as const,
            error: "This item has already been returned",
          };
        }
        if (input.rc_quantity > borrow.b_quantity) {
          return {
            success: false as const,
            error: `Only ${borrow.b_quantity} approved on this borrow`,
          };
        }

        const receipt = await ctx.db.itemReceipt.create({
          data: {
            borrow_id: input.borrow_id,
            rc_receiver_name: input.rc_receiver_name.trim(),
            rc_receiver_id: orNull(input.rc_receiver_id),
            rc_contact: orNull(input.rc_contact),
            rc_relationship: input.rc_relationship.trim() || "self",
            rc_id_presented: orNull(input.rc_id_presented),
            rc_receiver_photo: orNull(input.rc_receiver_photo),
            rc_quantity: input.rc_quantity,
            rc_condition: input.rc_condition.trim() || "Good",
            rc_notes: orNull(input.rc_notes),
            rc_received_at: input.rc_received_at
              ? new Date(input.rc_received_at)
              : new Date(),
            released_by: ctx.session.user.id,
          },
          include: receiptInclude,
        });

        return {
          success: true as const,
          data: serialize(receipt),
          message: "Hand-over recorded",
        };
      } catch (error) {
        console.error("Create receipt error:", error);
        return {
          success: false as const,
          error: `Failed to record hand-over: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        };
      }
    }),

  /**
   * Correct a recorded hand-over — a misheard name or a photo that came out unusable. The borrow
   * it belongs to is not editable: that would be a different hand-over, not a correction.
   */
  update: adminProcedure
    .input(z.object({ id: z.number(), ...receiptDetails }))
    .mutation(async ({ ctx, input }) => {
      try {
        const existing = await ctx.db.itemReceipt.findUnique({
          where: { id: input.id },
          include: { Borrow: { select: { b_quantity: true } } },
        });

        if (!existing) {
          return { success: false as const, error: "Receipt not found" };
        }
        if (input.rc_quantity > existing.Borrow.b_quantity) {
          return {
            success: false as const,
            error: `Only ${existing.Borrow.b_quantity} approved on this borrow`,
          };
        }

        const updated = await ctx.db.itemReceipt.update({
          where: { id: input.id },
          data: {
            rc_receiver_name: input.rc_receiver_name.trim(),
            rc_receiver_id: orNull(input.rc_receiver_id),
            rc_contact: orNull(input.rc_contact),
            rc_relationship: input.rc_relationship.trim() || "self",
            rc_id_presented: orNull(input.rc_id_presented),
            rc_receiver_photo: orNull(input.rc_receiver_photo),
            rc_quantity: input.rc_quantity,
            rc_condition: input.rc_condition.trim() || "Good",
            rc_notes: orNull(input.rc_notes),
            rc_received_at: input.rc_received_at
              ? new Date(input.rc_received_at)
              : existing.rc_received_at,
          },
          include: receiptInclude,
        });

        return {
          success: true as const,
          data: serialize(updated),
          message: "Hand-over updated",
        };
      } catch (error) {
        console.error("Update receipt error:", error);
        return { success: false as const, error: "Failed to update hand-over" };
      }
    }),
});
