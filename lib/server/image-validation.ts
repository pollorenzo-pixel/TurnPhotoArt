import "server-only";
import sharp, { type Metadata } from "sharp";
import { imageSignatureMatches, PREVIEW_CONFIG } from "@/lib/turn-photo-art";

export type ServerImage = { bytes: Buffer; mimeType: "image/jpeg" | "image/png" | "image/webp"; width: number; height: number; sha256: string };

export async function validateServerImage(file: File): Promise<ServerImage> {
  if (!(file instanceof File) || file.size <= 0 || file.size > PREVIEW_CONFIG.maxFileBytes) throw new Error("invalid_image");
  if (!(PREVIEW_CONFIG.acceptedTypes as readonly string[]).includes(file.type)) throw new Error("unsupported_image");
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!imageSignatureMatches(file.type, bytes.subarray(0, 12))) throw new Error("invalid_image");
  let metadata: Metadata;
  try { metadata = await sharp(bytes, { failOn: "error", limitInputPixels: PREVIEW_CONFIG.maxPixels }).metadata(); } catch { throw new Error("unreadable_image"); }
  if (!metadata.width || !metadata.height) throw new Error("unreadable_image");
  if (metadata.width > PREVIEW_CONFIG.maxWidth || metadata.height > PREVIEW_CONFIG.maxHeight || metadata.width * metadata.height > PREVIEW_CONFIG.maxPixels) throw new Error("image_dimensions_exceeded");
  const { sha256 } = await import("@/lib/server/crypto");
  return { bytes, mimeType: file.type as ServerImage["mimeType"], width: metadata.width, height: metadata.height, sha256: sha256(bytes) };
}

export async function validateProviderPng(bytes: Buffer) {
  if (!bytes.length || bytes.length > 15 * 1024 * 1024 || !imageSignatureMatches("image/png", bytes.subarray(0, 12))) throw new Error("malformed_provider_output");
  try {
    const metadata = await sharp(bytes, { failOn: "error", limitInputPixels: 50_000_000 }).metadata();
    if (metadata.format !== "png" || !metadata.width || !metadata.height) throw new Error("malformed_provider_output");
  } catch { throw new Error("malformed_provider_output"); }
}
