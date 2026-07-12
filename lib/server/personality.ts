const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u;

export function normalizePersonality(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") throw new Error("personality_invalid");
  const normalized = value.normalize("NFKC").replace(/\s+/gu, " ").trim();
  if (!normalized) throw new Error("personality_empty");
  if (CONTROL_CHARACTERS.test(normalized)) throw new Error("personality_control_characters");
  if ([...normalized].length > 160) throw new Error("personality_too_long");
  return normalized;
}
