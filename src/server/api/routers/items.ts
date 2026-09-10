import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { serialize } from "@/server/api/serialize";

const insensitive = { mode: "insensitive" } as const;

/** Device IDs are system-generated as zero-padded numbers in this range. */
const DEVICE_ID_MAX = 999999;
const DEVICE_ID_PATTERN = /^\d{6}$/;

/**
 * The next free device ID, or null once the range is exhausted. Rows created
 * before IDs were generated may hold any string, so only strictly numeric
 * 000001-999999 values count towards the sequence.
 */
const computeNextDeviceId = (existing: string[]) => {
  let highest = 0;
  for (const id of existing) {
    if (!DEVICE_ID_PATTERN.test(id)) continue;
    const value = Number(id);
    if (value > highest) highest = value;
  }

  const next = highest + 1;
  return next > DEVICE_ID_MAX ? null : String(next).padStart(6, "0");
};

/** A `YYYY-MM-DD` value from a date input, stored as UTC midnight in the date-only column. */
const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected a YYYY-MM-DD date")
  .transform((value) => new Date(`${value}T00:00:00.000Z`));

/** Prisma reports a broken unique constraint (a device ID race) as P2002. */
const isUniqueViolation = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code?: unknown }).code === "P2002";

export const itemsRouter = createTRPCRouter({
  // GET /api/items
  //
  // The Sequelize route also accepted a `room_id` query param, but `item` has no `room_id`
  // column so that branch could only ever have thrown, and no caller passes it. Dropped.
  list: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        search: z.string().default(""),
        // Exact `i_category` match; "" means "every category".
        category: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit, search, category } = input;
        const offset = (page - 1) * limit;

        // Add search / category filters if provided
        const where = {
          ...(search
            ? {
                OR: [
                  { i_model: { contains: search, ...insensitive } },
                  { i_category: { contains: search, ...insensitive } },
                  { i_brand: { contains: search, ...insensitive } },
                  { i_description: { contains: search, ...insensitive } },
                ],
              }
            : {}),
          ...(category ? { i_category: { equals: category, ...insensitive } } : {}),
        };

        const [rows, count] = await ctx.db.$transaction([
          ctx.db.item.findMany({
            where,
            take: limit,
            skip: offset,
            orderBy: { id: "desc" },
          }),
          ctx.db.item.count({ where }),
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
        console.error("Get items error:", error);
        return {
          success: false as const,
          error: "Failed to fetch items",
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

  // GET /api/items/[id]
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const item = await ctx.db.item.findUnique({ where: { id: input.id } });

        if (!item) {
          return { success: false as const, error: "Item not found" };
        }

        return { success: true as const, data: serialize(item) };
      } catch (error) {
        console.error("Get item error:", error);
        return { success: false as const, error: "Failed to fetch item" };
      }
    }),

  // The device ID the next created item will get, for previewing in the UI.
  nextDeviceID: protectedProcedure.query(async ({ ctx }) => {
    try {
      const rows = await ctx.db.item.findMany({ select: { i_deviceID: true } });
      const deviceId = computeNextDeviceId(rows.map((row) => row.i_deviceID));

      if (!deviceId) {
        return { success: false as const, error: "Device ID range exhausted" };
      }

      return { success: true as const, data: deviceId };
    } catch (error) {
      console.error("Next device ID error:", error);
      return { success: false as const, error: "Failed to generate a device ID" };
    }
  }),

  // POST /api/items
  create: protectedProcedure
    .input(
      z.object({
        i_model: z.string(),
        i_category: z.string(),
        i_brand: z.string(),
        i_description: z.string(),
        i_type: z.string(),
        item_rawstock: z.number(),
        i_status: z.number(),
        i_mr: z.string(),
        i_price: z.number(),
        i_photo: z.string().nullish(),
        i_date_acquired: dateOnly.nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Two admins adding at once can compute the same next ID; the unique
      // constraint rejects the loser, so recompute and try again.
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          const rows = await ctx.db.item.findMany({
            select: { i_deviceID: true },
          });
          const deviceId = computeNextDeviceId(rows.map((row) => row.i_deviceID));

          if (!deviceId) {
            return {
              success: false as const,
              error: "Device ID range exhausted (000001-999999)",
            };
          }

          const newItem = await ctx.db.item.create({
            data: {
              i_deviceID: deviceId,
              i_model: input.i_model,
              i_category: input.i_category,
              i_brand: input.i_brand,
              i_description: input.i_description,
              i_type: input.i_type,
              item_rawstock: input.item_rawstock,
              i_status: input.i_status,
              i_mr: input.i_mr,
              i_price: input.i_price,
              i_photo: input.i_photo || "default.jpg",
              i_date_acquired: input.i_date_acquired ?? null,
            },
          });

          return {
            success: true as const,
            data: serialize(newItem),
            message: "Item created successfully",
          };
        } catch (error) {
          if (isUniqueViolation(error)) continue;

          console.error("Create item error:", error);
          return { success: false as const, error: "Failed to create item" };
        }
      }

      return {
        success: false as const,
        error: "Failed to assign a device ID. Please try again.",
      };
    }),

  // PATCH /api/items/[id]
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          i_deviceID: z.string().optional(),
          i_model: z.string().optional(),
          i_category: z.string().optional(),
          i_brand: z.string().optional(),
          i_description: z.string().optional(),
          i_type: z.string().optional(),
          item_rawstock: z.number().optional(),
          i_status: z.number().optional(),
          i_mr: z.string().optional(),
          i_price: z.number().optional(),
          i_photo: z.string().optional(),
          no_of_items: z.number().nullish(),
          remarks: z.string().nullish(),
          i_date_acquired: dateOnly.nullish(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Find the item first to ensure it exists
        const existingItem = await ctx.db.item.findUnique({
          where: { id: input.id },
        });
        if (!existingItem) {
          return { success: false as const, error: "Item not found" };
        }

        // Update the item
        const updatedItem = await ctx.db.item.update({
          where: { id: input.id },
          data: input.data,
        });

        return {
          success: true as const,
          data: serialize(updatedItem),
          message: "Item updated successfully",
        };
      } catch (error) {
        console.error("Update item error:", error);
        return { success: false as const, error: "Failed to update item" };
      }
    }),

  // DELETE /api/items/[id]
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Find the item first to ensure it exists
        const existingItem = await ctx.db.item.findUnique({
          where: { id: input.id },
        });
        if (!existingItem) {
          return { success: false as const, error: "Item not found" };
        }

        // Delete the item
        await ctx.db.item.delete({ where: { id: input.id } });

        return {
          success: true as const,
          message: "Item deleted successfully",
        };
      } catch (error) {
        console.error("Delete item error:", error);
        return { success: false as const, error: "Failed to delete item" };
      }
    }),
});
