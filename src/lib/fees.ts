/**
 * The school's fee policy, and the arithmetic that turns it into an amount owed.
 *
 * The admin edits the policy on /admin/settings; the returned-items screen calls
 * `suggestFees` to pre-fill the fee modal. Nothing here writes to the database, so both the
 * tRPC router and the client pages can use it.
 */

export interface FeeSettings {
  /** Amount charged for each chargeable day an item is late. */
  f_overdue_fee_per_day: number;
  /** Days past the due date that are not charged at all. */
  f_overdue_grace_days: number;
  /** Ceiling on the total late fee. 0 means no ceiling. */
  f_overdue_max_fee: number;
  f_damage_fee_fair: number;
  f_damage_fee_damaged: number;
  f_damage_fee_lost: number;
  /** Charge a lost item at the item's own price rather than the flat lost fee. */
  f_lost_charge_item_price: boolean;
}

/** Used before the admin has saved a policy, and by `getFees` when the row is missing. */
export const DEFAULT_FEE_SETTINGS: FeeSettings = {
  f_overdue_fee_per_day: 0,
  f_overdue_grace_days: 0,
  f_overdue_max_fee: 0,
  f_damage_fee_fair: 0,
  f_damage_fee_damaged: 0,
  f_damage_fee_lost: 0,
  f_lost_charge_item_price: false,
};

/** The conditions the return form offers. `Good` is never charged a damage fee. */
export const RETURN_CONDITIONS = ['Good', 'Fair', 'Damaged', 'Lost'] as const;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const round2 = (value: number) => Math.round(value * 100) / 100;

/**
 * Whole days between the due date and the return, ignoring the time of day so an item returned
 * later on its due date is not counted as a day late.
 */
export function daysLate(dueDate: Date | string, returnedAt: Date | string): number {
  const due = new Date(dueDate);
  const returned = new Date(returnedAt);
  if (isNaN(due.getTime()) || isNaN(returned.getTime())) return 0;

  const dueDay = Date.UTC(due.getFullYear(), due.getMonth(), due.getDate());
  const returnedDay = Date.UTC(
    returned.getFullYear(),
    returned.getMonth(),
    returned.getDate()
  );

  return Math.max(0, Math.round((returnedDay - dueDay) / MS_PER_DAY));
}

export interface OverdueFee {
  /** Calendar days past the due date, before the grace period is applied. */
  daysLate: number;
  /** Days actually billed — `daysLate` minus the grace period. */
  chargeableDays: number;
  fee: number;
  /** True when the cap trimmed the fee, so the UI can say so. */
  capped: boolean;
}

/**
 * The late fee owed on an item that is out past its due date.
 *
 * `asOf` is the return date for an item already back, or today for one still outstanding — the
 * overdue screen passes today so the fee shown grows each day the item stays out.
 */
export function calculateOverdueFee(
  settings: FeeSettings,
  dueDate: Date | string | null | undefined,
  asOf: Date | string
): OverdueFee {
  const late = dueDate ? daysLate(dueDate, asOf) : 0;
  const chargeableDays = Math.max(0, late - (settings.f_overdue_grace_days || 0));

  let fee = round2(chargeableDays * (settings.f_overdue_fee_per_day || 0));
  const cap = settings.f_overdue_max_fee || 0;
  const capped = cap > 0 && fee > cap;
  if (capped) fee = cap;

  return { daysLate: late, chargeableDays, fee, capped };
}

export interface SuggestFeesInput {
  dueDate?: Date | string | null;
  returnedAt: Date | string;
  condition?: string | null;
  quantity?: number | null;
  /** Unit price of the item, used when the policy charges lost items at item price. */
  itemPrice?: number | null;
}

export interface SuggestedFees {
  lateFee: number;
  damageFee: number;
  /** Calendar days past the due date, before the grace period is applied. */
  daysLate: number;
  /** Days actually billed — `daysLate` minus the grace period. */
  chargeableDays: number;
  /** True when the cap trimmed the late fee, so the UI can say so. */
  lateFeeCapped: boolean;
}

export function suggestFees(
  settings: FeeSettings,
  input: SuggestFeesInput
): SuggestedFees {
  const overdue = calculateOverdueFee(settings, input.dueDate, input.returnedAt);

  const quantity = Math.max(1, input.quantity ?? 1);
  const condition = (input.condition ?? 'Good').toLowerCase();

  let perUnitDamage = 0;
  if (condition === 'fair') {
    perUnitDamage = settings.f_damage_fee_fair || 0;
  } else if (condition === 'damaged') {
    perUnitDamage = settings.f_damage_fee_damaged || 0;
  } else if (condition === 'lost') {
    perUnitDamage = settings.f_lost_charge_item_price
      ? (input.itemPrice ?? 0)
      : settings.f_damage_fee_lost || 0;
  }

  return {
    lateFee: overdue.fee,
    damageFee: round2(perUnitDamage * quantity),
    daysLate: overdue.daysLate,
    chargeableDays: overdue.chargeableDays,
    lateFeeCapped: overdue.capped,
  };
}
