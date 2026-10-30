import "server-only";

import { randomUUID } from "crypto";
import {
  GetObjectCommand,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { env } from "@/env";

/** Bucket on the Neon branch `AWS_ENDPOINT_URL_S3` points at. Private: see `/api/files`. */
const BUCKET = "uploads";

/** Must match the limit checked in the browser before an upload starts. */
export const MAX_PHOTO_SIZE = 4 * 1024 * 1024; // 4MB

/**
 * What may be uploaded, and the extension it is stored under. An allowlist rather than `image/*`
 * because photos are served from the app's own origin, where an SVG could run scripts.
 */
export const PHOTO_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/heic": "heic",
  "image/heif": "heif",
};

/**
 * `items` holds the photo shown on an inventory item (see `i_photo` on the Item model), `receipts`
 * the photo taken at the counter as an item is handed over (see `rc_receiver_photo` on ItemReceipt).
 */
const PHOTO_FOLDERS = ["items", "receipts"] as const;
export type PhotoFolder = (typeof PHOTO_FOLDERS)[number];

export const isPhotoFolder = (value: string): value is PhotoFolder =>
  (PHOTO_FOLDERS as readonly string[]).includes(value);

/** Admin-only for receipts: those are evidence attached to a loan, and show the person's face. */
export const canAccessPhotoFolder = (
  folder: PhotoFolder,
  role: string | null | undefined
) => folder !== "receipts" || role === "admin";

const client = new S3Client({
  endpoint: env.AWS_ENDPOINT_URL_S3,
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  // Neon Object Storage only supports path-style addressing.
  forcePathStyle: true,
  requestChecksumCalculation: "WHEN_REQUIRED",
});

/** Stores the photo and returns the URL to save on the row, served by `/api/files`. */
export const putPhoto = async (folder: PhotoFolder, file: File) => {
  const name = `${randomUUID()}.${PHOTO_EXTENSIONS[file.type]}`;

  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: `${folder}/${name}`,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    })
  );

  return `/api/files/${folder}/${name}`;
};

/** Returns the stored photo, or null if there is none under that name. */
export const getPhoto = async (folder: PhotoFolder, name: string) => {
  try {
    const object = await client.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: `${folder}/${name}` })
    );
    if (!object.Body) return null;

    return {
      body: object.Body.transformToWebStream(),
      contentType: object.ContentType ?? "application/octet-stream",
    };
  } catch (error) {
    if (error instanceof NoSuchKey) return null;
    throw error;
  }
};
