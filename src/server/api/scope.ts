import type { Borrower, PrismaClient } from "../../../generated/prisma";

/**
 * Which rows the signed-in account is allowed to see.
 *
 * Admins run the school's inventory, so they see all of it. Everyone else sees what belongs to
 * their own `Borrower` record — the borrows they took out, the returns they made and the requests
 * they sent. An account that has never borrowed has no `Borrower` row yet and so has nothing of
 * its own to show.
 */
export type BorrowerScope =
  | { kind: "all" }
  | { kind: "borrower"; borrowerId: number; userId: number }
  | { kind: "none"; userId: number };

/**
 * `Borrower.id` is an autoincrement starting at 1, so this matches no row in any query shape —
 * `findMany`, `count`, `aggregate` and `groupBy` alike. Used instead of an early return so that
 * the account with no borrower record takes the same code path as everyone else.
 */
export const NO_BORROWER_ID = -1;

/**
 * The `Borrower` an account belongs to, or null when it has none yet.
 *
 * The read-only half of `resolveRequesterBorrower` in the borrow-requests router, which resolves
 * the same way and then creates the row when it is missing. Creating from a read is not on — a
 * dashboard that writes a borrower every time someone loads it would fill the table with rows for
 * people who have never borrowed anything.
 */
export async function findBorrowerForUser(
  db: PrismaClient,
  userId: number
): Promise<Borrower | null> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  if (user.id_number) {
    const existing = await db.borrower.findUnique({
      where: { m_school_id: user.id_number },
    });
    if (existing) return existing;
  }

  // An account with no ID number has nothing stable to match on, so fall back to the borrower its
  // last request was filed under — the same fallback the creating resolver uses.
  const previous = await db.borrowRequest.findFirst({
    where: { requested_by: userId },
    orderBy: { id: "desc" },
    select: { Member: true },
  });

  return previous?.Member ?? null;
}

/**
 * The one place the admin bypass is decided — every caller below is role-blind. Admins short
 * circuit before any query, so the full-school screens cost no extra round trip.
 */
export async function borrowerScopeFor(ctx: {
  db: PrismaClient;
  session: { user: { id: number; role: string } };
}): Promise<BorrowerScope> {
  if (ctx.session.user.role === "admin") return { kind: "all" };

  const userId = ctx.session.user.id;
  const borrower = await findBorrowerForUser(ctx.db, userId);

  return borrower
    ? { kind: "borrower", borrowerId: borrower.id, userId }
    : { kind: "none", userId };
}

/**
 * Spread into any `where` on `Borrow`, `Return` or `BorrowRequest` — all three carry `member_id`.
 * An admin contributes nothing, so the query is left exactly as it was before scoping.
 */
export function memberFilter(scope: BorrowerScope): { member_id?: number } {
  switch (scope.kind) {
    case "all":
      return {};
    case "borrower":
      return { member_id: scope.borrowerId };
    case "none":
      return { member_id: NO_BORROWER_ID };
  }
}

/**
 * Scope for `BorrowRequest`, which records both who a request is for and who sent it.
 *
 * Matching on either matters because an admin can file a request on someone's behalf: then
 * `requested_by` is the admin but `member_id` is the borrower, and filtering on the sender alone
 * would hide a pending request from the very person waiting on it.
 *
 * Callers must place this under `AND` rather than spreading it, or a search's own `OR` will
 * overwrite it.
 */
export function requesterFilter(
  scope: BorrowerScope
): Record<string, unknown> {
  switch (scope.kind) {
    case "all":
      return {};
    case "borrower":
      return {
        OR: [
          { requested_by: scope.userId },
          { member_id: scope.borrowerId },
        ],
      };
    case "none":
      // No impossible filter needed: with no borrower row, the requests this account sent are
      // exactly the ones it may see.
      return { requested_by: scope.userId };
  }
}
