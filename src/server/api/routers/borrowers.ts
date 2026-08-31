import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  generateBorrowerIdByType,
  getBorrowerTypeFromString,
} from "@/server/db/utils/borrowerIdGenerator";

const insensitive = { mode: "insensitive" } as const;

export const borrowersRouter = createTRPCRouter({
  // GET /api/borrowers
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

        const where = search
          ? {
              OR: [
                { m_fname: { contains: search, ...insensitive } },
                { m_lname: { contains: search, ...insensitive } },
                { m_department: { contains: search, ...insensitive } },
                { m_school_id: { contains: search, ...insensitive } },
              ],
            }
          : {};

        const [rows, count] = await ctx.db.$transaction([
          ctx.db.borrower.findMany({
            where,
            take: limit,
            skip: offset,
            orderBy: { id: "desc" },
            include: {
              // Most recent borrow only — the table shows one date per borrower.
              borrows: {
                select: { b_date_borrowed: true },
                orderBy: { b_date_borrowed: "desc" },
                take: 1,
              },
            },
          }),
          ctx.db.borrower.count({ where }),
        ]);

        return {
          success: true as const,
          data: rows.map(({ borrows, ...borrower }) => ({
            ...borrower,
            // Null for a borrower who has never borrowed anything.
            lastBorrowedAt: borrows[0]?.b_date_borrowed ?? null,
          })),
          pagination: {
            page,
            limit,
            total: count,
            totalPages: Math.ceil(count / limit),
          },
        };
      } catch (error) {
        console.error("Get borrowers error:", error);
        return {
          success: false as const,
          error: "Internal server error",
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

  // GET /api/borrowers/[id]
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const borrower = await ctx.db.borrower.findUnique({
          where: { id: input.id },
        });

        if (!borrower) {
          return { success: false as const, error: "Borrower not found" };
        }

        return { success: true as const, data: borrower };
      } catch (error) {
        console.error("Get borrower error:", error);
        return { success: false as const, error: "Internal server error" };
      }
    }),

  // POST /api/borrowers
  create: protectedProcedure
    .input(
      z.object({
        m_fname: z.string(),
        m_lname: z.string(),
        m_contact: z.string().nullish(),
        m_address: z.string().nullish(),
        m_type: z.string(),
        // The school ID typed on the form; falls back to a generated one when omitted.
        m_school_id: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Convert borrower type string to integer
        const borrowerType = getBorrowerTypeFromString(input.m_type);

        const customSchoolId =
          input.m_school_id?.trim() ||
          (await generateBorrowerIdByType(borrowerType));

        // m_school_id is unique, so report a clash rather than failing on the insert.
        const existing = await ctx.db.borrower.findUnique({
          where: { m_school_id: customSchoolId },
        });

        if (existing) {
          return {
            success: false as const,
            error: `ID "${customSchoolId}" is already assigned to another borrower`,
          };
        }

        const newBorrower = await ctx.db.borrower.create({
          data: {
            m_school_id: customSchoolId,
            m_fname: input.m_fname,
            m_lname: input.m_lname,
            m_gender: "N/A", // Default value since frontend doesn't collect this (max 10 chars)
            m_contact: input.m_contact || "",
            m_department: input.m_address || "General", // Using address field as department for now
            m_year_section: "N/A", // Default value since frontend doesn't collect this
            m_type: borrowerType,
            m_password: "", // Default empty password
            m_status: 1,
          },
        });

        return {
          success: true as const,
          data: newBorrower,
          message: "Borrower created successfully",
        };
      } catch (error) {
        console.error("Create borrower error:", error);
        console.error(
          "Error details:",
          error instanceof Error ? error.message : "Unknown error"
        );
        return {
          success: false as const,
          error: `Failed to create borrower: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        };
      }
    }),

  // PUT /api/borrowers/[id]
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        m_fname: z.string(),
        m_lname: z.string(),
        m_contact: z.string().nullish(),
        m_address: z.string().nullish(),
        m_type: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Find the borrower first
        const borrower = await ctx.db.borrower.findUnique({
          where: { id: input.id },
        });
        if (!borrower) {
          return { success: false as const, error: "Borrower not found" };
        }

        // Convert borrower type string to integer code
        const borrowerType = getBorrowerTypeFromString(input.m_type);

        const updated = await ctx.db.borrower.update({
          where: { id: input.id },
          data: {
            m_fname: input.m_fname,
            m_lname: input.m_lname,
            m_contact: input.m_contact || "",
            m_department: input.m_address || "General", // Using address field as department
            m_type: borrowerType,
          },
        });

        return {
          success: true as const,
          data: updated,
          message: "Borrower updated successfully",
        };
      } catch (error) {
        console.error("Update borrower error:", error);
        return {
          success: false as const,
          error: `Failed to update borrower: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        };
      }
    }),

  // PATCH /api/borrowers/[id]
  patch: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          m_status: z.number().optional(),
          m_fname: z.string().optional(),
          m_lname: z.string().optional(),
          m_gender: z.string().optional(),
          m_contact: z.string().optional(),
          m_department: z.string().optional(),
          m_year_section: z.string().optional(),
          m_type: z.number().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Find the borrower first
        const borrower = await ctx.db.borrower.findUnique({
          where: { id: input.id },
        });
        if (!borrower) {
          return { success: false as const, error: "Borrower not found" };
        }

        // Update only the provided fields
        const updated = await ctx.db.borrower.update({
          where: { id: input.id },
          data: input.data,
        });

        return {
          success: true as const,
          data: updated,
          message: "Borrower status updated successfully",
        };
      } catch (error) {
        console.error("Update borrower status error:", error);
        return {
          success: false as const,
          error: `Failed to update borrower status: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        };
      }
    }),

  // DELETE /api/borrowers/[id]
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Find the borrower first
        const borrower = await ctx.db.borrower.findUnique({
          where: { id: input.id },
        });
        if (!borrower) {
          return { success: false as const, error: "Borrower not found" };
        }

        // Soft delete by setting status to inactive instead of actually deleting
        await ctx.db.borrower.update({
          where: { id: input.id },
          data: { m_status: 0 },
        });

        return {
          success: true as const,
          message: "Borrower deleted successfully",
        };
      } catch (error) {
        console.error("Delete borrower error:", error);
        return {
          success: false as const,
          error: `Failed to delete borrower: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        };
      }
    }),
});
