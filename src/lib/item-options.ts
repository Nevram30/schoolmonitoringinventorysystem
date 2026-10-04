// Fixed option lists for an item, shared by the admin items form and the items router.

/** The categories an item can be filed under; stored as-is in `i_category`. */
export const ITEM_CATEGORIES = ['Consumable', 'Electronic Devices'] as const;

/** How `item_rawstock` is counted; stored as-is in `i_unit`. */
export const STOCK_UNITS = ['Per Pieces', 'Per Item', 'Per Bundle'] as const;
export type StockUnit = (typeof STOCK_UNITS)[number];
export const DEFAULT_STOCK_UNIT: StockUnit = 'Per Item';

/** Singular / plural noun the stock quantity is shown with for each unit. */
const UNIT_NOUNS: Record<StockUnit, [string, string]> = {
  'Per Pieces': ['piece', 'pieces'],
  'Per Item': ['item', 'items'],
  'Per Bundle': ['bundle', 'bundles'],
};

export const unitNoun = (unit: string | null | undefined, quantity = 2) => {
  const [one, many] = UNIT_NOUNS[unit as StockUnit] ?? UNIT_NOUNS[DEFAULT_STOCK_UNIT];
  return quantity === 1 ? one : many;
};

/** e.g. `12 pieces`, `1 bundle`. */
export const formatStock = (quantity: number, unit: string | null | undefined) =>
  `${quantity} ${unitNoun(unit, quantity)}`;

/** The item's age status; stored as-is in `i_condition`. Separate from `i_status` (availability). */
export const ITEM_CONDITIONS = ['Existing', 'New', 'Old'] as const;
export type ItemCondition = (typeof ITEM_CONDITIONS)[number];
export const DEFAULT_ITEM_CONDITION: ItemCondition = 'New';

/**
 * The day an item is due for replacement: `lifespanYears` after it was acquired, or null when
 * either is missing. `acquired` is a date-only value (UTC midnight), so the math stays in UTC.
 */
export const replacementDate = (
  acquired: Date | string | null | undefined,
  lifespanYears: number | null | undefined
) => {
  if (!acquired || !lifespanYears) return null;
  const date = new Date(acquired);
  if (Number.isNaN(date.getTime())) return null;
  date.setUTCFullYear(date.getUTCFullYear() + lifespanYears);
  return date;
};
