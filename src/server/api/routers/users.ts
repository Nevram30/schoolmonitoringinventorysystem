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
