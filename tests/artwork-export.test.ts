import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import sharp from "sharp";
import { exportArtworkAtSourceRatio, MAX_EXPORT_EDGE, MAX_EXPORT_PIXELS, sourceRatioDimensions } from "../lib/server/artwork-export";

async function providerPng(width: number, height: number) {
  return sharp({ create: { width, height, channels: 3, background: "#336699" } }).png().toBuffer();
}

async function dimensions(bytes: Buffer) {
  const metadata = await sharp(bytes).metadata();
  return { width: metadata.width, height: metadata.height };
}

test("source-ratio dimensions preserve landscape, portrait and square shapes", () => {
  assert.deepEqual(sourceRatioDimensions(1600, 900), { width: 1600, height: 900 });
  assert.deepEqual(sourceRatioDimensions(900, 1600), { width: 900, height: 1600 });
  assert.deepEqual(sourceRatioDimensions(1200, 1200), { width: 1200, height: 1200 });
});

test("source-ratio dimensions scale oversized exports proportionally within safe limits", () => {
  assert.equal(MAX_EXPORT_EDGE, 2048);
  assert.equal(MAX_EXPORT_PIXELS, 4_194_304);
  const landscape = sourceRatioDimensions(6000, 4000);
  const portrait = sourceRatioDimensions(4000, 6000);
  const square = sourceRatioDimensions(8000, 8000);
  assert.deepEqual(landscape, { width: 2048, height: 1365 });
  assert.deepEqual(portrait, { width: 1365, height: 2048 });
  assert.deepEqual(square, { width: 2048, height: 2048 });
  for (const value of [landscape, portrait, square]) {
    assert.ok(Math.max(value.width, value.height) <= MAX_EXPORT_EDGE);
    assert.ok(value.width * value.height <= MAX_EXPORT_PIXELS);
  }
});

test("server export returns full-bleed PNGs at each source shape and practical original dimensions", async () => {
  const landscape = await exportArtworkAtSourceRatio(await providerPng(1536, 1024), 1600, 900);
  const portrait = await exportArtworkAtSourceRatio(await providerPng(1024, 1536), 900, 1600);
  const square = await exportArtworkAtSourceRatio(await providerPng(1024, 1024), 1200, 1200);

  assert.deepEqual(await dimensions(landscape), { width: 1600, height: 900 });
  assert.deepEqual(await dimensions(portrait), { width: 900, height: 1600 });
  assert.deepEqual(await dimensions(square), { width: 1200, height: 1200 });
  for (const bytes of [landscape, portrait, square]) assert.equal((await sharp(bytes).metadata()).hasAlpha, false);
});

test("full-bleed export uses one deterministic cover crop without padding or duplicated layers", async () => {
  const input = await sharp(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="#112233"/><circle cx="150" cy="100" r="40" fill="#ff0000"/></svg>')).png().toBuffer();
  const first = await exportArtworkAtSourceRatio(input, 100, 100);
  const second = await exportArtworkAtSourceRatio(input, 100, 100);
  const { data, info } = await sharp(first).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const redPixels: Array<[number, number]> = [];
  for (let y = 0; y < info.height; y += 1) for (let x = 0; x < info.width; x += 1) {
    const offset = (y * info.width + x) * info.channels;
    if (data[offset] > 220 && data[offset + 1] < 40 && data[offset + 2] < 40) redPixels.push([x, y]);
  }
  const xs = redPixels.map(([x]) => x); const ys = redPixels.map(([, y]) => y);
  const redWidth = Math.max(...xs) - Math.min(...xs) + 1; const redHeight = Math.max(...ys) - Math.min(...ys) + 1;
  assert.ok(redPixels.length > 0);
  assert.ok(Math.abs(redWidth - redHeight) <= 1, "uniform cover scaling must not stretch the subject");
  assert.deepEqual(first, second, "attention-positioned cropping must be deterministic");

  const implementation = readFileSync(new URL("../lib/server/artwork-export.ts", import.meta.url), "utf8");
  assert.match(implementation, /fit: "cover", position: sharp\.strategy\.attention/);
  assert.doesNotMatch(implementation, /\.blur\(|\.composite\(|fit: "contain"|padding|letterbox/i);
});

test("generation validates the final export before counting a successful version", () => {
  const route = readFileSync(new URL("../app/api/artwork-sets/generate/route.ts", import.meta.url), "utf8");
  const providerValidation = route.indexOf("validateProviderPng(result.bytes)");
  const exportStep = route.indexOf("exportArtworkAtSourceRatio(result.bytes, image.width, image.height)");
  const exportValidation = route.indexOf("validateProviderPng(artwork)");
  const successSettlement = route.indexOf('store.settle(generationId, "succeeded"');

  assert.ok(providerValidation < exportStep);
  assert.ok(exportStep < exportValidation);
  assert.ok(exportValidation < successSettlement);
  assert.match(route, /new Response\(new Uint8Array\(artwork\)/);
});
