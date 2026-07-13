import { NextRequest } from "next/server";
import { randomToken, sha256 } from "@/lib/server/crypto";
import { isPrivateFoundationEnabled, validatePrivateConfiguration } from "@/lib/server/config";
import { validateServerImage } from "@/lib/server/image-validation";
import { requirePrivateSession } from "@/lib/server/private-session";
import { assertMultipartSize, noStoreJson } from "@/lib/server/request-safety";
import { getStateStore } from "@/lib/server/state";

export async function POST(request: NextRequest) {
  if (!isPrivateFoundationEnabled() || validatePrivateConfiguration().length) return noStoreJson({ error: "Private testing is unavailable." }, 503);
  try {
    await requirePrivateSession(); assertMultipartSize(request);
    const form = await request.formData(); const file = form.get("reference");
    if (!(file instanceof File)) throw new Error("invalid_image");
    const image = await validateServerImage(file); const token = randomToken();
    const record = await (await getStateStore()).createSet({ tokenHash: sha256(token), referenceSha256: image.sha256, mimeType: image.mimeType, width: image.width, height: image.height, expiresAt: new Date(Date.now() + 24 * 60 * 60_000).toISOString() });
    return noStoreJson({ artworkSetToken: token, successfulCount: record.successfulCount, expiresAt: record.expiresAt });
  } catch (error) {
    const code = error instanceof Error ? error.message : "internal_error";
    return noStoreJson({ error: ["invalid_image","unsupported_image","unreadable_image","image_dimensions_exceeded","request_too_large"].includes(code) ? "Choose a valid JPEG, PNG or WebP within the upload limits." : "The artwork could not be prepared." }, code === "private_access_required" ? 401 : 400);
  }
}
