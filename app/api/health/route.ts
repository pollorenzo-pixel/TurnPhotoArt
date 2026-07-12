import { isPrivateFoundationEnabled } from "@/lib/server/config";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ status: "ok", mode: isPrivateFoundationEnabled() ? "private-test" : "public-disabled" }, { headers: { "Cache-Control": "no-store" } });
}
