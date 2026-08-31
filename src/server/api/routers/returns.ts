import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { serialize } from "@/server/api/serialize";

const insensitive = { mode: "insensitive" } as const;

export const returnsRouter = createTRPCRouter({
  // GET /api/returns
  list: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        search: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit, search } = input;
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
            { r_condition: { contains: search, ...insensitive } },
          ];
        }

        const [rows, count] = await ctx.db.$transaction([
          ctx.db.return.findMany({
            where,
            include: {
              Borrow: {
                select: {
                  b_date_borrowed: true,
                  b_due_date: true,
                  b_quantity: true,
                },
              },
              Item: {
                select: {
                  i_model: true,
                  i_deviceID: true,
                  i_brand: true,
                  i_photo: true,
                  // Needed to price a lost item when the fee policy charges at item price.
                  i_price: true,
                },
              },
              Member: {
                select: { m_fname: true, m_lname: true, m_school_id: true },
              },
              Room: { select: { r_name: true } },
            },
            take: limit,
            skip: offset,
            orderBy: { r_date_returned: "desc" },
          }),
          ctx.db.return.count({ where }),
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
        console.error("Get returns error:", error);
        return {
          success: false as const,
          error: "Failed to fetch returns",
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

  // POST /api/returns
  create: protectedProcedure
    .input(
      z.object({
        borrow_id: z.number(),
        r_quantity: z.number().nullish(),
        r_condition: z.string().nullish(),
        r_notes: z.string().nullish(),
        r_late_fee: z.number().nullish(),
        r_damage_fee: z.number().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if borrow record exists and is not already returned
        const borrow = await ctx.db.borrow.findUnique({
          where: { id: input.borrow_id },
        });
        if (!borrow) {
          return { success: false as const, error: "Borrow record not found" };
        }

        if (borrow.b_date_returned) {
          return {
            success: false as const,
            error: "Item has already been returned",
          };
        }

        // Validate required fields from borrow record
        if (!borrow.member_id || !borrow.item_id) {
          console.error("Missing required fields in borrow record:", {
            member_id: borrow.member_id,
            item_id: borrow.item_id,
            borrow_id: input.borrow_id,
          });
          return {
            success: false as const,
            error: "Invalid borrow record: missing member_id or item_id",
            details: {
              member_id: borrow.member_id,
              item_id: borrow.item_id,
            },
          };
        }

        // Create return record
        const newReturn = await ctx.db.return.create({
          data: {
            borrow_id: input.borrow_id,
            member_id: borrow.member_id,
            item_id: borrow.item_id,
            room_id: borrow.room_id,
            r_quantity: input.r_quantity || borrow.b_quantity,
            r_condition: input.r_condition || "Good",
            r_notes: input.r_notes || null,
            r_late_fee: input.r_late_fee || 0.0,
            r_damage_fee: input.r_damage_fee || 0.0,
          },
        });

        // Update borrow record to mark as returned
        await ctx.db.borrow.update({
          where: { id: input.borrow_id },
          data: {
            b_date_returned: new Date(),
            b_status: 2, // 2 = returned
          },
        });

        // Return stock to item
        const item = await ctx.db.item.findUnique({
          where: { id: borrow.item_id },
        });
        if (item) {
          await ctx.db.item.update({
            where: { id: borrow.item_id },
            data: {
              item_rawstock:
                item.item_rawstock + (input.r_quantity || borrow.b_quantity),
            },
          });
        }

        return {
          success: true as const,
          data: serialize(newReturn),
          message: "Item returned successfully",
        };
      } catch (error) {
        console.error("Create return error:", error);
        console.error(
          "Error details:",
          error instanceof Error ? error.message : "Unknown error"
        );
        return {
          success: false as const,
          error: `Failed to process return: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        };
      }
    }),

  // PATCH /api/returns/:id — fees only.
  //
  // Faculty and staff record the return itself; assessing what the borrower owes is an admin
  // decision, so this is the one place late and damage fees can be changed.
  updateFees: adminProcedure
    .input(
      z.object({
        id: z.number(),
        r_late_fee: z.number().min(0),
        r_damage_fee: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existing = await ctx.db.return.findUnique({
          where: { id: input.id },
        });
        if (!existing) {
          return { success: false as const, error: "Return record not found" };
        }

        const updated = await ctx.db.return.update({
          where: { id: input.id },
          data: {
            r_late_fee: input.r_late_fee,
            r_damage_fee: input.r_damage_fee,
          },
        });

        return {
          success: true as const,
          data: serialize(updated),
          message: "Fees updated successfully",
        };
      } catch (error) {
        console.error("Update return fees error:", error);
        return { success: false as const, error: "Failed to update fees" };
      }
    }),
});
