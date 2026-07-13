import { NextRequest } from "next/server";
import { assertGenerationAllowed, operatingMode } from "@/lib/server/config";
import { sha256 } from "@/lib/server/crypto";
import { isHouseStyleId } from "@/lib/server/house-styles";
import { buildGenerationPrompt, PROMPT_VERSION } from "@/lib/server/prompt-builder";
import { validateProviderPng, validateServerImage } from "@/lib/server/image-validation";
import { outputSizeFor } from "@/lib/server/output-size";
import { normalizePersonality } from "@/lib/server/personality";
import { requirePrivateSession } from "@/lib/server/private-session";
import { getImageProvider } from "@/lib/server/providers";
import { SafeProviderError } from "@/lib/server/providers/types";
import { assertMultipartSize, clientIpHash, noStoreJson } from "@/lib/server/request-safety";
import { getStateStore } from "@/lib/server/state";

const userMessage: Record<string, string> = {
  generation_paused: "Artwork creation is temporarily unavailable during private testing.", generation_limit_reached: "Three artwork versions have already been created.", set_generation_active: "This photo already has artwork creation in progress.", session_generation_active: "Another artwork is already being created in this test session.", moderation_blocked: "This request could not be completed by the safety system. Try adjusting the optional details.", provider_timeout_unknown: "The provider response is uncertain. Please do not retry yet; the reservation needs review.", daily_cost_limit: "The private test has reached its cost-safety limit.", global_concurrency_reached: "Another private generation is currently running. Try again later.", reference_mismatch: "The selected photo does not match this artwork. Please continue with the original photo for this version.", personality_too_long: "Keep the optional personality details to 160 characters.",
};

export async function POST(request: NextRequest) {
  let generationId: string | null = null;
  try {
    assertGenerationAllowed(); const session = await requirePrivateSession(); assertMultipartSize(request);
    const token = request.headers.get("x-artwork-set-token"); const idempotencyKey = request.headers.get("x-idempotency-key");
    if (!token || !idempotencyKey || idempotencyKey.length < 16 || idempotencyKey.length > 128) throw new Error("invalid_request");
    const form = await request.formData(); const file = form.get("reference"); const styleValue = form.get("style");
    if (!(file instanceof File) || typeof styleValue !== "string" || !isHouseStyleId(styleValue)) throw new Error("invalid_request");
    const personality = normalizePersonality(form.get("personality")); const image = await validateServerImage(file);
    const store = await getStateStore(); const tokenHash = sha256(token); const set = await store.findSet(tokenHash);
    if (!set || set.referenceSha256 !== image.sha256) throw new Error("reference_mismatch");
    const prompt = buildGenerationPrompt(styleValue, personality); const size = outputSizeFor(image.width, image.height);
    const reserved = await store.reserve({ tokenHash, idempotencyHash: sha256(idempotencyKey), sessionHash: session.sessionHash, ipHash: clientIpHash(request), styleId: styleValue, personalityLength: personality ? [...personality].length : 0, personalityHash: personality ? sha256(personality) : null, promptVersion: PROMPT_VERSION, model: "gpt-image-2", quality: operatingMode.quality, size, dailyRequestLimit: operatingMode.dailyRequestLimit, hourlyIpLimit: operatingMode.hourlyIpLimit, globalConcurrencyLimit: operatingMode.globalConcurrencyLimit, dailyCostLimitUnits: operatingMode.dailyCostLimitUnits, reservationUnits: operatingMode.reservationUnits });
    if (reserved.kind === "existing") return noStoreJson({ existing: true, status: reserved.generation.status, successfulCount: reserved.set.successfulCount }, reserved.generation.status === "processing" || reserved.generation.status === "reserved" ? 202 : 409);
    generationId = reserved.generation.id; await store.markProcessing(generationId);
    const provider = await getImageProvider();
    const result = await provider.generate({ reference: image.bytes, mimeType: image.mimeType, width: image.width, height: image.height, styleId: styleValue, prompt, quality: operatingMode.quality, simulation: operatingMode.provider === "fake" ? request.headers.get("x-fake-simulation") : null });
    await validateProviderPng(result.bytes); const completedSet = await store.settle(generationId, "succeeded", null, { requestId: result.requestId, usage: result.usage });
    return new Response(new Uint8Array(result.bytes), { status: 200, headers: { "Content-Type": "image/png", "Content-Length": String(result.bytes.length), "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow", "X-Artwork-Version": String(reserved.generation.sequence), "X-Artwork-Style": styleValue, "X-Successful-Count": String(completedSet.successfulCount) } });
  } catch (error) {
    const code = error instanceof Error ? error.message : "internal_error";
    if (generationId) {
      try {
        const store = await getStateStore();
        if (error instanceof SafeProviderError && error.code === "provider_timeout_unknown") await store.settle(generationId, "unknown", error.code);
        else if (error instanceof SafeProviderError && error.code === "moderation_blocked") await store.settle(generationId, "blocked", error.code);
        else await store.settle(generationId, "failed", error instanceof SafeProviderError ? error.code : code === "malformed_provider_output" ? code : "internal_error");
      } catch { /* The original safe error remains authoritative for the response. */ }
    }
    const safeCode = error instanceof SafeProviderError ? error.code : code;
    const status = safeCode === "private_configuration_invalid" ? 404 : safeCode === "private_access_required" ? 401 : ["generation_paused","daily_request_limit","hourly_ip_limit","daily_cost_limit","global_concurrency_reached"].includes(safeCode) ? 429 : safeCode === "generation_limit_reached" ? 409 : 400;
    return noStoreJson({ error: userMessage[safeCode] || "The artwork could not be created. Please review the photo and try again later.", code: safeCode === "provider_timeout_unknown" ? "generation_state_unknown" : "generation_unavailable" }, status);
  }
}
