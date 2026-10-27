import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export interface UploadResult {
  downloadUrl: string;
  fileName: string;
  fileSizeBytes: number;
}

/**
 * Uploads a publication PDF file to Firebase Storage under `publications/{civId}/{timestamp}_{filename}`.
 * Provides real-time progress callbacks (0-100%).
 */
export async function uploadPublicationPdf(
  file: File,
  civId: string = "general",
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  if (!file) {
    throw new Error("Ֆայլը ընտրված չէ:");
  }

  // Validate PDF mime type or extension
  const isPdf =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    throw new Error("Խնդրում ենք վերբեռնել միայն PDF ձևաչափի ֆայլ:");
  }

  // Clean filename: remove special chars, spaces -> underscores
  const cleanName = file.name
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "");
  const timestamp = Date.now();
  const storagePath = `publications/${civId}/${timestamp}_${cleanName}`;
  const fileRef = ref(storage, storagePath);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(fileRef, file, {
      contentType: "application/pdf",
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error("Firebase Storage Upload Error:", error);
        reject(
          new Error(
            `Վերբեռնման սխալ. ${error.message || "Չհաջողվեց պահպանել PDF ֆայլը Storage-ում"}`
          )
        );
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            downloadUrl,
            fileName: file.name,
            fileSizeBytes: file.size,
          });
        } catch (err: any) {
          reject(err);
        }
      }
    );
  });
}

/**
 * Formats bytes to human-readable size string (e.g. 2.4 MB)
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
