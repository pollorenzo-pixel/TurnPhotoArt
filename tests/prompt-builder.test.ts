import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { PUBLIC_HOUSE_STYLES } from "../lib/server/house-styles";
import {
  buildArtworkPrompt,
  buildExpressiveEditorialPrompt,
  buildGenerationPrompt,
  buildGeometricCollagePrompt,
  PROMPT_VERSION,
} from "../lib/server/prompt-builder";

const occurrences = (value: string, needle: string) => value.split(needle).length - 1;

test("public house styles retain internal IDs and expose approved customer copy", () => {
  assert.deepEqual(PUBLIC_HOUSE_STYLES, [
    { id: "bold-playful", name: "Expressive Editorial", description: "Loose, lively and full of handmade character." },
    { id: "playful-storybook", name: "Geometric Collage", description: "Bold geometric shapes with a richly textured collage finish." },
  ]);
});

test("prompt version and style router are deterministic", () => {
  assert.equal(PROMPT_VERSION, "turnphotoart-prompt-v7");
  assert.equal(buildArtworkPrompt({ style: "bold-playful" }), buildExpressiveEditorialPrompt());
  assert.equal(buildArtworkPrompt({ style: "playful-storybook" }), buildGeometricCollagePrompt());
  assert.equal(buildGenerationPrompt("bold-playful", null), buildExpressiveEditorialPrompt());
  assert.throws(() => buildArtworkPrompt({ style: "invalid-style" as "bold-playful" }), /invalid_style/);
});

test("Expressive Editorial has a distinctive handmade editorial direction", () => {
  const prompt = buildExpressiveEditorialPrompt();
  assert.match(prompt, /original Expressive Editorial illustration that is clearly redrawn/);
  assert.match(prompt, /loose ink, coloured-pencil, dry-brush, wax-crayon, pastel and marker-like strokes/);
  assert.match(prompt, /energetic hand-drawn contours and layered marks that feel authored/);
  assert.match(prompt, /bold but imperfect colour blocking, visible paper grain, tactile handmade texture/);
  assert.match(prompt, /spontaneous editorial composition and generous negative space/);
  assert.match(prompt, /limited but cheerful palette informed by the uploaded photo/);
  assert.match(prompt, /expressive drawn contours, simplified illustrated planes, restrained highlights/);
  assert.match(prompt, /Avoid photorealism, photo filters, painted-over photographic skin or clothing/);
  assert.match(prompt, /expressive, tactile, contemporary, premium and unmistakably illustrated/);
  assert.doesNotMatch(prompt, /original Geometric Collage illustration/);
  assert.doesNotMatch(prompt, /Optional personality guidance from the customer:/);
});

test("Geometric Collage has a distinctive faceted printed-collage direction", () => {
  const prompt = buildGeometricCollagePrompt();
  assert.match(prompt, /original Geometric Collage illustration that is clearly reconstructed/);
  assert.match(prompt, /angular, faceted shapes to describe the face, body, clothing, objects and background/);
  assert.match(prompt, /cut-paper, printed-poster and handmade collage qualities/);
  assert.match(prompt, /bold flat colour planes, simplified geometric silhouettes/);
  assert.match(prompt, /crisp graphic edges with imperfect hand-drawn line details/);
  assert.match(prompt, /ink, paper, print, pencil, stipple and grain textures/);
  assert.match(prompt, /limited high-contrast palette informed by the uploaded photo/);
  assert.match(prompt, /recognisable faceted planes with simplified geometric modelling/);
  assert.match(prompt, /photographic fragments, literal digital cut-out effects, smooth 3D polygons, generic low-poly rendering/);
  assert.match(prompt, /bold, graphic, sophisticated, tactile, collectible and unmistakably illustrated/);
  assert.match(prompt, /use collage as the illustration construction technique within one continuous standalone artwork/i);
  assert.doesNotMatch(prompt, /Do not create a collage/);
  assert.doesNotMatch(prompt, /original Expressive Editorial illustration/);
  assert.doesNotMatch(prompt, /Optional personality guidance from the customer:/);
});

test("both styles preserve the complete source identity and composition contract", () => {
  for (const prompt of [buildExpressiveEditorialPrompt(), buildGeometricCollagePrompt()]) {
    assert.match(prompt, /uploaded reference photo is the visual source of truth/);
    assert.match(prompt, /identity, facial structure, defining features, pose, gesture, framing, composition, clothing, accessories, important objects/);
    assert.match(prompt, /dominant source colours, emotional meaning, subject count and spatial relationships/);
    assert.match(prompt, /same person, animal, object or scene/);
    assert.match(prompt, /Do not unnecessarily change ethnicity, age, body shape, hairstyle, facial expression, species, clothing, accessories, important objects or defining features/);
    assert.match(prompt, /Do not add or remove people or animals unless the customer’s optional personality direction explicitly requests it and the request is safe/);
  }
});

test("both styles remain clearly illustrated and non-photographic", () => {
  for (const prompt of [buildExpressiveEditorialPrompt(), buildGeometricCollagePrompt()]) {
    assert.match(prompt, /fully illustrated, clearly non-photographic artwork/);
    assert.match(prompt, /Do not create a photo-overpaint, photo-filter, lightly stylised photo, realism-first rendering/);
    assert.match(prompt, /Do not preserve photographic micro-detail or reproduce the source at a pixel-detail level/);
    assert.match(prompt, /designed as an artwork, not processed from a photograph/);
    assert.match(prompt, /Facial rendering must be clearly illustrated while preserving recognisable identity/);
    assert.match(prompt, /face must feel intentionally redrawn rather than photo-painted/);
  }
});

test("generation prompt adds source-shape composition safety without breaking two-argument compatibility", () => {
  assert.equal(buildGenerationPrompt("bold-playful", null), buildExpressiveEditorialPrompt());
  const portrait = buildGenerationPrompt("bold-playful", null, { width: 900, height: 1600 });
  const landscape = buildGenerationPrompt("playful-storybook", null, { width: 1600, height: 900 });
  const square = buildGenerationPrompt("bold-playful", null, { width: 1200, height: 1200 });
  assert.match(portrait, /portrait final canvas matching the uploaded source aspect ratio/);
  assert.match(landscape, /landscape final canvas matching the uploaded source aspect ratio/);
  assert.match(square, /square final canvas matching the uploaded source aspect ratio/);
  for (const prompt of [portrait, landscape, square]) {
    assert.match(prompt, /minimal full-bleed cover crop/);
    assert.match(prompt, /away from crop-sensitive outer edges/);
    assert.match(prompt, /background illustration extend naturally and continuously to every outer edge/);
  }
});

test("both styles retain the shared colour-fidelity contract", () => {
  for (const prompt of [buildExpressiveEditorialPrompt(), buildGeometricCollagePrompt()]) {
    assert.match(prompt, /Colour fidelity is a high-priority preservation rule/);
    assert.match(prompt, /original white balance, dominant hues, local colours and cool-versus-warm relationships/);
    assert.match(prompt, /overall yellow, orange, amber, sepia, golden-hour, vintage or warm-filter treatment/);
    assert.match(prompt, /Keep skin tones close to the uploaded reference photo/);
    assert.match(prompt, /Keep neutral black, grey and white areas neutral/);
    assert.match(prompt, /must not cast a global tint over the subject or the original scene/);
  }
});

test("personality appears once and remains secondary to locked product rules", () => {
  const personality = "Yellow flowers and tiny blue stars";
  const prompt = buildExpressiveEditorialPrompt(personality);
  assert.equal(occurrences(prompt, personality), 1);
  assert.match(prompt, /Optional personality guidance is secondary/);
  assert.match(prompt, /must never override subject recognisability, identity preservation, safety, important source colours, the selected house style, composition, subject count or defining features/);
  assert.match(prompt, /Apply this only as secondary direction/);
  assert.match(prompt, /Requested decorative elements may use their own colours, but they must not recolour the entire artwork/);
  assert.match(prompt, /Decorations must not overcrowd or obscure the face, head, body silhouette or defining features/);
  assert.match(prompt, /Do not let it replace the main subject/);
  assert.ok(prompt.indexOf("visual source of truth") < prompt.indexOf(personality));
  assert.ok(prompt.indexOf("Expressive Editorial illustration") < prompt.indexOf(personality));
});

test("every prompt forbids customer-visible text and ends with standalone artwork restrictions", () => {
  for (const prompt of [buildExpressiveEditorialPrompt(), buildGeometricCollagePrompt("Evening mood")]) {
    assert.match(prompt, /one polished standalone illustration/);
    assert.match(prompt, /Do not create a multi-image collage, diptych, triptych/);
    assert.match(prompt, /captions, labels, signatures, watermarks, logos or unrelated written text/);
    assert.match(prompt, /split-screen, before-and-after comparison/);
    assert.match(prompt, /app interface, phone frame, product mockup/);
    assert.match(prompt, /Return only the finished artwork\.$/);
    assert.doesNotMatch(prompt, /\.codex\/style-references|reference\.png/);
  }
});

test("active UI copy uses central new style metadata and contains no obsolete visible names", () => {
  const publicStyles = readFileSync(new URL("../lib/server/house-styles.ts", import.meta.url), "utf8");
  const studio = readFileSync(new URL("../components/private-studio.tsx", import.meta.url), "utf8");
  const landing = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
  const obsoleteNames = [["Bold", "&", "Playful"].join(" "), ["Playful", "Storybook"].join(" ")];
  for (const source of [publicStyles, studio, landing]) for (const name of obsoleteNames) assert.ok(!source.includes(name));
  assert.match(landing, /Choose an expressive hand-drawn look or a bold geometric collage/);
  assert.match(studio, /PUBLIC_HOUSE_STYLES\.map/);
  assert.doesNotMatch(publicStyles, /buildGenerationPrompt|SHARED_PRESERVATION|Prompt version/);
  assert.doesNotMatch(studio, /prompt-builder|visual source of truth|standalone illustration/);
  assert.doesNotMatch(landing, /prompt-builder|visual source of truth|standalone illustration/);
});
