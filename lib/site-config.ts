const normalizeSiteUrl = (value: string | undefined): string | null => {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    if ((url.protocol !== "http:" && url.protocol !== "https:") || url.username || url.password) return null;
    if (url.search || url.hash) return null;
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
};

export const SITE_URL = normalizeSiteUrl(process.env.SITE_URL);
export const IS_INDEXING_ENABLED = process.env.SITE_INDEXING_ENABLED === "true" && SITE_URL !== null;

export function absoluteSiteUrl(path = "/"): string | null {
  if (!SITE_URL) return null;
  return new URL(path, `${SITE_URL}/`).toString();
}
