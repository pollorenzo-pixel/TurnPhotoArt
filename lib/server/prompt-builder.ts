import type { HouseStyleId } from "@/lib/server/house-styles";

export const PROMPT_VERSION = "turnphotoart-prompt-v7";

type SourceDimensions = { width: number; height: number };

const SHARED_PRESERVATION_RULES = `Transform the uploaded reference photo into one polished, finished illustrated artwork.

The uploaded reference photo is the visual source of truth.

Preserve identity, facial structure, defining features, pose, gesture, framing, composition, clothing, accessories, important objects, dominant source colours, emotional meaning, subject count and spatial relationships.

Keep the result clearly recognisable as the same person, animal, object or scene shown in the uploaded photo.

Do not replace the main subject or invent a different central subject.

Do not unnecessarily change ethnicity, age, body shape, hairstyle, facial expression, species, clothing, accessories, important objects or defining features.

Do not add or remove people or animals unless the customer’s optional personality direction explicitly requests it and the request is safe.

Transform the photo decisively into a fully illustrated, clearly non-photographic artwork that is visually cohesive and unmistakably consistent with the selected house style.

Do not create a photo-overpaint, photo-filter, lightly stylised photo, realism-first rendering, semi-realistic photo treatment, filter-like stylisation or realistic digital painting.

Do not preserve photographic micro-detail or reproduce the source at a pixel-detail level. Reduce realistic skin texture, fabric micro-texture, reflections, photographic micro-contrast and camera-derived detail.

Intentionally redraw and artistically reinterpret forms, planes, shading, textures and background structure as simplified illustrated shapes. The result must feel designed as an artwork, not processed from a photograph.

Keep the subject as the main focus. Preserve recognisable identity, expression, outfit silhouette, important clothing and accessory cues such as glasses or a bandana when present, approximate pose, framing and overall composition.

Integrate any supporting decorations or personality details into the selected style’s composition, shapes and mark-making. They must feel art-directed as part of the illustration rather than pasted around the subject.

Keep the main subject visually dominant. Decorations must not overcrowd or obscure the face, head, body silhouette or defining features.

Facial rendering must be clearly illustrated while preserving recognisable identity, expression, facial proportions and important defining features.

Simplify facial planes into illustrated shapes. Remove pore-level or camera-level detail, reduce photographic skin texture and realistic specular highlights, and avoid polished photographic portrait rendering or realistic digital-painting facial modelling.

Redraw the eyes, nose, mouth and facial contours consistently with the selected house style. Preserve the expression without recreating the source face pixel by pixel; the face must feel intentionally redrawn rather than photo-painted.

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

Optional personality guidance is secondary. It may influence supporting decorations, background flavour, atmosphere, small colour accents, playful objects, mood or secondary visual storytelling, but it must never override subject recognisability, identity preservation, safety, important source colours, the selected house style, composition, subject count or defining features.`;

const EXPRESSIVE_EDITORIAL_STYLE = `Create an original Expressive Editorial illustration that is clearly redrawn from the reference photo.

Use loose ink, coloured-pencil, dry-brush, wax-crayon, pastel and marker-like strokes with energetic hand-drawn contours and layered marks that feel authored rather than mechanically polished.

Build confidently simplified forms with bold but imperfect colour blocking, visible paper grain, tactile handmade texture and softly irregular boundaries.

Use spontaneous editorial composition and generous negative space where compatible with the source composition. Add only occasional scribbles, gestural marks or restrained playful symbols.

Allow selective expressive exaggeration without damaging identity, facial structure, defining features or recognisability.

Use a limited but cheerful palette informed by the uploaded photo while preserving its important local colours, original white balance and cool-versus-warm relationships.

Render faces with expressive drawn contours, simplified illustrated planes, restrained highlights and visible pencil, ink, pastel or dry-brush character. Preserve identity and expression without painted-over photographic skin.

Avoid photorealism, photo filters, painted-over photographic skin or clothing, smooth digital airbrushing, glossy 3D rendering, generic vector art, overly cute children’s illustration and excessive decorative clutter.

The finished image must feel expressive, tactile, contemporary, premium and unmistakably illustrated.`;

const GEOMETRIC_COLLAGE_STYLE = `Create an original Geometric Collage illustration that is clearly reconstructed from the reference photo.

Use angular, faceted shapes to describe the face, body, clothing, objects and background. Translate recognisable defining features into confident graphic planes without excessive abstraction.

Build cut-paper, printed-poster and handmade collage qualities with bold flat colour planes, simplified geometric silhouettes and an asymmetric but intentional composition.

Mix crisp graphic edges with imperfect hand-drawn line details and subtle ink, paper, print, pencil, stipple and grain textures.

Use restrained shadow shapes rather than realistic lighting, with a limited high-contrast palette informed by the uploaded photo and a confident poster-like visual hierarchy.

Render faces and bodies as recognisable faceted planes with simplified geometric modelling, preserving identity, expression and proportions without photographic fragments or realistic skin rendering.

Avoid photorealism, photographic fragments, literal digital cut-out effects, smooth 3D polygons, generic low-poly rendering, glossy gradients, vector-clean corporate illustration and abstraction that destroys identity.

The finished image must feel bold, graphic, sophisticated, tactile, collectible and unmistakably illustrated.`;

const SHARED_OUTPUT_RESTRICTIONS = `Produce one polished standalone illustration.

Do not create a multi-image collage, diptych, triptych, split-screen, before-and-after comparison, contact sheet, app interface, phone frame, product mockup or instructional diagram.

For Geometric Collage, use collage as the illustration construction technique within one continuous standalone artwork, never as a multi-panel or multiple-image layout.

Do not include captions, labels, signatures, watermarks, logos or unrelated written text.

Do not reproduce any character, composition, text, prop arrangement or exact palette from the development style-reference images.

Return only the finished artwork.`;

function compositionSection(sourceDimensions: SourceDimensions | null) {
  if (!sourceDimensions) return null;
  const shape = sourceDimensions.width === sourceDimensions.height ? "square" : sourceDimensions.width > sourceDimensions.height ? "landscape" : "portrait";
  return `Compose for a ${shape} final canvas matching the uploaded source aspect ratio and for a minimal full-bleed cover crop.

Keep the primary subject away from crop-sensitive outer edges. Preserve important face, head, headwear, shoulders, body, clothing and accessory details inside a stable central composition-safe area; keep the eyes and face securely within that area when present.

For animals or objects, keep the primary head, face, body silhouette and defining features within the safe area. Let expendable background illustration extend naturally and continuously to every outer edge so background can be cropped before subject features.`;
}

function personalitySection(personality: string | null) {
  if (!personality) return null;
  return `Optional personality guidance from the customer: ${personality}

Apply this only as secondary direction for supporting decorations, background flavour, atmosphere, small colour accents, playful objects, mood or secondary visual storytelling. Requested decorative elements may use their own colours, but they must not recolour the entire artwork.

Do not let it replace the main subject, contradict the selected house style, reduce recognisability, change composition, subject count or defining features, or override source colour fidelity or safety rules.`;
}

function assemblePrompt(styleBlock: string, personality: string | null, sourceDimensions: SourceDimensions | null) {
  return [
    `[Prompt version: ${PROMPT_VERSION}]`,
    SHARED_PRESERVATION_RULES,
    compositionSection(sourceDimensions),
    styleBlock,
    personalitySection(personality),
    SHARED_OUTPUT_RESTRICTIONS,
  ].filter((section): section is string => Boolean(section)).join("\n\n");
}

export function buildExpressiveEditorialPrompt(personality: string | null = null, sourceDimensions: SourceDimensions | null = null) {
  return assemblePrompt(EXPRESSIVE_EDITORIAL_STYLE, personality, sourceDimensions);
}

export function buildGeometricCollagePrompt(personality: string | null = null, sourceDimensions: SourceDimensions | null = null) {
  return assemblePrompt(GEOMETRIC_COLLAGE_STYLE, personality, sourceDimensions);
}

export function buildArtworkPrompt({ style, personality = null, sourceDimensions = null }: { style: HouseStyleId; personality?: string | null; sourceDimensions?: SourceDimensions | null }) {
  if (style === "bold-playful") return buildExpressiveEditorialPrompt(personality, sourceDimensions);
  if (style === "playful-storybook") return buildGeometricCollagePrompt(personality, sourceDimensions);
  throw new Error("invalid_style");
}

export function buildGenerationPrompt(styleId: HouseStyleId, personality: string | null, sourceDimensions: SourceDimensions | null = null) {
  return buildArtworkPrompt({ style: styleId, personality, sourceDimensions });
}
