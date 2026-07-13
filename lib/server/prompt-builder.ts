import type { HouseStyleId } from "@/lib/server/house-styles";

export const PROMPT_VERSION = "turnphotoart-prompt-v2";

const SHARED_PRESERVATION_RULES = `Transform the uploaded reference photo into one polished, finished illustrated artwork.

The uploaded reference photo is the visual source of truth.

Preserve the main subject’s identity, species, distinctive facial or physical features, emotional meaning, important objects, approximate pose, framing and overall composition.

Keep the result clearly recognisable as the same person, animal, object or scene shown in the uploaded photo.

Do not replace the main subject or invent a different central subject.

Do not unnecessarily change ethnicity, age, facial structure, body shape, species or defining features.

Preserve the source photo’s dominant colour relationships unless optional personality guidance clearly requests a different colour mood.

Background details may be simplified or artistically reinterpreted when useful, but they must continue to support the original subject and scene.

Optional personality guidance is secondary. It may influence decorations, colour mood, atmosphere or supporting details, but it must never override subject recognisability, safety rules or the selected house style.`;

const BOLD_PLAYFUL_STYLE = `Render the reference as a Bold & Playful contemporary editorial illustration.

Use simplified graphic shapes, confident colour blocking, strong visual masses and a clean, striking composition.

Create tactile handmade texture using grainy chalk, dry pastel, printed-paper or softly stippled marks.

Use softly irregular handmade edges rather than sterile vector-perfect boundaries.

Allow tasteful playful exaggeration while preserving the subject’s identity and defining features.

Use expressive silhouettes, strong negative space and a restrained number of charming accents such as sparkles, hearts, stars, movement marks or simple decorative shapes when they suit the image.

The image should feel energetic, cheerful, stylish and premium rather than childish.

Keep details intentionally simplified and graphic.

Use the uploaded photo’s colour relationships as the foundation rather than copying colours from the development reference.

The finished result should feel like a bold contemporary art print: playful, tactile, recognisable and visually confident.`;

const PLAYFUL_STORYBOOK_STYLE = `Render the reference as a Playful Storybook illustration with expressive hand-drawn linework and painterly colour.

Use lively, flowing and slightly imperfect lines that create warmth, motion and personality.

Use organic shapes, loose sketch energy, expressive gestures and carefully simplified details.

Create painterly colour areas with a gouache, watercolour, coloured-pencil or digital-brush feeling.

Preserve the subject’s recognisability while allowing charming illustrated expression and gentle exaggeration.

Give the composition a sense of narrative, emotional warmth and playful movement, even when the source photo is calm or simple.

Supporting background elements may be softened, simplified or made more whimsical while remaining connected to the original scene.

The image should feel contemporary, warm, imaginative and emotionally engaging rather than overly polished, photorealistic or flat.

Use the uploaded photo’s colour relationships as the foundation rather than copying colours from the development reference.

The finished result should feel like a memorable page from a modern illustrated storybook: expressive, charming, dynamic and recognisable.`;

const SHARED_OUTPUT_RESTRICTIONS = `Produce one polished standalone illustration.

Do not create a collage, diptych, triptych, split-screen, before-and-after comparison, contact sheet, app interface, phone frame, product mockup or instructional diagram.

Do not include captions, labels, signatures, watermarks, logos or unrelated written text.

Do not reproduce any character, composition, text, prop arrangement or exact palette from the development style-reference images.

Return only the finished artwork.`;

function personalitySection(personality: string | null) {
  if (!personality) return null;
  return `Optional personality guidance from the customer: ${personality}

Apply this only as secondary direction for colour mood, atmosphere, decorations, background flavour or playful supporting details.

Do not let it replace the main subject, contradict the selected house style or reduce recognisability.`;
}

function assemblePrompt(styleBlock: string, personality: string | null) {
  return [
    `[Prompt version: ${PROMPT_VERSION}]`,
    SHARED_PRESERVATION_RULES,
    styleBlock,
    personalitySection(personality),
    SHARED_OUTPUT_RESTRICTIONS,
  ].filter((section): section is string => Boolean(section)).join("\n\n");
}

export function buildBoldPlayfulPrompt(personality: string | null = null) {
  return assemblePrompt(BOLD_PLAYFUL_STYLE, personality);
}

export function buildPlayfulStorybookPrompt(personality: string | null = null) {
  return assemblePrompt(PLAYFUL_STORYBOOK_STYLE, personality);
}

export function buildArtworkPrompt({ style, personality = null }: { style: HouseStyleId; personality?: string | null }) {
  if (style === "bold-playful") return buildBoldPlayfulPrompt(personality);
  if (style === "playful-storybook") return buildPlayfulStorybookPrompt(personality);
  throw new Error("invalid_style");
}

export function buildGenerationPrompt(styleId: HouseStyleId, personality: string | null) {
  return buildArtworkPrompt({ style: styleId, personality });
}
