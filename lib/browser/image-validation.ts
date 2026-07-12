import { imageSignatureMatches, validateImageDimensions, validatePhotoFile } from "@/lib/turn-photo-art";

export type ValidatedImage = { width: number; height: number };

const INVALID_IMAGE = "This file does not appear to be a valid JPEG, PNG or WebP image.";
const UNREADABLE_IMAGE = "We could not read this image. Try exporting it again as JPEG, PNG or WebP.";
const PROCESSING_ERROR = "We could not process this image. Please try another photo.";

async function decodeWithImage(file: File): Promise<ValidatedImage> {
  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = () => reject(new Error("decode"));
      image.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function decodeDimensions(file: File): Promise<ValidatedImage> {
  if (typeof createImageBitmap !== "undefined") {
    const bitmap = await createImageBitmap(file);
    try {
      return { width: bitmap.width, height: bitmap.height };
    } finally {
      bitmap.close();
    }
  }
  return decodeWithImage(file);
}

export async function validateImageFile(file: File): Promise<ValidatedImage> {
  const metadataError = validatePhotoFile(file);
  if (metadataError) throw new Error(metadataError);
  try {
    const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    if (!imageSignatureMatches(file.type, header)) throw new Error(INVALID_IMAGE);
  } catch (error) {
    if (error instanceof Error && error.message === INVALID_IMAGE) throw error;
    throw new Error(PROCESSING_ERROR);
  }

  let dimensions: ValidatedImage;
  try {
    dimensions = await decodeDimensions(file);
  } catch {
    throw new Error(UNREADABLE_IMAGE);
  }

  const dimensionError = validateImageDimensions(dimensions.width, dimensions.height);
  if (dimensionError) throw new Error(dimensionError);
  return dimensions;
}
