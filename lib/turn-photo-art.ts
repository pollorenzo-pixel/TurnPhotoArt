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
  acceptedTypes: ["image/jpeg", "image/png", "image/webp"],
  progressMessages: [
    "Looking at the little details…",
    "Adding colour and texture…",
    "Finishing the playful touches…",
  ],
  // Future server-side definition only. Phase 1 never sends this prompt anywhere.
  futurePrompt:
    "Preserve the original subject, distinctive features, expression, pose, framing and important scene composition. Reinterpret the photo as a cheerful handcrafted graphic illustration using bold simplified shapes, warm vivid colours, grainy chalk and pastel texture, softly rough handmade edges, charming editorial composition, and a small number of playful sparkles, hearts or expressive accent marks. Keep the subject recognisable and avoid changing identity, species, important objects or the emotional meaning of the original image.",
} as const;

type PhotoFileMetadata = { type: string; size: number };

export function validatePhotoFile(file: PhotoFileMetadata): string | null {
  if (!(PREVIEW_CONFIG.acceptedTypes as readonly string[]).includes(file.type)) {
    return "That file type isn’t supported. Please choose a JPEG, PNG or WebP image.";
  }
  if (file.size > PREVIEW_CONFIG.maxFileBytes) {
    return "That photo is over 10 MB. Please choose a smaller image.";
  }
  return null;
}
