import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth-config";
import {
  canAccessPhotoFolder,
  isPhotoFolder,
  MAX_PHOTO_SIZE,
  PHOTO_EXTENSIONS,
  putPhoto,
} from "@/lib/storage";

const fail = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

/** Takes a photo from the browser and stores it in Neon Object Storage. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ folder: string }> }
) {
  const { folder } = await params;
  if (!isPhotoFolder(folder)) return fail("Not found", 404);

  const session = await getServerSession(authOptions);
  if (!session) return fail("Unauthorized", 401);
  if (!canAccessPhotoFolder(folder, session.user?.role)) {
    return fail("You are not allowed to upload this photo", 403);
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) return fail("No photo was sent", 400);
  if (!PHOTO_EXTENSIONS[file.type]) {
    return fail("Please use a JPEG, PNG, WebP, GIF or HEIC image.", 415);
  }
  if (file.size > MAX_PHOTO_SIZE) {
    return fail("Please select an image smaller than 4MB.", 413);
  }

  try {
    return NextResponse.json({ url: await putPhoto(folder, file) });
  } catch (error) {
    console.error("Photo upload error:", error);
    return fail("The photo could not be stored.", 502);
  }
}
