import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { serialize } from "@/server/api/serialize";
import { FEE_SETTING_ID } from "@/server/api/fee-settings";
import { DEFAULT_FEE_SETTINGS } from "@/lib/fees";

const money = z.number().min(0).max(999999.99);

const feeSettingsInput = z.object({
  f_overdue_fee_per_day: money,
  f_overdue_grace_days: z.number().int().min(0).max(365),
  f_overdue_max_fee: money,
  f_damage_fee_fair: money,
  f_damage_fee_damaged: money,
  f_damage_fee_lost: money,
  f_lost_charge_item_price: z.boolean(),
});

export const settingsRouter = createTRPCRouter({
  // GET /api/settings/fees
  //
  // Readable by any signed-in user: the return screens show what a borrower will be charged.
  getFees: protectedProcedure.query(async ({ ctx }) => {
    try {
      const row = await ctx.db.feeSetting.findUnique({
        where: { id: FEE_SETTING_ID },
      });

      return {
        success: true as const,
        // Before the admin saves for the first time there is no row; the zeroed defaults mean
        // nothing is charged, which is the right behaviour for an unconfigured system.
        data: row
          ? serialize(row)
          : { id: FEE_SETTING_ID, ...DEFAULT_FEE_SETTINGS, updatedAt: null },
      };
    } catch (error) {
      console.error("Get fee settings error:", error);
      return {
        success: false as const,
        error: "Failed to load fee settings",
        data: { id: FEE_SETTING_ID, ...DEFAULT_FEE_SETTINGS, updatedAt: null },
      };
    }
  }),

  // PUT /api/settings/fees — admin only, same reasoning as returns.updateFees.
  updateFees: adminProcedure
    .input(feeSettingsInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const saved = await ctx.db.feeSetting.upsert({
          where: { id: FEE_SETTING_ID },
          create: { id: FEE_SETTING_ID, ...input },
          update: input,
        });

        return {
          success: true as const,
          data: serialize(saved),
          message: "Fee settings saved",
        };
      } catch (error) {
        console.error("Update fee settings error:", error);
        return { success: false as const, error: "Failed to save fee settings" };
      }
    }),
});
