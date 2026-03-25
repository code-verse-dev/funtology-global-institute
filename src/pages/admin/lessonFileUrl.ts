import { UPLOADS_URL } from "@/constants/api";

/** Uploaded lesson PDF (or other file) URL */
export function lessonFileUrl(fileUrl?: string | null) {
  if (!fileUrl) return null;
  const base = UPLOADS_URL.replace(/\/$/, "");
  return `${base}/${String(fileUrl).replace(/^\//, "")}`;
}
