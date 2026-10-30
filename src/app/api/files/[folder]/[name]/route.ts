import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth-config";
import { canAccessPhotoFolder, getPhoto, isPhotoFolder } from "@/lib/storage";

const fail = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

/** Serves a photo from the private bucket to a signed-in user, for `<img src>` to point at. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ folder: string; name: string }> }
) {
  const { folder, name } = await params;
  if (!isPhotoFolder(folder) || !/^[\w-]+\.\w+$/.test(name)) {
    return fail("Not found", 404);
  }

  const session = await getServerSession(authOptions);
  if (!session) return fail("Unauthorized", 401);
  if (!canAccessPhotoFolder(folder, session.user?.role)) {
    return fail("You are not allowed to view this photo", 403);
  }

  try {
    const photo = await getPhoto(folder, name);
    if (!photo) return fail("Not found", 404);

    return new Response(photo.body, {
      headers: {
        "Content-Type": photo.contentType,
        "X-Content-Type-Options": "nosniff",
        // A new photo always gets a new name, so a stored one never changes. `private` keeps it
        // out of shared caches, which would otherwise skip the session check above.
        "Cache-Control": "private, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Photo download error:", error);
    return fail("The photo could not be loaded.", 502);
  }
}
