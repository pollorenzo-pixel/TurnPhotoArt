import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const sha256 = (value: string | Uint8Array) => createHash("sha256").update(value).digest("hex");
export const randomToken = () => randomBytes(32).toString("base64url");

export function safeEqual(left: string, right: string) {
  const a = createHash("sha256").update(left).digest();
  const b = createHash("sha256").update(right).digest();
  return timingSafeEqual(a, b);
}

export function signSession(sessionId: string, expiresAt: number, secret: string) {
  const payload = `${sessionId}.${expiresAt}`;
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifySignedSession(cookie: string | undefined, secret: string) {
  if (!cookie) return null;
  const [sessionId, expiresRaw, signature] = cookie.split(".");
  const expiresAt = Number(expiresRaw);
  if (!sessionId || !signature || !Number.isSafeInteger(expiresAt) || expiresAt <= Date.now()) return null;
  const expected = createHmac("sha256", secret).update(`${sessionId}.${expiresAt}`).digest("base64url");
  return safeEqual(signature, expected) ? { sessionId, expiresAt } : null;
}
