import "server-only";
import { cookies } from "next/headers";
import { sha256, verifySignedSession } from "@/lib/server/crypto";

export const PRIVATE_COOKIE = "turnphotoart_private_test";

export async function requirePrivateSession() {
  const secret = process.env.TURNPHOTOART_SESSION_SECRET;
  if (!secret) throw new Error("private_access_required");
  const value = (await cookies()).get(PRIVATE_COOKIE)?.value;
  const session = verifySignedSession(value, secret);
  if (!session) throw new Error("private_access_required");
  return { ...session, sessionHash: sha256(session.sessionId) };
}
