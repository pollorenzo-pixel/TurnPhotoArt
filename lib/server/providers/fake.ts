import sharp from "sharp";
import type { ImageProvider } from "@/lib/server/providers/types";
import { SafeProviderError } from "@/lib/server/providers/types";
import { outputSizeFor } from "@/lib/server/output-size";

const dimensions = { "1024x1024": [1024, 1024], "1024x1536": [1024, 1536], "1536x1024": [1536, 1024] } as const;

export const fakeProvider: ImageProvider = {
  name: "fake",
  async generate(input) {
    if (input.simulation === "moderation") throw new SafeProviderError("moderation_blocked");
    if (input.simulation === "failure") throw new SafeProviderError("provider_unavailable");
    if (input.simulation === "unknown") throw new SafeProviderError("provider_timeout_unknown");
    if (input.simulation === "malformed") return { bytes: Buffer.from("not an image") };
    const [width, height] = dimensions[outputSizeFor(input.width, input.height)];
    const background = input.styleId === "bold-playful" ? "#ef553f" : "#a9c6e8";
    const accent = input.styleId === "bold-playful" ? "#f2c84b" : "#f7d9df";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${background}"/><circle cx="${width * .22}" cy="${height * .25}" r="${Math.min(width,height)*.13}" fill="${accent}"/><path d="M${width*.15} ${height*.72} Q${width*.5} ${height*.45} ${width*.85} ${height*.72}" fill="none" stroke="#234fbb" stroke-width="28" stroke-linecap="round"/><rect x="${width*.08}" y="${height*.82}" width="${width*.84}" height="${height*.1}" rx="20" fill="#1d1d1b"/><text x="50%" y="${height*.88}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${Math.max(28,width/28)}" font-weight="700" fill="white">FAKE PROVIDER — NOT AI ARTWORK</text></svg>`;
    return { bytes: await sharp(Buffer.from(svg)).png().toBuffer(), requestId: "fake-request" };
  },
};
