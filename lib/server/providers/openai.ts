import "server-only";
import type { ImageEditParamsNonStreaming } from "openai/resources/images";
import type { ImageProvider } from "@/lib/server/providers/types";
import { SafeProviderError } from "@/lib/server/providers/types";
import { outputSizeFor } from "@/lib/server/output-size";

export const openAiProvider: ImageProvider = {
  name: "openai",
  async generate(input) {
    try {
      const [{ default: OpenAI, toFile }] = await Promise.all([import("openai")]);
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 0, timeout: 180_000 });
      const request: ImageEditParamsNonStreaming & { moderation: "auto"; partial_images: 0 } = {
        model: "gpt-image-2",
        image: await toFile(input.reference, "reference-image", { type: input.mimeType }),
        prompt: input.prompt,
        moderation: "auto",
        output_format: "png",
        size: outputSizeFor(input.width, input.height),
        quality: input.quality,
        n: 1,
        stream: false,
        partial_images: 0,
      };
      const response = await client.images.edit(request);
      const encoded = response.data?.[0]?.b64_json;
      if (!encoded) throw new SafeProviderError("malformed_provider_output");
      return { bytes: Buffer.from(encoded, "base64") };
    } catch (error) {
      if (error instanceof SafeProviderError) throw error;
      const status = typeof error === "object" && error && "status" in error ? Number(error.status) : 0;
      const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
      if (code === "moderation_blocked") throw new SafeProviderError("moderation_blocked");
      if (status === 401) throw new SafeProviderError("authentication_error");
      if (status === 429) throw new SafeProviderError("rate_limited");
      if (status === 400) throw new SafeProviderError("invalid_input");
      if (code.includes("timeout") || status === 408) throw new SafeProviderError("provider_timeout_unknown");
      if (status >= 500) throw new SafeProviderError("provider_unavailable");
      throw new SafeProviderError("internal_error");
    }
  },
};
