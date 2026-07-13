import sharp from "sharp";

type Dimensions = { width: number; height: number };

export function sourceRatioDimensions(sourceWidth: number, sourceHeight: number, maxEdge: number): Dimensions {
  if (sourceWidth >= sourceHeight) {
    return { width: maxEdge, height: Math.max(1, Math.round(maxEdge * sourceHeight / sourceWidth)) };
  }
  return { width: Math.max(1, Math.round(maxEdge * sourceWidth / sourceHeight)), height: maxEdge };
}

export function containedDimensions(inputWidth: number, inputHeight: number, targetWidth: number, targetHeight: number): Dimensions {
  const scale = Math.min(targetWidth / inputWidth, targetHeight / inputHeight, 1);
  return {
    width: Math.max(1, Math.round(inputWidth * scale)),
    height: Math.max(1, Math.round(inputHeight * scale)),
  };
}

export async function exportArtworkAtSourceRatio(bytes: Buffer, sourceWidth: number, sourceHeight: number) {
  const metadata = await sharp(bytes, { failOn: "error", limitInputPixels: 50_000_000 }).metadata();
  if (!metadata.width || !metadata.height) throw new Error("malformed_provider_output");

  const target = sourceRatioDimensions(sourceWidth, sourceHeight, Math.max(metadata.width, metadata.height));
  if (target.width === metadata.width && target.height === metadata.height) return bytes;

  const foregroundSize = containedDimensions(metadata.width, metadata.height, target.width, target.height);
  const { data: foreground, info } = await sharp(bytes)
    .resize(foregroundSize.width, foregroundSize.height, { fit: "fill" })
    .png({ compressionLevel: 9 })
    .toBuffer({ resolveWithObject: true });

  const background = sharp(bytes).resize(target.width, target.height, { fit: "cover", position: "centre" });
  if (Math.min(target.width, target.height) >= 8) background.blur(Math.min(24, Math.max(1, Math.min(target.width, target.height) / 40)));

  return background
    .composite([{
      input: foreground,
      left: Math.floor((target.width - info.width) / 2),
      top: Math.floor((target.height - info.height) / 2),
    }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}
