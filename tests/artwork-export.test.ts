import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import sharp from "sharp";
import { containedDimensions, exportArtworkAtSourceRatio, sourceRatioDimensions } from "../lib/server/artwork-export";

async function providerPng(width: number, height: number) {
  return sharp({ create: { width, height, channels: 3, background: "#336699" } }).png().toBuffer();
}

async function dimensions(bytes: Buffer) {
  const metadata = await sharp(bytes).metadata();
  return { width: metadata.width, height: metadata.height };
}

test("source-ratio dimensions preserve landscape, portrait and square shapes", () => {
  assert.deepEqual(sourceRatioDimensions(1600, 900, 1536), { width: 1536, height: 864 });
  assert.deepEqual(sourceRatioDimensions(900, 1600, 1536), { width: 864, height: 1536 });
  assert.deepEqual(sourceRatioDimensions(1200, 1200, 1024), { width: 1024, height: 1024 });
});

test("foreground containment uses one scale factor without stretching or cropping", () => {
  assert.deepEqual(containedDimensions(1536, 1024, 1536, 864), { width: 1296, height: 864 });
  assert.deepEqual(containedDimensions(1024, 1536, 864, 1536), { width: 864, height: 1296 });
});

test("server export returns downloadable PNGs matching each source aspect ratio", async () => {
  const landscape = await exportArtworkAtSourceRatio(await providerPng(1536, 1024), 1600, 900);
  const portrait = await exportArtworkAtSourceRatio(await providerPng(1024, 1536), 900, 1600);
  const square = await exportArtworkAtSourceRatio(await providerPng(1024, 1024), 1200, 1200);

  assert.deepEqual(await dimensions(landscape), { width: 1536, height: 864 });
  assert.deepEqual(await dimensions(portrait), { width: 864, height: 1536 });
  assert.deepEqual(await dimensions(square), { width: 1024, height: 1024 });
  assert.equal(square.compare(await providerPng(1024, 1024)), 0);
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
