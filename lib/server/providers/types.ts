import type { HouseStyleId } from "@/lib/server/house-styles";
import type { ImageQuality } from "@/lib/server/config";

export type ProviderInput = { reference: Buffer; mimeType: string; width: number; height: number; styleId: HouseStyleId; prompt: string; quality: ImageQuality; simulation?: string | null };
export type ProviderResult = { bytes: Buffer; requestId?: string; usage?: { inputTokens?: number; outputTokens?: number } };
export type ImageProvider = { name: "fake" | "openai"; generate(input: ProviderInput): Promise<ProviderResult> };

export class SafeProviderError extends Error {
  constructor(public code: "authentication_error" | "quota_error" | "rate_limited" | "moderation_blocked" | "invalid_input" | "provider_unavailable" | "provider_timeout_unknown" | "malformed_provider_output" | "internal_error") { super(code); }
}
