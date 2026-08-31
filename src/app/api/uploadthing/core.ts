import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";

const f = createUploadthing();

export const ourFileRouter = {
  /** Photo shown on an inventory item (see `i_photo` on the Item model). */
  itemImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is handed to `onUploadComplete` below.
      return { userId: session.user?.id ?? null };
    })
    .onUploadComplete(async ({ file }) => {
      // Returned to the client as `serverData` once the upload finishes.
      return { url: file.ufsUrl };
    }),

  /**
   * Photo taken at the counter as an item is handed over (see `rc_receiver_photo` on
   * ItemReceipt). Admin-only: this is evidence attached to a loan, not a general upload.
   */
  receiptPhoto: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session) throw new UploadThingError("Unauthorized");
      if (session.user?.role !== "admin") {
        throw new UploadThingError("Only an admin can record a hand-over");
      }

      return { userId: session.user?.id ?? null };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
