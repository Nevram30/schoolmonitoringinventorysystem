import { borrowersRouter } from "~/server/api/routers/borrowers";
import { borrowRequestsRouter } from "~/server/api/routers/borrow-requests";
import { borrowsRouter } from "~/server/api/routers/borrows";
import { itemsRouter } from "~/server/api/routers/items";
import { receiptsRouter } from "~/server/api/routers/receipts";
import { reportsRouter } from "~/server/api/routers/reports";
import { returnsRouter } from "~/server/api/routers/returns";
import { roomsRouter } from "~/server/api/routers/rooms";
import { settingsRouter } from "~/server/api/routers/settings";
import { usersRouter } from "~/server/api/routers/users";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  borrowers: borrowersRouter,
  borrowRequests: borrowRequestsRouter,
  borrows: borrowsRouter,
  items: itemsRouter,
  receipts: receiptsRouter,
  reports: reportsRouter,
  returns: returnsRouter,
  rooms: roomsRouter,
  settings: settingsRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.items.list({ page: 1, limit: 10, search: "" });
 */
export const createCaller = createCallerFactory(appRouter);
