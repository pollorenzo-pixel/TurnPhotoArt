import "server-only";
import { operatingMode } from "@/lib/server/config";
import type { ImageProvider } from "@/lib/server/providers/types";

export async function getImageProvider(): Promise<ImageProvider> {
  if (operatingMode.provider === "fake") return (await import("@/lib/server/providers/fake")).fakeProvider;
  return (await import("@/lib/server/providers/openai")).openAiProvider;
}
