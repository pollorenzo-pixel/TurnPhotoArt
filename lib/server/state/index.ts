import "server-only";
import type { ArtworkStateStore } from "@/lib/server/state/types";

export async function getStateStore(): Promise<ArtworkStateStore> {
  if (process.env.TURNPHOTOART_STATE_PROVIDER === "memory" && process.env.TURNPHOTOART_IMAGE_PROVIDER !== "openai") return (await import("@/lib/server/state/memory")).memoryStore;
  return (await import("@/lib/server/state/supabase")).supabaseStore;
}
