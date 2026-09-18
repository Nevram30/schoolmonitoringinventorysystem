import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { serialize } from "@/server/api/serialize";
import {
  borrowerScopeFor,
  findBorrowerForUser,
  requesterFilter,
} from "@/server/api/scope";
import { generateBorrowerIdByType } from "@/server/db/utils/borrowerIdGenerator";
import { isKnownDepartment } from "@/lib/departments";
import type { PrismaClient } from "../../../../generated/prisma";

const insensitive = { mode: "insensitive" } as const;

/** `br_status` codes, mirroring the numeric-status convention the rest of the schema uses. */
export const REQUEST_STATUS = {
  pending: 1,
  approved: 2,
  rejected: 3,
} as const;

/**
 * Everything the request tables on both sides of the flow render: the item thumbnail, who it is
 * for, where it is going, and — for a reviewed request — who decided and what they said.
 */
const requestInclude = {
  Item: {
    select: {
      i_model: true,
      i_deviceID: true,
      i_photo: true,
      i_brand: true,
      item_rawstock: true,
    },
  },
  Member: {
    select: {
      m_fname: true,
      m_lname: true,
      m_school_id: true,
      m_department: true,
    },
  },
  Room: { select: { r_name: true } },
  Requester: { select: { name: true, role: true } },
  Reviewer: { select: { name: true } },
} as const;

/** `Borrower.m_type` code for the role of the account sending a request. */
const borrowerTypeForRole = (role: string) => {
  switch (role) {
    case "faculty":
      return 2;
    case "staff":
      return 3;
    default:
      return 1; // student
  }
};

/**
 * The `Borrower` row a request from this account belongs to, creating it when this is the account's
 * first borrow. Faculty / staff / students request for themselves — they no longer pick a borrower
 * — so the requester's own account is the borrower. Defaults mirror `borrowers.create`, which fills
 * the columns its form does not collect the same way.
 *
 * The creating half is here because only this router needs it; `findBorrowerForUser` does the same
 * lookup without writing, for the screens that only read.
 *
 * `department` is the program picked on the request form — used for a borrower row created here,
 * which would otherwise be stuck with the "General" placeholder. An existing row is updated by the
 * caller, which does the same for the borrower an admin picked.
 */
async function resolveRequesterBorrower(
  db: PrismaClient,
  userId: number,
  department?: string
) {
  // The lookup itself lives in `scope.ts`, where the portal screens read it from, so that what an
  // account sees and what its requests are filed under can never drift apart.
  const existing = await findBorrowerForUser(db, userId);
  if (existing) return existing;

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  // `user.name` is one field; everything after the first word is the surname.
  const [first, ...rest] = user.name.trim().split(/\s+/);
  const type = borrowerTypeForRole(user.role);

  return db.borrower.create({
    data: {
      m_school_id: user.id_number || (await generateBorrowerIdByType(type)),
      m_fname: first ?? user.username,
      m_lname: rest.join(" "),
      m_gender: "N/A",
      m_contact: "",
      m_department: department ?? "General",
      m_year_section: "N/A",
      m_type: type,
      m_password: "",
      m_status: 1,
    },
  });
}

export const borrowRequestsRouter = createTRPCRouter({
  /**
   * Send a borrow request for an admin to decide on. Deliberately does not touch `item_rawstock` —
   * nothing has left the shelf yet, and reserving stock here would make a rejected request quietly
   * cost the school an item until someone noticed.
   *
   * `member_id` is an admin-only field: everyone else requests for themselves, so a member_id from
   * a non-admin caller is ignored rather than trusted.
   */
  create: protectedProcedure
    .input(
      z.object({
        /** Who the borrow is for. Admins only — ignored for any other role. */
        member_id: z.number().optional(),
        item_id: z.number(),
        quantity: z.number().min(1),
        room_assigned: z.number().nullish(),
        time_limit: z.string(),
        purpose: z.string().nullish(),
        /** Department picked on the form; kept on the borrower rather than on the request. */
        department: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const item = await ctx.db.item.findUnique({
          where: { id: input.item_id },
        });
        if (!item) {
          return { success: false as const, error: "Item not found" };
        }

        // An early warning only — stock is checked again at approval time, because other requests
        // may be approved before this one.
        if (item.item_rawstock < input.quantity) {
          return {
            success: false as const,
            error: `Only ${item.item_rawstock} in stock for this item`,
          };
        }

        const department = input.department?.trim() || undefined;
        if (department && !isKnownDepartment(department)) {
          return { success: false as const, error: "Unknown department" };
        }

        const isAdmin = ctx.session.user.role === "admin";
        const borrower =
          isAdmin && input.member_id
            ? await ctx.db.borrower.findUnique({
                where: { id: input.member_id },
              })
            : await resolveRequesterBorrower(
                ctx.db,
                ctx.session.user.id,
                department
              );

        if (!borrower) {
          return {
            success: false as const,
            error: isAdmin
              ? "Borrower not found"
              : "Your account could not be matched to a borrower record",
          };
        }

        // The department belongs to the person, not the request, so it is kept on the borrower —
        // a no-op when `resolveRequesterBorrower` just created the row with it.
        if (department && borrower.m_department !== department) {
          await ctx.db.borrower.update({
            where: { id: borrower.id },
            data: { m_department: department },
          });
        }

        const request = await ctx.db.borrowRequest.create({
          data: {
            member_id: borrower.id,
            item_id: input.item_id,
            room_id: input.room_assigned ?? null,
            br_quantity: input.quantity,
            br_due_date: new Date(input.time_limit),
            br_status: REQUEST_STATUS.pending,
            br_purpose: input.purpose?.trim() ? input.purpose.trim() : null,
            requested_by: ctx.session.user.id,
          },
        });

        return {
          success: true as const,
          data: serialize(request),
          message: "Borrow request sent for approval",
        };
      } catch (error) {
        console.error("Create borrow request error:", error);
        return {
          success: false as const,
          error: `Failed to send borrow request: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        };
      }
    }),

  /**
   * Requests for the admin approval screen and for the request tables on the faculty / staff /
   * student pages, newest first. The admin screen lists every request; a portal lists only the
   * ones the signed-in account sent or is named on, matching what its other screens show.
   */
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        search: z.string().default(""),
        status: z.enum(["", "pending", "approved", "rejected"]).default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, search, status } = input;

      try {
        const scope = await borrowerScopeFor(ctx);
        const scoped = requesterFilter(scope);
        // Under `AND`, not spread: the search below owns `where.OR` and would otherwise overwrite
        // the scope, handing back every request in the school the moment someone typed a letter.
        const base: any = Object.keys(scoped).length ? { AND: [scoped] } : {};

        const where: any = { ...base };

        if (status) {
          where.br_status = REQUEST_STATUS[status];
        }

        if (search) {
          where.OR = [
            { Item: { i_model: { contains: search, ...insensitive } } },
            { Item: { i_deviceID: { contains: search, ...insensitive } } },
            { Member: { m_fname: { contains: search, ...insensitive } } },
            { Member: { m_lname: { contains: search, ...insensitive } } },
            { Room: { r_name: { contains: search, ...insensitive } } },
          ];
        }

        const [rows, count, pending] = await ctx.db.$transaction([
          ctx.db.borrowRequest.findMany({
            where,
            include: requestInclude,
            take: limit,
            skip: (page - 1) * limit,
            orderBy: { id: "desc" },
          }),
          ctx.db.borrowRequest.count({ where }),
          // Scoped like the list above it, or a portal would show one row under a badge counting
          // the whole school's backlog.
          ctx.db.borrowRequest.count({
            where: { ...base, br_status: REQUEST_STATUS.pending },
          }),
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
          // Kept on every page of the list so the approval screen can show the outstanding
          // count without a second round trip.
          pendingTotal: pending,
        };
      } catch (error) {
        console.error("Get borrow requests error:", error);
        return {
          success: false as const,
          error: "Failed to fetch borrow requests",
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
          pendingTotal: 0,
        };
      }
    }),

  /**
   * Feeds the admin header's notification bell: how many requests are waiting, plus the few most
   * recent so the dropdown can name them without loading the whole approval screen.
   */
  pending: adminProcedure
    .input(z.object({ limit: z.number().default(5) }).default({ limit: 5 }))
    .query(async ({ ctx, input }) => {
      try {
        const where = { br_status: REQUEST_STATUS.pending };

        const [count, rows] = await ctx.db.$transaction([
          ctx.db.borrowRequest.count({ where }),
          ctx.db.borrowRequest.findMany({
            where,
            include: requestInclude,
            take: input.limit,
            orderBy: { id: "desc" },
          }),
        ]);

        return { success: true as const, count, data: rows.map(serialize) };
      } catch (error) {
        console.error("Get pending borrow requests error:", error);
        return {
          success: false as const,
          error: "Failed to fetch pending requests",
          count: 0,
          data: [],
        };
      }
    }),

  /**
   * Approve a request: create the `Borrow` row it asked for and take the stock, in one transaction
   * so a request can never be marked approved without the borrow it promised.
   */
  approve: adminProcedure
    .input(z.object({ id: z.number(), note: z.string().nullish() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.$transaction(async (tx) => {
          const request = await tx.borrowRequest.findUnique({
            where: { id: input.id },
          });

          if (!request) {
            return { success: false as const, error: "Request not found" };
          }
          // Two admins on the screen at once, or a double-click: whoever gets here second must
          // not create a second borrow.
          if (request.br_status !== REQUEST_STATUS.pending) {
            return {
              success: false as const,
              error: "This request has already been reviewed",
            };
          }

          const item = await tx.item.findUnique({
            where: { id: request.item_id },
          });
          if (!item) {
            return { success: false as const, error: "Item no longer exists" };
          }
          if (item.item_rawstock < request.br_quantity) {
            return {
              success: false as const,
              error: `Not enough stock left — ${item.item_rawstock} available, ${request.br_quantity} requested`,
            };
          }

          const borrow = await tx.borrow.create({
            data: {
              member_id: request.member_id,
              item_id: request.item_id,
              room_id: request.room_id,
              b_due_date: request.br_due_date,
              b_quantity: request.br_quantity,
              b_status: 1, // 1 = borrowed
              b_purpose: request.br_purpose,
              b_notes: null,
            },
          });

          await tx.item.update({
            where: { id: request.item_id },
            data: { item_rawstock: item.item_rawstock - request.br_quantity },
          });

          const updated = await tx.borrowRequest.update({
            where: { id: request.id },
            data: {
              br_status: REQUEST_STATUS.approved,
              reviewed_by: ctx.session.user.id,
              br_reviewed_at: new Date(),
              br_review_note: input.note?.trim() ? input.note.trim() : null,
              borrow_id: borrow.id,
            },
          });

          return {
            success: true as const,
            data: serialize(updated),
            message: "Request approved and borrow created",
          };
        });

        return result;
      } catch (error) {
        console.error("Approve borrow request error:", error);
        return {
          success: false as const,
          error: `Failed to approve request: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        };
      }
    }),

  /** Reject a request. No stock moves; the note is the reason the requester sees. */
  reject: adminProcedure
    .input(z.object({ id: z.number(), note: z.string().nullish() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const request = await ctx.db.borrowRequest.findUnique({
          where: { id: input.id },
        });

        if (!request) {
          return { success: false as const, error: "Request not found" };
        }
        if (request.br_status !== REQUEST_STATUS.pending) {
          return {
            success: false as const,
            error: "This request has already been reviewed",
          };
        }

        const updated = await ctx.db.borrowRequest.update({
          where: { id: request.id },
          data: {
            br_status: REQUEST_STATUS.rejected,
            reviewed_by: ctx.session.user.id,
            br_reviewed_at: new Date(),
            br_review_note: input.note?.trim() ? input.note.trim() : null,
          },
        });

        return {
          success: true as const,
          data: serialize(updated),
          message: "Request rejected",
        };
      } catch (error) {
        console.error("Reject borrow request error:", error);
        return {
          success: false as const,
          error: `Failed to reject request: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        };
      }
    }),
});
