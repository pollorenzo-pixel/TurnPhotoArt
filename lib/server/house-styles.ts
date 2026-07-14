export const PUBLIC_HOUSE_STYLES = [
  { id: "bold-playful", name: "Expressive Editorial", description: "Loose, lively and full of handmade character." },
  { id: "playful-storybook", name: "Geometric Collage", description: "Bold geometric shapes with a richly textured collage finish." },
] as const;

export type HouseStyleId = (typeof PUBLIC_HOUSE_STYLES)[number]["id"];

export function isHouseStyleId(value: string): value is HouseStyleId {
  return value === "bold-playful" || value === "playful-storybook";
}
