export const PUBLIC_HOUSE_STYLES = [
  { id: "bold-playful", name: "Bold & Playful", description: "Bright, cheerful and full of personality." },
  { id: "playful-storybook", name: "Playful Storybook", description: "Soft, dreamy and lovingly hand-painted." },
] as const;

export type HouseStyleId = (typeof PUBLIC_HOUSE_STYLES)[number]["id"];

export function isHouseStyleId(value: string): value is HouseStyleId {
  return value === "bold-playful" || value === "playful-storybook";
}
