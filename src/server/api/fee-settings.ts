import type { PrismaClient } from "../../../generated/prisma";

import { DEFAULT_FEE_SETTINGS, type FeeSettings } from "@/lib/fees";
import { serialize } from "@/server/api/serialize";

/** The fee policy lives in a single row so every screen edits and reads the same record. */
export const FEE_SETTING_ID = 1;

/**
 * The saved fee policy, or the zeroed defaults when the admin has not configured one yet —
 * an unconfigured system charges nothing rather than failing.
 */
export async function loadFeeSettings(db: PrismaClient): Promise<FeeSettings> {
  const row = await db.feeSetting.findUnique({ where: { id: FEE_SETTING_ID } });
  if (!row) return DEFAULT_FEE_SETTINGS;

  const { id, updatedAt, ...settings } = serialize(row);
  return settings;
}
