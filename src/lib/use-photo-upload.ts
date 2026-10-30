import { useCallback, useState } from "react";

import type { PhotoFolder } from "@/lib/storage";

/** Sends a photo to `/api/uploads`. `startUpload` resolves to its URL and throws if it failed. */
export const usePhotoUpload = (folder: PhotoFolder) => {
  const [isUploading, setIsUploading] = useState(false);

  const startUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);

      try {
        const body = new FormData();
        body.append("file", file);

        const response = await fetch(`/api/uploads/${folder}`, {
          method: "POST",
          body,
        });
        // Not always JSON: a host rejecting an oversized request answers with its own error page.
        const data = (await response.json().catch(() => null)) as {
          url?: string;
          error?: string;
        } | null;

        if (!response.ok || !data?.url) {
          throw new Error(data?.error ?? "Failed to upload photo");
        }

        return data.url;
      } finally {
        setIsUploading(false);
      }
    },
    [folder]
  );

  return { startUpload, isUploading };
};
