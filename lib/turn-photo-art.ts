export const PRODUCT = {
  name: "TurnPhotoArt",
  eyebrow: "Playful photo studio",
  headline: "Turn your favourite photo into playful artwork",
  description:
    "Upload a photo of a pet, person, meal or special moment and turn it into a colourful handmade-style illustration.",
} as const;

export const PREVIEW_CONFIG = {
  styleId: "playful-art",
  maxFileBytes: 10 * 1024 * 1024,
  maxWidth: 12_000,
  maxHeight: 12_000,
  maxPixels: 50_000_000,
  exportMaxEdge: 2_048,
  acceptedTypes: ["image/jpeg", "image/png", "image/webp"],
  acceptedExtensions: {
    "image/jpeg": ["jpg", "jpeg"],
    "image/png": ["png"],
    "image/webp": ["webp"],
  },
  progressMessages: [
    "Looking at the little details…",
    "Adding colour and texture…",
    "Finishing the playful touches…",
  ],
  // Future server-side definition only. Phase 1 never sends this prompt anywhere.
  futurePrompt:
    "Preserve the original subject, distinctive features, expression, pose, framing and important scene composition. Reinterpret the photo as a cheerful handcrafted graphic illustration using bold simplified shapes, warm vivid colours, grainy chalk and pastel texture, softly rough handmade edges, charming editorial composition, and a small number of playful sparkles, hearts or expressive accent marks. Keep the subject recognisable and avoid changing identity, species, important objects or the emotional meaning of the original image.",
} as const;

type PhotoFileMetadata = { type: string; size: number; name?: string };

export function validatePhotoFile(file: PhotoFileMetadata): string | null {
  if (!file || file.size === 0) {
    return "This file is empty. Please choose a JPEG, PNG or WebP image.";
  }
  if (!(PREVIEW_CONFIG.acceptedTypes as readonly string[]).includes(file.type)) {
    return "That file type isn’t supported. Please choose a JPEG, PNG or WebP image.";
  }
  if (file.name) {
    const dotIndex = file.name.lastIndexOf(".");
    if (dotIndex >= 0 && dotIndex < file.name.length - 1) {
      const extension = file.name.slice(dotIndex + 1).toLowerCase();
      const allowed = PREVIEW_CONFIG.acceptedExtensions[file.type as keyof typeof PREVIEW_CONFIG.acceptedExtensions];
      if (!allowed?.some((candidate) => candidate === extension)) {
        return "The file extension does not match its image type. Try exporting it again as JPEG, PNG or WebP.";
      }
    }
  }
  if (file.size > PREVIEW_CONFIG.maxFileBytes) {
    return "That photo is over 10 MB. Please choose a smaller image.";
  }
  return null;
}

export function imageSignatureMatches(type: string, bytes: Uint8Array): boolean {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") {
    const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return png.every((byte, index) => bytes[index] === byte);
  }
  if (type === "image/webp") {
    return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  }
  return false;
}

export function validateImageDimensions(width: number, height: number): string | null {
  if (width <= 0 || height <= 0) return "We could not read this image. Try exporting it again as JPEG, PNG or WebP.";
  if (width > PREVIEW_CONFIG.maxWidth || height > PREVIEW_CONFIG.maxHeight) {
    return "This image is too large to process safely. Try a photo with smaller dimensions.";
  }
  if (width * height > PREVIEW_CONFIG.maxPixels) {
    return "This image contains too many pixels to process safely. Try a smaller photo.";
  }
  return null;
}
