export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ status: "ok", mode: "local-preview" }, { headers: { "Cache-Control": "no-store" } });
}
