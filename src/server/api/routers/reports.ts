import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { serialize } from "@/server/api/serialize";
import {
  borrowerScopeFor,
  memberFilter,
  requesterFilter,
} from "@/server/api/scope";

const dateRange = z.object({
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
});

/** Mirrors the `whereClause.b_date_borrowed` between-filter from the REST route. */
const buildWhere = (input: z.infer<typeof dateRange>) => {
  const where: any = {};

  if (input.startDate && input.endDate) {
    where.b_date_borrowed = {
      gte: new Date(input.startDate),
      lte: new Date(input.endDate),
    };
  }

  return where;
};

/** Same range as `buildWhere`, but for the column the returns table is dated by. */
const buildReturnWhere = (input: z.infer<typeof dateRange>) => {
  const where: any = {};

  if (input.startDate && input.endDate) {
    where.r_date_returned = {
      gte: new Date(input.startDate),
      lte: new Date(input.endDate),
    };
  }

  return where;
};

/** `Item.i_status` codes, in the order the inventory-condition card lists them. */
const ITEM_STATUS_LABELS: Record<number, string> = {
  1: "Available",
  2: "Borrowed",
  3: "Maintenance",
  4: "Damaged",
};

/** How many items the "most borrowed per month" chart names; the rest are summed as "Other". */
const TOP_ITEM_COUNT = 5;

const isValidTimeZone = (timeZone: string) => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
};

/**
 * Buckets a moment into its "YYYY-MM" month as seen in `timeZone`, so a borrow made just after
 * midnight on the 1st counts toward the month the admin saw it happen in, not the server's.
 */
const monthKeyFormatter = (timeZone: string) => {
  const format = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
  });

  return (date: Date) => {
    const parts = format.formatToParts(date);
    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    return `${year}-${month}`;
  };
};

/** The `count` month keys ending at `currentKey`, oldest first. */
const lastMonthKeys = (currentKey: string, count: number) => {
  const [year = 1970, month = 1] = currentKey.split("-").map(Number);
  const current = year * 12 + (month - 1);

  return Array.from({ length: count }, (_, i) => {
    const index = current - (count - 1 - i);
    return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}`;
  });
};

export const reportsRouter = createTRPCRouter({
  /**
   * The figures the student / staff / faculty dashboards show: what is out on loan, what came
   * back and in what condition, and what the returns added up to in late and damage fees.
   *
   * Scoped exactly like the other pages in those portals — the signed-in account's own borrows and
   * returns — so the totals here agree with what their Borrowed Items and Returned Items screens
   * list. An admin loading it sees the school-wide figures instead.
   *
   * The one exception is the inventory condition breakdown, which stays school-wide: item status
   * describes the stock on the shelf, not anybody's borrowing.
   */
  portalDashboard: protectedProcedure
    .input(dateRange.default({}))
    .query(async ({ ctx, input }) => {
      try {
        const scope = await borrowerScopeFor(ctx);
        // Empty for an admin, so every figure below stays school-wide for them.
        const mine = memberFilter(scope);
        const borrowWhere = { ...buildWhere(input), ...mine };
        const returnWhere = { ...buildReturnWhere(input), ...mine };
        const requestWhere = { ...requesterFilter(scope), br_status: 1 };
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const [
          totalBorrows,
          activeBorrows,
          overdueBorrows,
          returnedBorrows,
          borrowedQuantity,
          pendingRequests,
          totalReturns,
          returnsThisMonth,
          feeTotals,
          feesThisMonth,
          conditionGroups,
          itemStatusGroups,
          recentReturns,
          overdueItems,
        ] = await Promise.all([
          ctx.db.borrow.count({ where: borrowWhere }),
          ctx.db.borrow.count({ where: { ...borrowWhere, b_status: 1 } }),
          ctx.db.borrow.count({
            where: { ...borrowWhere, b_status: 1, b_due_date: { lt: now } },
          }),
          ctx.db.borrow.count({ where: { ...borrowWhere, b_status: 2 } }),
          ctx.db.borrow.aggregate({
            where: { ...borrowWhere, b_status: 1 },
            _sum: { b_quantity: true },
          }),
          ctx.db.borrowRequest.count({ where: requestWhere }),
          ctx.db.return.count({ where: returnWhere }),
          ctx.db.return.count({
            where: { ...returnWhere, r_date_returned: { gte: monthStart } },
          }),
          ctx.db.return.aggregate({
            where: returnWhere,
            _sum: { r_late_fee: true, r_damage_fee: true },
          }),
          ctx.db.return.aggregate({
            where: { ...returnWhere, r_date_returned: { gte: monthStart } },
            _sum: { r_late_fee: true, r_damage_fee: true },
          }),
          ctx.db.return.groupBy({
            by: ["r_condition"],
            where: returnWhere,
            _count: { _all: true },
            _sum: { r_damage_fee: true, r_quantity: true },
          }),
          // Deliberately unscoped: the condition of the school's stock, which the portals already
          // browse in full, not a breakdown of what this account happens to have borrowed.
          ctx.db.item.groupBy({
            by: ["i_status"],
            _count: { _all: true },
          }),
          ctx.db.return.findMany({
            where: returnWhere,
            include: {
              Item: { select: { i_model: true, i_deviceID: true, i_brand: true } },
              Member: { select: { m_fname: true, m_lname: true } },
              Room: { select: { r_name: true } },
            },
            orderBy: { r_date_returned: "desc" },
            take: 5,
          }),
          ctx.db.borrow.findMany({
            where: { ...borrowWhere, b_status: 1, b_due_date: { lt: now } },
            include: {
              Item: { select: { i_model: true, i_deviceID: true } },
              Member: { select: { m_fname: true, m_lname: true } },
            },
            orderBy: { b_due_date: "asc" },
            take: 5,
          }),
        ]);

        const lateFees = feeTotals._sum.r_late_fee?.toNumber() ?? 0;
        const damageFees = feeTotals._sum.r_damage_fee?.toNumber() ?? 0;

        // A return saved before the condition dropdown existed has none; it is still a return,
        // so it is counted rather than dropped from the breakdown.
        const conditions = conditionGroups
          .map((row) => ({
            condition: row.r_condition ?? "Unspecified",
            count: row._count._all,
            quantity: row._sum.r_quantity ?? 0,
            damageFee: row._sum.r_damage_fee?.toNumber() ?? 0,
          }))
          .sort((a, b) => b.count - a.count);

        const itemConditions = Object.entries(ITEM_STATUS_LABELS).map(
          ([code, label]) => ({
            status: Number(code),
            label,
            count:
              itemStatusGroups.find((row) => row.i_status === Number(code))
                ?._count._all ?? 0,
          })
        );

        return {
          success: true as const,
          data: {
            borrowed: {
              total: totalBorrows,
              active: activeBorrows,
              overdue: overdueBorrows,
              returned: returnedBorrows,
              quantityOut: borrowedQuantity._sum.b_quantity ?? 0,
              pendingRequests,
            },
            returns: {
              total: totalReturns,
              thisMonth: returnsThisMonth,
            },
            fees: {
              lateFees,
              damageFees,
              total: lateFees + damageFees,
              lateFeesThisMonth: feesThisMonth._sum.r_late_fee?.toNumber() ?? 0,
              damageFeesThisMonth:
                feesThisMonth._sum.r_damage_fee?.toNumber() ?? 0,
            },
            conditions,
            itemConditions,
            recentReturns: recentReturns.map(serialize),
            overdueItems: overdueItems.map(serialize),
          },
        };
      } catch (error) {
        console.error("Portal dashboard report error:", error);
        return {
          success: false as const,
          error: "Failed to load dashboard report",
        };
      }
    }),

  // GET /api/reports?type=summary
  //
  // Admin-only, like the three reports below it: these are school-wide by design, so leaving them
  // open to any signed-in account would hand back everything the portal scoping withholds.
  summary: adminProcedure
    .input(dateRange)
    .query(async ({ ctx, input }) => {
      try {
        const where = buildWhere(input);

        // Get summary statistics
        const totalBorrows = await ctx.db.borrow.count({ where });
        const activeBorrows = await ctx.db.borrow.count({
          where: { ...where, b_status: 1 },
        });
        const returnedBorrows = await ctx.db.borrow.count({
          where: { ...where, b_status: 2 },
        });
        const overdueBorrows = await ctx.db.borrow.count({
          where: { ...where, b_status: 1, b_due_date: { lt: new Date() } },
        });

        // Get most borrowed items
        const mostBorrowedItems = await ctx.db.borrow.groupBy({
          by: ["item_id"],
          where,
          _count: { item_id: true },
          orderBy: { _count: { item_id: "desc" } },
          take: 10,
        });

        const borrowedItemDetails = await ctx.db.item.findMany({
          where: { id: { in: mostBorrowedItems.map((row) => row.item_id) } },
          // i_photo / i_brand drive the thumbnail shown beside each popular item.
          select: {
            id: true,
            i_model: true,
            i_deviceID: true,
            i_photo: true,
            i_brand: true,
          },
        });

        // Get most active borrowers (computed for parity with the REST route, which also
        // queried this without surfacing it in the response payload)
        await ctx.db.borrow.groupBy({
          by: ["member_id"],
          where,
          _count: { member_id: true },
          orderBy: { _count: { member_id: "desc" } },
          take: 10,
        });

        // Get total counts for items, members, rooms
        const totalItems = await ctx.db.item.count();
        const totalMembers = await ctx.db.borrower.count();
        const totalRooms = await ctx.db.room.count();

        // Transform mostBorrowedItems to match frontend expectations
        const popularItems = mostBorrowedItems.map((row) => {
          const item = borrowedItemDetails.find((i) => i.id === row.item_id);
          return {
            id: row.item_id,
            i_model: item?.i_model || "Unknown",
            i_deviceID: item?.i_deviceID || "Unknown",
            i_photo: item?.i_photo ?? null,
            i_brand: item?.i_brand ?? null,
            borrowCount: row._count.item_id,
          };
        });

        // Create comprehensive recent activity from multiple sources
        const activities: any[] = [];

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        // Get recent borrows (last 30 days)
        const recentBorrows = await ctx.db.borrow.findMany({
          where: { b_date_borrowed: { gte: thirtyDaysAgo } },
          include: {
            Item: { select: { i_model: true, i_deviceID: true } },
            Member: { select: { m_fname: true, m_lname: true } },
          },
          orderBy: { b_date_borrowed: "desc" },
          take: 15,
        });

        // Add borrow activities
        recentBorrows.forEach((borrow) => {
          const memberName = `${borrow.Member?.m_fname || "Unknown"} ${
            borrow.Member?.m_lname || "Member"
          }`;
          const itemName = borrow.Item?.i_model || "Unknown Item";
          const deviceId = borrow.Item?.i_deviceID || "N/A";

          activities.push({
            id: `borrow-${borrow.id}`,
            type: "borrow",
            description: `${memberName} borrowed ${itemName} (${deviceId})`,
            date: borrow.b_date_borrowed,
          });
        });

        // Get recent returns (last 30 days) - only get records with actual return dates
        const recentReturns = await ctx.db.borrow.findMany({
          where: {
            b_status: 2, // Returned status
            b_date_returned: { not: null, gte: thirtyDaysAgo },
          },
          include: {
            Item: { select: { i_model: true, i_deviceID: true } },
            Member: { select: { m_fname: true, m_lname: true } },
          },
          orderBy: { b_date_returned: "desc" },
          take: 15,
        });

        // Add return activities
        recentReturns.forEach((borrow) => {
          const memberName = `${borrow.Member?.m_fname || "Unknown"} ${
            borrow.Member?.m_lname || "Member"
          }`;
          const itemName = borrow.Item?.i_model || "Unknown Item";
          const deviceId = borrow.Item?.i_deviceID || "N/A";

          activities.push({
            id: `return-${borrow.id}`,
            type: "return",
            description: `${memberName} returned ${itemName} (${deviceId})`,
            date: borrow.b_date_returned,
          });
        });

        // Get overdue items for activity feed
        const overdueForActivity = await ctx.db.borrow.findMany({
          where: {
            b_status: 1, // Still borrowed
            b_due_date: { lt: new Date() },
          },
          include: {
            Item: { select: { i_model: true, i_deviceID: true } },
            Member: { select: { m_fname: true, m_lname: true } },
          },
          orderBy: { b_due_date: "asc" },
          take: 5,
        });

        // Add overdue activities
        overdueForActivity.forEach((borrow) => {
          const daysOverdue = Math.floor(
            (new Date().getTime() - new Date(borrow.b_due_date).getTime()) /
              (1000 * 60 * 60 * 24)
          );
          const memberName = `${borrow.Member?.m_fname || "Unknown"} ${
            borrow.Member?.m_lname || "Member"
          }`;
          const itemName = borrow.Item?.i_model || "Unknown Item";
          const deviceId = borrow.Item?.i_deviceID || "N/A";

          activities.push({
            id: `overdue-${borrow.id}`,
            type: "overdue",
            description: `${itemName} (${deviceId}) is ${daysOverdue} day${
              daysOverdue > 1 ? "s" : ""
            } overdue - borrowed by ${memberName}`,
            date: borrow.b_due_date,
          });
        });

        // Sort all activities by date (most recent first) and limit to 15
        const recentActivity = activities
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 15);

        return {
          success: true as const,
          data: {
            totalBorrows,
            totalItems,
            totalMembers,
            totalRooms,
            activeBorrows,
            overdueBorrows,
            returnedThisMonth: returnedBorrows,
            popularItems,
            recentActivity,
          },
        };
      } catch (error) {
        console.error("Reports API error:", error);
        return {
          success: false as const,
          error: "Failed to generate report",
        };
      }
    }),

  // GET /api/reports?type=detailed
  detailed: adminProcedure
    .input(dateRange)
    .query(async ({ ctx, input }) => {
      try {
        // Get detailed borrow records
        const detailedBorrows = await ctx.db.borrow.findMany({
          where: buildWhere(input),
          include: {
            Item: { select: { i_model: true, i_deviceID: true } },
            Member: { select: { m_fname: true, m_lname: true } },
            Room: { select: { r_name: true } },
          },
          orderBy: { b_date_borrowed: "desc" },
        });

        return {
          success: true as const,
          data: detailedBorrows.map(serialize),
        };
      } catch (error) {
        console.error("Reports API error:", error);
        return {
          success: false as const,
          error: "Failed to generate report",
          data: [],
        };
      }
    }),

  // GET /api/reports?type=overdue
  overdue: adminProcedure
    .input(dateRange)
    .query(async ({ ctx, input }) => {
      try {
        // Get overdue items
        const overdueItems = await ctx.db.borrow.findMany({
          where: {
            ...buildWhere(input),
            b_status: 1, // Still borrowed
            b_due_date: { lt: new Date() },
          },
          include: {
            Item: { select: { i_model: true, i_deviceID: true } },
            Member: {
              select: { m_fname: true, m_lname: true, m_contact: true },
            },
            Room: { select: { r_name: true } },
          },
          orderBy: { b_due_date: "asc" },
        });

        return {
          success: true as const,
          data: overdueItems.map(serialize),
        };
      } catch (error) {
        console.error("Reports API error:", error);
        return {
          success: false as const,
          error: "Failed to generate report",
          data: [],
        };
      }
    }),

  /**
   * Month-by-month series behind the admin dashboard charts: borrowing activity, the most
   * borrowed items per month, and the departments that borrow the most. Counts are borrow
   * transactions — the same unit the Reports page's "Most Borrowed Items" uses.
   */
  dashboardCharts: adminProcedure
    .input(
      z.object({
        months: z.number().int().min(1).max(24).default(6),
        // The admin's browser timezone, so month boundaries match their calendar.
        timeZone: z.string().default("UTC"),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const timeZone = isValidTimeZone(input.timeZone) ? input.timeZone : "UTC";
        const monthKeyOf = monthKeyFormatter(timeZone);
        const keys = lastMonthKeys(monthKeyOf(new Date()), input.months);
        const inWindow = new Set(keys);

        // Fetch from a day before the first month in UTC — no timezone is further than that
        // from UTC — and let the month key decide what actually falls in the window.
        const [firstYear = 1970, firstMonth = 1] = keys[0]!.split("-").map(Number);
        const since = new Date(
          Date.UTC(firstYear, firstMonth - 1, 1) - 24 * 60 * 60 * 1000
        );

        const [borrows, returns] = await Promise.all([
          ctx.db.borrow.findMany({
            where: { b_date_borrowed: { gte: since } },
            select: {
              b_date_borrowed: true,
              item_id: true,
              member_id: true,
              Member: { select: { m_department: true } },
            },
          }),
          ctx.db.return.findMany({
            where: { r_date_returned: { gte: since } },
            select: { r_date_returned: true },
          }),
        ]);

        const borrowedByMonth = new Map<string, number>();
        const returnedByMonth = new Map<string, number>();
        const itemTotals = new Map<number, number>();
        const itemsByMonth = new Map<string, Map<number, number>>();
        const departments = new Map<string, { count: number; borrowers: Set<number> }>();

        for (const borrow of borrows) {
          const key = monthKeyOf(borrow.b_date_borrowed);
          if (!inWindow.has(key)) continue;

          borrowedByMonth.set(key, (borrowedByMonth.get(key) ?? 0) + 1);
          itemTotals.set(borrow.item_id, (itemTotals.get(borrow.item_id) ?? 0) + 1);

          const monthItems = itemsByMonth.get(key) ?? new Map<number, number>();
          monthItems.set(borrow.item_id, (monthItems.get(borrow.item_id) ?? 0) + 1);
          itemsByMonth.set(key, monthItems);

          const department = borrow.Member?.m_department?.trim() || "Unspecified";
          const entry = departments.get(department) ?? { count: 0, borrowers: new Set<number>() };
          entry.count += 1;
          entry.borrowers.add(borrow.member_id);
          departments.set(department, entry);
        }

        for (const row of returns) {
          const key = monthKeyOf(row.r_date_returned);
          if (inWindow.has(key)) {
            returnedByMonth.set(key, (returnedByMonth.get(key) ?? 0) + 1);
          }
        }

        // Ties go to the older item so the ranking is stable between refreshes.
        const topIds = [...itemTotals.entries()]
          .sort((a, b) => b[1] - a[1] || a[0] - b[0])
          .slice(0, TOP_ITEM_COUNT)
          .map(([id]) => id);

        const topItemRows = await ctx.db.item.findMany({
          where: { id: { in: topIds } },
          select: { id: true, i_model: true, i_deviceID: true },
        });

        const topItems = topIds.map((id) => {
          const item = topItemRows.find((row) => row.id === id);
          return {
            id,
            i_model: item?.i_model ?? "Unknown item",
            i_deviceID: item?.i_deviceID ?? "",
            total: itemTotals.get(id) ?? 0,
          };
        });

        return {
          success: true as const,
          data: {
            months: keys.map((key) => ({
              key,
              borrowed: borrowedByMonth.get(key) ?? 0,
              returned: returnedByMonth.get(key) ?? 0,
            })),
            topItems,
            // `counts` lines up with `topItems`; `other` is every other item that month.
            itemsByMonth: keys.map((key) => {
              const monthItems = itemsByMonth.get(key);
              const counts = topIds.map((id) => monthItems?.get(id) ?? 0);
              const total = borrowedByMonth.get(key) ?? 0;
              return {
                key,
                counts,
                other: total - counts.reduce((sum, count) => sum + count, 0),
              };
            }),
            departments: [...departments.entries()]
              .map(([department, entry]) => ({
                department,
                count: entry.count,
                borrowers: entry.borrowers.size,
              }))
              .sort((a, b) => b.count - a.count || a.department.localeCompare(b.department)),
          },
        };
      } catch (error) {
        console.error("Dashboard charts error:", error);
        return {
          success: false as const,
          error: "Failed to load dashboard charts",
        };
      }
    }),
});
