import { z } from "zod";
import bcrypt from "bcryptjs";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const insensitive = { mode: "insensitive" } as const;

// Map type number to role string
const getRole = (type: number): "admin" | "faculty" | "staff" | "student" => {
  switch (type) {
    case 1:
      return "admin";
    case 2:
      return "faculty";
    case 3:
      return "staff";
    case 4:
      return "student";
    default:
      return "staff";
  }
};

export const usersRouter = createTRPCRouter({
  // GET /api/users
  list: protectedProcedure
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
                { name: { contains: search, ...insensitive } },
                { username: { contains: search, ...insensitive } },
                { email: { contains: search, ...insensitive } },
                { id_number: { contains: search, ...insensitive } },
              ],
            }
          : {};

        const [rows, count] = await ctx.db.$transaction([
          ctx.db.user.findMany({
            where,
            // Don't return passwords
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              id_number: true,
              role: true,
              status: true,
            },
            take: limit,
            skip: offset,
            orderBy: { id: "desc" },
          }),
          ctx.db.user.count({ where }),
        ]);

        return {
          success: true as const,
          data: rows,
          pagination: {
            page,
            limit,
            total: count,
            totalPages: Math.ceil(count / limit),
          },
        };
      } catch (error) {
        console.error("Get users error:", error);
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

  // POST /api/users
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string(),
        password: z.string().min(8, "Password must be at least 8 characters"),
        email: z.string().email(),
        id_number: z.string().min(1),
        role: z.enum(["admin", "faculty", "staff", "student"]).optional(),
        type: z.union([z.string(), z.number()]).nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if username already exists
        const existingUser = await ctx.db.user.findUnique({
          where: { username: input.username },
        });

        if (existingUser) {
          return { success: false as const, error: "Username already exists" };
        }

        // E-mail and ID number are unique too, so report those clearly rather
        // than letting the insert fail with a constraint error.
        const existingEmail = await ctx.db.user.findUnique({
          where: { email: input.email },
        });

        if (existingEmail) {
          return { success: false as const, error: "Email address already exists" };
        }

        const existingIdNumber = await ctx.db.user.findUnique({
          where: { id_number: input.id_number },
        });

        if (existingIdNumber) {
          return { success: false as const, error: "ID number already exists" };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(input.password, 10);

        // Callers send `role` directly; `type` is the older numeric form.
        const userType = parseInt(String(input.type)) || 3; // Default to staff (3)

        const newUser = await ctx.db.user.create({
          data: {
            name: input.name,
            username: input.username,
            password: hashedPassword,
            email: input.email,
            id_number: input.id_number,
            role: input.role ?? getRole(userType),
            status: 1, // Active by default
          },
        });

        // Return user without password
        const { password, ...userResponse } = newUser;

        return {
          success: true as const,
          data: userResponse,
          message: "User created successfully",
        };
      } catch (error) {
        console.error("Create user error:", error);
        console.error(
          "Error details:",
          error instanceof Error ? error.message : "Unknown error"
        );
        return {
          success: false as const,
          error: `Failed to create user: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        };
      }
    }),

  // Bulk import from the Excel upload on /admin/users. Each row is checked on
  // its own, so one bad row doesn't stop the rest of the sheet from importing.
  bulkCreate: protectedProcedure
    .input(
      z.object({
        rows: z
          .array(
            z.object({
              // Spreadsheet row number, echoed back so errors point at the sheet.
              row: z.number(),
              name: z.string(),
              username: z.string(),
              password: z.string(),
              email: z.string(),
              id_number: z.string(),
              role: z.enum(["admin", "faculty", "staff", "student"]),
              status: z.union([z.literal(1), z.literal(2)]).default(1),
            })
          )
          .min(1)
          .max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user?.role !== "admin") {
        return { success: false as const, error: "Forbidden - Admin access required" };
      }

      const rowSchema = z.object({
        name: z.string().trim().min(1, "Name is required").max(50, "Name is over 50 characters"),
        username: z.string().trim().min(1, "Username is required").max(50, "Username is over 50 characters"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        email: z.string().trim().email("Email address is invalid").max(100, "Email is over 100 characters"),
        id_number: z.string().trim().min(1, "ID number is required").max(50, "ID number is over 50 characters"),
      });

      const failed: { row: number; username: string; error: string }[] = [];
      const valid: (typeof input.rows)[number][] = [];
      const seen = { username: new Set<string>(), email: new Set<string>(), id_number: new Set<string>() };

      for (const r of input.rows) {
        const parsed = rowSchema.safeParse(r);
        if (!parsed.success) {
          failed.push({ row: r.row, username: r.username, error: parsed.error.issues[0]?.message ?? "Invalid row" });
          continue;
        }

        const row = { ...r, ...parsed.data };
        const dup =
          seen.username.has(row.username.toLowerCase()) ? "Username"
          : seen.email.has(row.email.toLowerCase()) ? "Email address"
          : seen.id_number.has(row.id_number) ? "ID number"
          : null;
        if (dup) {
          failed.push({ row: row.row, username: row.username, error: `${dup} appears more than once in the file` });
          continue;
        }

        seen.username.add(row.username.toLowerCase());
        seen.email.add(row.email.toLowerCase());
        seen.id_number.add(row.id_number);
        valid.push(row);
      }

      // One query for everything already in the database.
      const existing = valid.length
        ? await ctx.db.user.findMany({
            where: {
              OR: [
                { username: { in: valid.map((r) => r.username) } },
                { email: { in: valid.map((r) => r.email) } },
                { id_number: { in: valid.map((r) => r.id_number) } },
              ],
            },
            select: { username: true, email: true, id_number: true },
          })
        : [];
      const taken = {
        username: new Set(existing.map((u) => u.username)),
        email: new Set(existing.map((u) => u.email)),
        id_number: new Set(existing.map((u) => u.id_number)),
      };

      let created = 0;
      for (const row of valid) {
        const clash =
          taken.username.has(row.username) ? "Username"
          : taken.email.has(row.email) ? "Email address"
          : taken.id_number.has(row.id_number) ? "ID number"
          : null;
        if (clash) {
          failed.push({ row: row.row, username: row.username, error: `${clash} already exists` });
          continue;
        }

        try {
          await ctx.db.user.create({
            data: {
              name: row.name,
              username: row.username,
              password: await bcrypt.hash(row.password, 10),
              email: row.email,
              id_number: row.id_number,
              role: row.role,
              status: row.status,
            },
          });
          created++;
        } catch (error) {
          console.error("Bulk create user error:", error);
          failed.push({ row: row.row, username: row.username, error: "Failed to create user" });
        }
      }

      failed.sort((a, b) => a.row - b.row);

      return { success: true as const, created, failed };
    }),

  // PATCH /api/users/[id]
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        username: z.string(),
        email: z.string().email(),
        id_number: z.string().min(1),
        role: z.enum(["admin", "faculty", "staff", "student"]),
        status: z.number(),
        // Omitted (or empty) leaves the existing password alone.
        password: z
          .string()
          .min(8, "Password must be at least 8 characters")
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findUnique({ where: { id: input.id } });

        if (!user) {
          return { success: false as const, error: "User not found" };
        }

        // The three unique columns, each ignoring the row being edited.
        const clash = await ctx.db.user.findFirst({
          where: {
            id: { not: input.id },
            OR: [
              { username: input.username },
              { email: input.email },
              { id_number: input.id_number },
            ],
          },
        });

        if (clash) {
          const field =
            clash.username === input.username
              ? "Username"
              : clash.email === input.email
                ? "Email address"
                : "ID number";
          return { success: false as const, error: `${field} already exists` };
        }

        const updated = await ctx.db.user.update({
          where: { id: input.id },
          data: {
            name: input.name,
            username: input.username,
            email: input.email,
            id_number: input.id_number,
            role: input.role,
            status: input.status,
            ...(input.password
              ? { password: await bcrypt.hash(input.password, 10) }
              : {}),
          },
        });

        // Return user without password
        const { password, ...userResponse } = updated;

        return {
          success: true as const,
          data: userResponse,
          message: "User updated successfully",
        };
      } catch (error) {
        console.error("Update user error:", error);
        return { success: false as const, error: "Failed to update user" };
      }
    }),

  // Deactivate / reactivate an account. Used by the Actions column in place of
  // deleting, so borrow and return history stays intact.
  setStatus: protectedProcedure
    .input(z.object({ id: z.number(), status: z.union([z.literal(1), z.literal(2)]) }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Deactivating your own account would lock you out on the next load.
        if (input.status === 2 && Number(ctx.session.user?.id) === input.id) {
          return {
            success: false as const,
            error: "You cannot deactivate your own account",
          };
        }

        const user = await ctx.db.user.findUnique({ where: { id: input.id } });

        if (!user) {
          return { success: false as const, error: "User not found" };
        }

        await ctx.db.user.update({
          where: { id: input.id },
          data: { status: input.status },
        });

        return {
          success: true as const,
          message:
            input.status === 1
              ? "User activated successfully"
              : "User deactivated successfully",
        };
      } catch (error) {
        console.error("Set user status error:", error);
        return { success: false as const, error: "Failed to update user status" };
      }
    }),

  // DELETE /api/users?id=
  //
  // NOTE: carried over verbatim from the Sequelize route, including the admin check below.
  // The session carries `role`, not `type`, so `(session.user as any).type` is always
  // undefined and this guard rejects every caller. Preserved deliberately — see the plan's
  // "Bugs carried over" section.
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Only admins can delete users
        if (!ctx.session.user || (ctx.session.user as any).type !== 1) {
          return {
            success: false as const,
            error: "Forbidden - Admin access required",
          };
        }

        // Prevent deleting yourself
        if (input.id === Number((ctx.session.user as any).id)) {
          return {
            success: false as const,
            error: "Cannot delete your own account",
          };
        }

        // Check if user exists
        const user = await ctx.db.user.findUnique({ where: { id: input.id } });
        if (!user) {
          return { success: false as const, error: "User not found" };
        }

        // Delete the user
        await ctx.db.user.delete({ where: { id: input.id } });

        return {
          success: true as const,
          message: "User deleted successfully",
        };
      } catch (error) {
        console.error("Delete user error:", error);
        return { success: false as const, error: "Failed to delete user" };
      }
    }),
});
