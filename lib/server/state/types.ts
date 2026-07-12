import type { HouseStyleId } from "@/lib/server/house-styles";

export type ArtworkSetRecord = { id: string; tokenHash: string; referenceSha256: string; mimeType: string; width: number; height: number; successfulCount: number; status: "active" | "expired" | "complete"; expiresAt: string };
export type GenerationStatus = "reserved" | "processing" | "succeeded" | "failed" | "blocked" | "unknown";
export type GenerationRecord = { id: string; setId: string; sequence: number; styleId: HouseStyleId; status: GenerationStatus; idempotencyHash: string; sessionHash: string; reservationUnits: number; safeErrorCode?: string | null };
export type ReserveInput = { tokenHash: string; idempotencyHash: string; sessionHash: string; ipHash: string; styleId: HouseStyleId; personalityLength: number; personalityHash: string | null; promptVersion: string; model: string; quality: string; size: string; dailyRequestLimit: number; hourlyIpLimit: number; globalConcurrencyLimit: number; dailyCostLimitUnits: number; reservationUnits: number };
export type ReserveResult = { kind: "reserved" | "existing"; generation: GenerationRecord; set: ArtworkSetRecord };

export interface ArtworkStateStore {
  createSet(input: Omit<ArtworkSetRecord, "id" | "successfulCount" | "status">): Promise<ArtworkSetRecord>;
  findSet(tokenHash: string): Promise<ArtworkSetRecord | null>;
  reserve(input: ReserveInput): Promise<ReserveResult>;
  markProcessing(generationId: string): Promise<void>;
  settle(generationId: string, status: Exclude<GenerationStatus, "reserved" | "processing">, safeErrorCode?: string | null, provider?: { requestId?: string; usage?: { inputTokens?: number; outputTokens?: number } }): Promise<ArtworkSetRecord>;
}
