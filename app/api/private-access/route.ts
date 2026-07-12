import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { safeEqual, sha256, signSession } from "@/lib/server/crypto";
import { isPrivateFoundationEnabled } from "@/lib/server/config";
import { PRIVATE_COOKIE } from "@/lib/server/private-session";
import { clientIpHash, noStoreJson } from "@/lib/server/request-safety";

const attempts = new Map<string, number[]>();

export async function POST(request: NextRequest) {
  if (!isPrivateFoundationEnabled()) return noStoreJson({ error: "Private testing is unavailable." }, 404);
  const ipHash = clientIpHash(request); const cutoff = Date.now() - 15 * 60_000;
  const recent = (attempts.get(ipHash) ?? []).filter((value) => value > cutoff);
  if (recent.length >= 5) return noStoreJson({ error: "Access could not be confirmed. Try again later." }, 429);
  let code = "";
  try { const body = await request.json() as { code?: unknown }; if (typeof body.code === "string") code = body.code; } catch { return noStoreJson({ error: "Access could not be confirmed." }, 400); }
  const expected = process.env.TURNPHOTOART_TEST_ACCESS_CODE || randomUUID();
  if (!safeEqual(code, expected)) { attempts.set(ipHash, [...recent, Date.now()]); return noStoreJson({ error: "Access could not be confirmed." }, 401); }
  attempts.delete(ipHash);
  const secret = process.env.TURNPHOTOART_SESSION_SECRET;
  if (!secret || secret.length < 32) return noStoreJson({ error: "Private testing is unavailable." }, 503);
  const expiresAt = Date.now() + 12 * 60 * 60_000;
  const response = noStoreJson({ ok: true });
  response.headers.append("Set-Cookie", `${PRIVATE_COOKIE}=${signSession(sha256(randomUUID()), expiresAt, secret)}; Path=/; Max-Age=43200; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
  return response;
}
