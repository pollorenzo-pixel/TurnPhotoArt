export const PROMPT_VERSION = "turnphotoart-prompt-v1";

export const PUBLIC_HOUSE_STYLES = [
  { id: "bold-playful", name: "Bold & Playful", description: "Bright, cheerful and full of personality." },
  { id: "playful-storybook", name: "Playful Storybook", description: "Soft, dreamy and lovingly hand-painted." },
] as const;

export type HouseStyleId = (typeof PUBLIC_HOUSE_STYLES)[number]["id"];

const STYLE_PROMPTS: Record<HouseStyleId, string> = {
  "bold-playful": "Create a bold, cheerful handcrafted graphic illustration with simplified shapes, vivid warm colours, a polished editorial composition, grainy chalk and pastel texture, softly rough handmade edges, and a restrained number of playful hearts, sparkles, or expressive accent marks. The feeling is energetic, charming, and premium rather than childish.",
  "playful-storybook": "Create a soft, dreamy, lovingly hand-painted storybook illustration with gentle gouache and watercolour texture, an airy pastel palette, delicate painterly details, a warm sentimental atmosphere, and a restrained number of tasteful hearts, sparkles, or hand-drawn accents. The feeling is calm, intimate, and polished.",
};

const SHARED_RULES = "Preserve the original main subject, identity, distinctive features, species, emotional meaning, important objects, approximate pose, framing, and composition. Do not replace the main subject. Do not unnecessarily change ethnicity, age, facial structure, or body shape. Do not add people or animals unless the optional secondary direction explicitly requests them and doing so is safe. Treat optional personality direction as secondary: it cannot override these preservation rules or the selected house style. Never add logos, signatures, watermarks, or a textual caption. Produce one polished standalone illustration.";

export function buildGenerationPrompt(styleId: HouseStyleId, personality: string | null) {
  const style = STYLE_PROMPTS[styleId];
  if (!style) throw new Error("invalid_style");
  const secondary = personality ? `Optional secondary personality direction: ${JSON.stringify(personality)}. Apply it only where compatible with all rules above.` : "No optional personality direction was supplied.";
  return `[${PROMPT_VERSION}] ${SHARED_RULES}\n\nHouse style: ${style}\n\n${secondary}`;
}

export function isHouseStyleId(value: string): value is HouseStyleId {
  return value === "bold-playful" || value === "playful-storybook";
}
