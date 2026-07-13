import sharp from "sharp";

type Dimensions = { width: number; height: number };

// Bound decoded export memory while retaining original upload dimensions whenever
// practical. The two limits are equivalent for a square but are both explicit so
// future changes cannot accidentally permit an oversized edge or pixel area.
export const MAX_EXPORT_EDGE = 2_048;
export const MAX_EXPORT_PIXELS = 4_194_304;

export function sourceRatioDimensions(sourceWidth: number, sourceHeight: number): Dimensions {
  const scale = Math.min(
    1,
    MAX_EXPORT_EDGE / Math.max(sourceWidth, sourceHeight),
    Math.sqrt(MAX_EXPORT_PIXELS / (sourceWidth * sourceHeight)),
  );
  return {
    width: Math.max(1, Math.round(sourceWidth * scale)),
    height: Math.max(1, Math.round(sourceHeight * scale)),
  };
}

export async function exportArtworkAtSourceRatio(bytes: Buffer, sourceWidth: number, sourceHeight: number) {
  const metadata = await sharp(bytes, { failOn: "error", limitInputPixels: 50_000_000 }).metadata();
  if (!metadata.width || !metadata.height) throw new Error("malformed_provider_output");

  const target = sourceRatioDimensions(sourceWidth, sourceHeight);
  if (target.width === metadata.width && target.height === metadata.height) return bytes;

  return sharp(bytes)
    .resize(target.width, target.height, { fit: "cover", position: sharp.strategy.attention })
    .png({ compressionLevel: 9 })
    .toBuffer();
}
