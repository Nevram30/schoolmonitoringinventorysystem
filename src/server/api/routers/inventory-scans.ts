import { z } from "zod";

import type { Prisma } from "../../../../generated/prisma";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { serialize } from "@/server/api/serialize";

/** Same rules as `items.byDeviceIds`, which the scanner used before scans were kept here. */
const deviceIdInput = z.string().trim().min(1).max(50);
/** The most scanned items one account's list holds. */
const MAX_SCANS = 500;

type ScanWithItem = Prisma.InventoryScanGetPayload<{ include: { Item: true } }>;

/** The shape the inventory page keeps per scanned label, with the item's current details. */
const toScan = (row: ScanWithItem) => ({
  deviceId: row.Item.i_deviceID,
  count: row.s_count,
  firstScannedAt: row.first_scanned_at.getTime(),
  lastScannedAt: row.last_scanned_at.getTime(),
  item: serialize(row.Item),
});

/** Prisma reports a broken unique constraint (two devices creating the same row) as P2002. */
const isUniqueViolation = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code?: unknown }).code === "P2002";

// The /admin/inventory count. Each account has its own list, stored here rather than in the
// browser so the same user sees the same count on every device.
export const inventoryScansRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const rows = await ctx.db.inventoryScan.findMany({
        where: { user_id: ctx.session.user.id },
        include: { Item: true },
        orderBy: { last_scanned_at: "desc" },
        take: MAX_SCANS,
      });

      return { success: true as const, data: rows.map(toScan) };
    } catch (error) {
      console.error("List inventory scans error:", error);
      return { success: false as const, error: "Failed to load scanned items" };
    }
  }),

  // One scan of a label: the first adds the item to the list, each later one counts another unit.
  scan: protectedProcedure
    .input(z.object({ deviceId: deviceIdInput }))
    .mutation(async ({ ctx, input }) => {
      const user_id = ctx.session.user.id;

      try {
        const item = await ctx.db.item.findUnique({
          where: { i_deviceID: input.deviceId },
          select: { id: true },
        });
        if (!item) {
          return { success: false as const, missing: true, error: "No item matches this barcode" };
        }

        const now = new Date();
        const save = () =>
          ctx.db.$transaction([
            ctx.db.inventoryScan.upsert({
              where: { user_id_item_id: { user_id, item_id: item.id } },
              create: { user_id, item_id: item.id, first_scanned_at: now, last_scanned_at: now },
              // Incremented in the database, so scans from two devices at once both count.
              update: { s_count: { increment: 1 }, last_scanned_at: now },
              include: { Item: true },
            }),
            // The monthly history keeps every scan, even after "Clear list".
            ctx.db.inventoryScanLog.create({ data: { user_id, item_id: item.id, scanned_at: now } }),
          ]);

        let row: ScanWithItem;
        try {
          [row] = await save();
        } catch (error) {
          // Another device created the row between the lookup and the insert; now it exists.
          if (!isUniqueViolation(error)) throw error;
          [row] = await save();
        }

        return { success: true as const, data: toScan(row) };
      } catch (error) {
        console.error("Save inventory scan error:", error);
        return { success: false as const, missing: false, error: "Failed to save the scan" };
      }
    }),

  remove: protectedProcedure
    .input(z.object({ deviceId: deviceIdInput }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.inventoryScan.deleteMany({
          where: { user_id: ctx.session.user.id, Item: { i_deviceID: input.deviceId } },
        });
        return { success: true as const };
      } catch (error) {
        console.error("Remove inventory scan error:", error);
        return { success: false as const, error: "Failed to remove the item" };
      }
    }),

  // "Clear list": starts a new count. The scan log behind the monthly history is kept.
  clear: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      await ctx.db.inventoryScan.deleteMany({ where: { user_id: ctx.session.user.id } });
      return { success: true as const };
    } catch (error) {
      console.error("Clear inventory scans error:", error);
      return { success: false as const, error: "Failed to clear the list" };
    }
  }),

  // /admin/inventory/history: what this account counted in [from, to), one row per item. The
  // page sends the start of a month and of the next one in the user's own time zone.
  history: protectedProcedure
    .input(
      z
        .object({
          from: z.number().int().nonnegative(),
          to: z.number().int().nonnegative(),
        })
        .refine((range) => range.to > range.from, "`to` must be after `from`")
    )
    .query(async ({ ctx, input }) => {
      try {
        const groups = await ctx.db.inventoryScanLog.groupBy({
          by: ["item_id"],
          where: {
            user_id: ctx.session.user.id,
            scanned_at: { gte: new Date(input.from), lt: new Date(input.to) },
          },
          _count: { _all: true },
          _min: { scanned_at: true },
          _max: { scanned_at: true },
        });

        const items = await ctx.db.item.findMany({
          where: { id: { in: groups.map((group) => group.item_id) } },
        });
        const itemsById = new Map(items.map((item) => [item.id, item]));

        const data = groups
          .flatMap((group) => {
            const item = itemsById.get(group.item_id);
            if (!item) return [];
            return [
              {
                deviceId: item.i_deviceID,
                count: group._count._all,
                firstScannedAt: group._min.scanned_at?.getTime() ?? input.from,
                lastScannedAt: group._max.scanned_at?.getTime() ?? input.from,
                item: serialize(item),
              },
            ];
          })
          .sort((a, b) => b.lastScannedAt - a.lastScannedAt);

        return { success: true as const, data };
      } catch (error) {
        console.error("Inventory history error:", error);
        return { success: false as const, error: "Failed to load the inventory history" };
      }
    }),

  // Moves a count an earlier version of the page kept in the browser onto the account. Keeping
  // the larger count (rather than adding) makes a repeated upload harmless. Device IDs that no
  // longer match an item are skipped.
  importLocal: protectedProcedure
    .input(
      z.object({
        records: z
          .array(
            z.object({
              deviceId: deviceIdInput,
              count: z.number().int().min(1).max(1_000_000),
              firstScannedAt: z.number().int().nonnegative(),
              lastScannedAt: z.number().int().nonnegative(),
            })
          )
          .max(MAX_SCANS),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user_id = ctx.session.user.id;

      try {
        const items = await ctx.db.item.findMany({
          where: { i_deviceID: { in: input.records.map((record) => record.deviceId) } },
          select: { id: true, i_deviceID: true },
        });
        const itemIds = new Map(items.map((item) => [item.i_deviceID, item.id]));

        const existing = await ctx.db.inventoryScan.findMany({
          where: { user_id, item_id: { in: items.map((item) => item.id) } },
        });
        const existingByItem = new Map(existing.map((row) => [row.item_id, row]));

        const writes = input.records.flatMap((record) => {
          const item_id = itemIds.get(record.deviceId);
          if (item_id === undefined) return [];

          const first = new Date(record.firstScannedAt);
          const last = new Date(record.lastScannedAt);
          const row = existingByItem.get(item_id);
          if (!row) {
            existingByItem.set(item_id, {
              id: 0,
              user_id,
              item_id,
              s_count: record.count,
              first_scanned_at: first,
              last_scanned_at: last,
            });
            return [
              ctx.db.inventoryScan.create({
                data: {
                  user_id,
                  item_id,
                  s_count: record.count,
                  first_scanned_at: first,
                  last_scanned_at: last,
                },
              }),
            ];
          }

          return [
            ctx.db.inventoryScan.update({
              where: { user_id_item_id: { user_id, item_id } },
              data: {
                s_count: Math.max(row.s_count, record.count),
                first_scanned_at: first < row.first_scanned_at ? first : row.first_scanned_at,
                last_scanned_at: last > row.last_scanned_at ? last : row.last_scanned_at,
              },
            }),
          ];
        });

        await ctx.db.$transaction(writes);
        return { success: true as const, imported: writes.length };
      } catch (error) {
        console.error("Import inventory scans error:", error);
        return { success: false as const, error: "Failed to move the saved scans to your account" };
      }
    }),
});
