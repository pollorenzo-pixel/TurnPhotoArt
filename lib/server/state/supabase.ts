import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { ArtworkSetRecord, ArtworkStateStore, GenerationRecord } from "@/lib/server/state/types";

const client = () => createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
const mapSet = (row: Record<string, unknown>): ArtworkSetRecord => ({ id: String(row.id), tokenHash: String(row.access_token_hash), referenceSha256: String(row.reference_sha256), mimeType: String(row.source_mime_type), width: Number(row.source_width), height: Number(row.source_height), successfulCount: Number(row.successful_generation_count), status: String(row.status) as ArtworkSetRecord["status"], expiresAt: String(row.expires_at) });
const mapGeneration = (row: Record<string, unknown>): GenerationRecord => ({ id: String(row.id), setId: String(row.artwork_set_id), sequence: Number(row.sequence_number), styleId: String(row.style_id) as GenerationRecord["styleId"], status: String(row.status) as GenerationRecord["status"], idempotencyHash: String(row.idempotency_key_hash), sessionHash: String(row.session_hash), reservationUnits: Number(row.reservation_cost_units), safeErrorCode: row.safe_error_code ? String(row.safe_error_code) : null });

export const supabaseStore: ArtworkStateStore = {
  async createSet(input) {
    const { data, error } = await client().from("artwork_sets").insert({ access_token_hash: input.tokenHash, reference_sha256: input.referenceSha256, source_mime_type: input.mimeType, source_width: input.width, source_height: input.height, expires_at: input.expiresAt }).select().single();
    if (error || !data) throw new Error("database_unavailable"); return mapSet(data);
  },
  async findSet(tokenHash) { const { data, error } = await client().from("artwork_sets").select().eq("access_token_hash", tokenHash).maybeSingle(); if (error) throw new Error("database_unavailable"); return data ? mapSet(data) : null; },
  async reserve(input) {
    const { data, error } = await client().rpc("reserve_artwork_generation", { p_access_token_hash: input.tokenHash, p_idempotency_key_hash: input.idempotencyHash, p_session_hash: input.sessionHash, p_ip_hash: input.ipHash, p_style_id: input.styleId, p_personality_length: input.personalityLength, p_personality_hash: input.personalityHash, p_prompt_version: input.promptVersion, p_provider_model: input.model, p_quality: input.quality, p_size: input.size, p_daily_request_limit: input.dailyRequestLimit, p_hourly_ip_limit: input.hourlyIpLimit, p_global_concurrency_limit: input.globalConcurrencyLimit, p_daily_cost_limit_units: input.dailyCostLimitUnits, p_reservation_units: input.reservationUnits });
    if (error || !data) throw new Error(error?.message?.startsWith("TPA_") ? error.message.slice(4).toLowerCase() : "database_unavailable");
    const result = data as { kind: "reserved" | "existing"; generation: Record<string, unknown>; artwork_set: Record<string, unknown> };
    return { kind: result.kind, generation: mapGeneration(result.generation), set: mapSet(result.artwork_set) };
  },
  async markProcessing(id) { const { error } = await client().from("generations").update({ status: "processing" }).eq("id", id).eq("status", "reserved"); if (error) throw new Error("database_unavailable"); },
  async settle(id, status, safeErrorCode = null, provider) { const { data, error } = await client().rpc("settle_artwork_generation", { p_generation_id: id, p_status: status, p_safe_error_code: safeErrorCode, p_provider_request_id: provider?.requestId ?? null, p_provider_usage_summary: provider?.usage ?? null }); if (error || !data) throw new Error("database_unavailable"); return mapSet((data as { artwork_set: Record<string, unknown> }).artwork_set); },
};
