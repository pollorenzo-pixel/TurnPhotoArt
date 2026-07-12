import { NextRequest } from "next/server";
import { sha256 } from "@/lib/server/crypto";
import { requirePrivateSession } from "@/lib/server/private-session";
import { noStoreJson } from "@/lib/server/request-safety";
import { getStateStore } from "@/lib/server/state";

export async function GET(request: NextRequest) {
  try {
    await requirePrivateSession(); const token = request.headers.get("x-artwork-set-token");
    if (!token) throw new Error("artwork_set_invalid");
    const set = await (await getStateStore()).findSet(sha256(token));
    if (!set) throw new Error("artwork_set_invalid");
    return noStoreJson({ successfulCount: set.successfulCount, status: set.status, expiresAt: set.expiresAt });
  } catch { return noStoreJson({ error: "Artwork set unavailable." }, 401); }
}
