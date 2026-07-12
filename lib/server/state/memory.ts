import { randomUUID } from "node:crypto";
import type { ArtworkSetRecord, ArtworkStateStore, GenerationRecord, ReserveInput, ReserveResult } from "@/lib/server/state/types";

type MemoryState = { sets: Map<string, ArtworkSetRecord>; generations: Map<string, GenerationRecord>; createdAt: Map<string, number>; ipHashes: Map<string, string> };
const globalState = globalThis as typeof globalThis & { __tpaMemoryState?: MemoryState };
const state = globalState.__tpaMemoryState ??= { sets: new Map(), generations: new Map(), createdAt: new Map(), ipHashes: new Map() };

export function resetMemoryState() { state.sets.clear(); state.generations.clear(); state.createdAt.clear(); state.ipHashes.clear(); }

export const memoryStore: ArtworkStateStore = {
  async createSet(input) {
    const record: ArtworkSetRecord = { ...input, id: randomUUID(), successfulCount: 0, status: "active" };
    state.sets.set(record.tokenHash, record);
    return { ...record };
  },
  async findSet(tokenHash) { const record = state.sets.get(tokenHash); return record ? { ...record } : null; },
  async reserve(input: ReserveInput): Promise<ReserveResult> {
    const set = state.sets.get(input.tokenHash);
    if (!set) throw new Error("artwork_set_invalid");
    const existing = [...state.generations.values()].find((g) => g.setId === set.id && g.idempotencyHash === input.idempotencyHash);
    if (existing) return { kind: "existing", generation: { ...existing }, set: { ...set } };
    if (set.status !== "active" || new Date(set.expiresAt).getTime() <= Date.now()) { if (set.successfulCount >= 3) throw new Error("generation_limit_reached"); throw new Error("artwork_set_invalid"); }
    if (set.successfulCount >= 3) throw new Error("generation_limit_reached");
    const all = [...state.generations.values()];
    const active = all.filter((g) => g.status === "reserved" || g.status === "processing");
    if (all.some((g) => g.setId === set.id && ["reserved","processing","unknown"].includes(g.status))) throw new Error("set_generation_active");
    if (all.some((g) => g.sessionHash === input.sessionHash && ["reserved","processing","unknown"].includes(g.status))) throw new Error("session_generation_active");
    if (active.length >= input.globalConcurrencyLimit) throw new Error("global_concurrency_reached");
    const now = Date.now(); const dayAgo = now - 86_400_000; const hourAgo = now - 3_600_000;
    const recent = [...state.generations.values()].filter((g) => (state.createdAt.get(g.id) ?? 0) >= dayAgo);
    if (recent.length >= input.dailyRequestLimit) throw new Error("daily_request_limit");
    if (recent.filter((g) => (state.createdAt.get(g.id) ?? 0) >= hourAgo && state.ipHashes.get(g.id) === input.ipHash).length >= input.hourlyIpLimit) throw new Error("hourly_ip_limit");
    const heldUnits = recent.filter((g) => ["reserved", "processing", "unknown", "succeeded"].includes(g.status)).reduce((sum, g) => sum + g.reservationUnits, 0);
    if (heldUnits + input.reservationUnits > input.dailyCostLimitUnits) throw new Error("daily_cost_limit");
    const generation: GenerationRecord = { id: randomUUID(), setId: set.id, sequence: set.successfulCount + 1, styleId: input.styleId, status: "reserved", idempotencyHash: input.idempotencyHash, sessionHash: input.sessionHash, reservationUnits: input.reservationUnits };
    state.generations.set(generation.id, generation); state.createdAt.set(generation.id, now); state.ipHashes.set(generation.id, input.ipHash);
    return { kind: "reserved", generation: { ...generation }, set: { ...set } };
  },
  async markProcessing(id) { const item = state.generations.get(id); if (!item || item.status !== "reserved") throw new Error("generation_state_invalid"); item.status = "processing"; },
  async settle(id, status, safeErrorCode = null) {
    const item = state.generations.get(id); if (!item) throw new Error("generation_not_found");
    if (item.status === "succeeded") return { ...[...state.sets.values()].find((s) => s.id === item.setId)! };
    if (item.status !== "reserved" && item.status !== "processing") throw new Error("generation_state_invalid");
    item.status = status; item.safeErrorCode = safeErrorCode;
    const set = [...state.sets.values()].find((s) => s.id === item.setId)!;
    if (status === "succeeded") { set.successfulCount += 1; if (set.successfulCount >= 3) set.status = "complete"; }
    return { ...set };
  },
};
