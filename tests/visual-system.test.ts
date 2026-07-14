import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

test("homepage presents the creative-expression sequence with a clear private-test action", () => {
  const source = read("../app/page.tsx");
  assert.match(source, /Turn a favourite photo into <em>expressive, handcrafted artwork\.<\/em>/);
  assert.match(source, /className="button button-primary hero-cta" href="\/private-test"/);
  assert.match(source, /className="house-styles"/);
  assert.match(source, /className="creative-process"/);
  assert.match(source, /className="trust-panel"/);
  assert.match(source, /className="private-cta"/);
  assert.doesNotMatch(source, /<img|testimonial|customer count|five-star/i);
  assert.match(source, /aria-hidden="true"/);
});

test("private gate keeps one accessible access-code action and friendly error association", () => {
  const page = read("../app/private-test/page.tsx");
  const form = read("../components/private-access-form.tsx");
  assert.match(page, /TurnPhotoArt/);
  assert.match(page, /Invite-only creative studio/);
  assert.match(form, /htmlFor="access-code"/);
  assert.match(form, /autoComplete="one-time-code"/);
  assert.match(form, /aria-invalid=\{Boolean\(error\)\}/);
  assert.match(form, /aria-describedby=\{error\?"access-error":undefined\}/);
  assert.match(form, /id="access-error" role="alert"/);
  assert.equal((form.match(/type="submit"/g) ?? []).length, 1);
});

test("studio preserves explicit semantic controls and never auto-generates", () => {
  const source = read("../components/private-studio.tsx");
  assert.match(source, /type="radio" name="style"/);
  assert.match(source, /checked=\{style===item\.id\}/);
  assert.match(source, /onChange=\{\(\)=>setStyle\(item\.id\)\}/);
  assert.match(source, /Add more personality <em>Optional<\/em>/);
  assert.match(source, /maxLength=\{160\}/);
  assert.match(source, /\{count\} \/ 160/);
  assert.match(source, /type="button" disabled=\{!file\|\|busy\} onClick=\{createArtwork\}/);
  assert.doesNotMatch(source, /useEffect\(\(\)=>\{?createArtwork/);
  assert.match(source, /role="status" aria-live="polite"/);
  assert.match(source, /We’re checking whether your artwork finished successfully/);
  assert.match(source, /Private test complete/);
  assert.match(source, /results\.map\(\(result\)=>/);
  assert.match(source, /Download artwork/);
  assert.doesNotMatch(source, /prompt-builder|buildGenerationPrompt|PROMPT_VERSION/);
});

test("visual system protects focus, reduced motion and uncropped artwork presentation", () => {
  const css = read("../app/globals.css");
  assert.match(css, /--coral:#e6533d/);
  assert.match(css, /--ochre:#c98b2d/);
  assert.match(css, /--sage:#7f8d65/);
  assert.match(css, /--lavender:#9d89b8/);
  assert.match(css, /textarea:focus-visible/);
  assert.match(css, /label:has\(input:focus-visible\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css, /\.reference-image img\{[^}]*object-fit:contain/);
  assert.match(css, /\.result-grid article>img\{[^}]*height:auto;[^}]*aspect-ratio:auto;[^}]*object-fit:contain/);
  assert.match(css, /@media\(max-width:340px\)/);
});

test("client presentation uses abstract motifs rather than fabricated customer artwork", () => {
  const home = read("../app/page.tsx");
  const studio = read("../components/private-studio.tsx");
  assert.match(home, /style-abstract/);
  assert.match(studio, /studio-style-motif/);
  assert.doesNotMatch(home, /src=|backgroundImage|data:image/);
  assert.doesNotMatch(studio, /sample|example artwork|customer artwork/i);
});
