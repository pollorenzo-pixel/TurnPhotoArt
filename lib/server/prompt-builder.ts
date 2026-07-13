import type { HouseStyleId } from "@/lib/server/house-styles";

export const PROMPT_VERSION = "turnphotoart-prompt-v5";

const SHARED_PRESERVATION_RULES = `Transform the uploaded reference photo into one polished, finished illustrated artwork.

The uploaded reference photo is the visual source of truth.

Preserve the main subject’s identity, species, distinctive facial or physical features, emotional meaning, important objects, approximate pose, framing and overall composition.

Keep the result clearly recognisable as the same person, animal, object or scene shown in the uploaded photo.

Do not replace the main subject or invent a different central subject.

Do not unnecessarily change ethnicity, age, facial structure, body shape, species or defining features.

Transform the photo decisively into a fully illustrated, clearly non-photographic artwork that is visually cohesive and unmistakably consistent with the selected house style.

Do not create a photo-overpaint, photo-filter, lightly stylised photo, realism-first rendering, semi-realistic photo treatment, filter-like stylisation or realistic digital painting.

Do not preserve photographic micro-detail or reproduce the source at a pixel-detail level. Reduce realistic skin texture, fabric micro-texture, reflections, photographic micro-contrast and camera-derived detail.

Intentionally redraw and artistically reinterpret forms, planes, shading, textures and background structure as simplified illustrated shapes. The result must feel designed as an artwork, not processed from a photograph.

Keep the subject as the main focus. Preserve recognisable identity, expression, outfit silhouette, important clothing and accessory cues such as glasses or a bandana when present, approximate pose, framing and overall composition.

Integrate any supporting decorations or personality details into the selected style’s composition, shapes and mark-making. They must feel art-directed as part of the illustration rather than pasted around the subject.

Colour fidelity is a high-priority preservation rule.

Preserve the uploaded photo’s original white balance, dominant hues, local colours and cool-versus-warm relationships.

Apply the selected illustration style through shape, linework, shading, texture, grain, painterly treatment and handmade detail—not through a global colour tint.

Do not apply an overall yellow, orange, amber, sepia, golden-hour, vintage or warm-filter treatment unless the customer explicitly requests that colour mood.

Keep skin tones close to the uploaded reference photo.

Keep neutral black, grey and white areas neutral.

Preserve clearly identifiable source colours, including backgrounds, clothing, accessories, objects and environmental details.

Optional decorative elements may introduce their own colours, but those colours must not cast a global tint over the subject or the original scene.

Colours may be slightly simplified, saturated, softened, posterised or painterly when appropriate to the selected style, but the source image’s overall palette, local colour identity and white balance must remain recognisable.

Background details may be simplified or artistically reinterpreted when useful, but they must continue to support the original subject and scene.

Optional personality guidance is secondary. It may influence supporting decorations, background flavour, atmosphere, small colour accents, playful objects, mood or secondary visual storytelling, but it must never override subject recognisability, source colour fidelity, safety rules or the selected house style.`;

const BOLD_PLAYFUL_STYLE = `Render the reference as a Bold & Playful contemporary editorial illustration.

Push the transformation toward a strong stylised graphic editorial cartoon portrait with obvious artistic reinterpretation while keeping the subject recognisable.

Use simplified graphic shapes with bold shape simplification, confident colour blocking with flatter and cleaner colour areas, strong visual masses, readable outlines and silhouettes, and a confident graphic composition.

Create tactile handmade texture using grainy chalk, dry pastel, printed-paper or softly stippled marks.

Use softly irregular handmade edges rather than sterile vector-perfect boundaries.

Allow tasteful playful exaggeration while preserving the subject’s identity and defining features.

Use expressive silhouettes, strong negative space and a restrained number of charming accents such as sparkles, hearts, stars, movement marks or simple decorative shapes when they suit the image.

The image should feel energetic, cheerful, stylish and premium rather than childish.

Keep details intentionally simplified and graphic.

Reduce photographic rendering decisively. Stylise skin, fabrics and the background into graphic planes and tactile illustrated shapes rather than realistic surfaces.

The result must not resemble a painted photo, semi-realistic portrait art, timid photorealism or realistic digital painting. It should have energetic, cheerful, product-worthy, poster-like energy and read immediately as a transformed cartoon illustration.

Use the uploaded photo’s palette as the foundation. Preserve graphic colour blocking without introducing a default warm palette, amber lighting, yellow skin cast, sepia treatment, warm vintage grading or colour spill from decorative elements across the whole image.

The finished result should feel like a bold contemporary art print: playful, tactile, recognisable and visually confident.`;

const PLAYFUL_STORYBOOK_STYLE = `Render the reference as a Playful Storybook illustration with expressive hand-drawn linework and painterly colour.

Push the transformation toward a clearly illustrated storybook character portrait based on the original subject, not a realistic watercolour portrait.

Use lively, flowing and slightly imperfect lines that create emotional warmth, motion and personality.

Use organic shapes, loose sketch energy, expressive gestures and carefully simplified details.

Create painterly colour areas with a gouache, watercolour, coloured-pencil or digital-brush feeling.

Keep the rendering painterly but simplified: reinterpret skin, fabrics, props and backgrounds as soft illustrated forms, expressive marks and stylised planes instead of realistic photographic surfaces.

Preserve the subject’s recognisability while allowing charming illustrated expression and gentle exaggeration.

Give the composition a sense of narrative, emotional warmth and playful movement, even when the source photo is calm or simple. Warmth describes the emotional atmosphere, not a mandatory warm colour temperature or warm colour grading.

Supporting background elements may be softened, simplified or made more whimsical while remaining connected to the original scene.

Create clear transformation away from photo realism. The result must not resemble realistic watercolour portraiture, a realistic overpaint, quasi-photographic rendering, muddy detail retention, subtle photo stylisation or a simple “photo but softer” treatment; it should feel intentionally redrawn as a hand-crafted, whimsical children’s-book artwork.

The image should feel contemporary, lively, charming, imaginative and emotionally engaging rather than overly polished, photorealistic or flat.

Keep the uploaded photo’s original palette and white balance recognisable even when the rendering becomes softer or more painterly. Do not automatically introduce golden lighting, a yellow or orange skin tint, sepia, nostalgic warm filters, an amber wash over cool backgrounds or loss of neutral blacks, greys or whites.

The finished result should feel like a memorable page from a modern illustrated storybook: expressive, charming, dynamic and recognisable.`;

const SHARED_OUTPUT_RESTRICTIONS = `Produce one polished standalone illustration.

Do not create a collage, diptych, triptych, split-screen, before-and-after comparison, contact sheet, app interface, phone frame, product mockup or instructional diagram.

Do not include captions, labels, signatures, watermarks, logos or unrelated written text.

Do not reproduce any character, composition, text, prop arrangement or exact palette from the development style-reference images.

Return only the finished artwork.`;

function personalitySection(personality: string | null) {
  if (!personality) return null;
  return `Optional personality guidance from the customer: ${personality}

Apply this only as secondary direction for supporting decorations, background flavour, atmosphere, small colour accents, playful objects, mood or secondary visual storytelling. Requested decorative elements may use their own colours, but they must not recolour the entire artwork.

Do not let it replace the main subject, contradict the selected house style, reduce recognisability or override source colour fidelity or safety rules.`;
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
