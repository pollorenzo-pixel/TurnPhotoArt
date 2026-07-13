import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  buildArtworkPrompt,
  buildBoldPlayfulPrompt,
  buildGenerationPrompt,
  buildPlayfulStorybookPrompt,
  PROMPT_VERSION,
} from "../lib/server/prompt-builder";

const occurrences = (value: string, needle: string) => value.split(needle).length - 1;

test("prompt version and style router are deterministic", () => {
  assert.equal(PROMPT_VERSION, "turnphotoart-prompt-v2");
  assert.equal(buildArtworkPrompt({ style: "bold-playful" }), buildBoldPlayfulPrompt());
  assert.equal(buildArtworkPrompt({ style: "playful-storybook" }), buildPlayfulStorybookPrompt());
  assert.equal(buildGenerationPrompt("bold-playful", null), buildBoldPlayfulPrompt());
  assert.throws(() => buildArtworkPrompt({ style: "invalid-style" as "bold-playful" }), /invalid_style/);
});

test("Bold & Playful contains only its style language and shared preservation", () => {
  const prompt = buildBoldPlayfulPrompt();
  assert.match(prompt, /uploaded reference photo is the visual source of truth/);
  assert.match(prompt, /same person, animal, object or scene/);
  assert.match(prompt, /simplified graphic shapes/);
  assert.match(prompt, /grainy chalk, dry pastel, printed-paper or softly stippled marks/);
  assert.match(prompt, /strong negative space/);
  assert.match(prompt, /bold contemporary art print/);
  assert.match(prompt, /uploaded photo’s colour relationships/);
  assert.doesNotMatch(prompt, /Playful Storybook illustration/);
  assert.doesNotMatch(prompt, /Optional personality guidance from the customer:/);
});

test("Playful Storybook contains only its style language and shared preservation", () => {
  const prompt = buildPlayfulStorybookPrompt();
  assert.match(prompt, /uploaded reference photo is the visual source of truth/);
  assert.match(prompt, /same person, animal, object or scene/);
  assert.match(prompt, /expressive hand-drawn linework and painterly colour/);
  assert.match(prompt, /warmth, motion and personality/);
  assert.match(prompt, /sense of narrative, emotional warmth and playful movement/);
  assert.match(prompt, /modern illustrated storybook/);
  assert.match(prompt, /uploaded photo’s colour relationships/);
  assert.doesNotMatch(prompt, /Bold & Playful contemporary editorial illustration/);
  assert.doesNotMatch(prompt, /Optional personality guidance from the customer:/);
});

test("personality appears exactly once and remains secondary", () => {
  const personality = "Yellow flowers and tiny blue stars";
  const prompt = buildBoldPlayfulPrompt(personality);
  assert.equal(occurrences(prompt, personality), 1);
  assert.match(prompt, /Apply this only as secondary direction/);
  assert.match(prompt, /must never override subject recognisability/);
  assert.match(prompt, /Do not let it replace the main subject/);
  assert.ok(prompt.indexOf("visual source of truth") < prompt.indexOf(personality));
  assert.ok(prompt.indexOf("Bold & Playful contemporary editorial illustration") < prompt.indexOf(personality));
});

test("every prompt ends with standalone artwork restrictions", () => {
  for (const prompt of [buildBoldPlayfulPrompt(), buildPlayfulStorybookPrompt("Warm evening mood")]) {
    assert.match(prompt, /one polished standalone illustration/);
    assert.match(prompt, /unrelated written text/i);
    assert.match(prompt, /watermarks, logos/);
    assert.match(prompt, /split-screen, before-and-after comparison/);
    assert.match(prompt, /app interface, phone frame, product mockup/);
    assert.match(prompt, /Return only the finished artwork\.$/);
    assert.doesNotMatch(prompt, /\.codex\/style-references|bold-playful-reference\.png|playful-storybook-reference\.png/);
  }
});

test("prompt implementation is absent from client-owned modules", () => {
  const publicStyles = readFileSync(new URL("../lib/server/house-styles.ts", import.meta.url), "utf8");
  const studio = readFileSync(new URL("../components/private-studio.tsx", import.meta.url), "utf8");
  const landing = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(publicStyles, /buildGenerationPrompt|SHARED_PRESERVATION|Prompt version/);
  assert.doesNotMatch(studio, /prompt-builder|visual source of truth|standalone illustration/);
  assert.doesNotMatch(landing, /prompt-builder|visual source of truth|standalone illustration/);
});
