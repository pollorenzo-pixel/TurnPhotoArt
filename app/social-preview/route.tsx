import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", background: "#f7f0e3", color: "#1d1d1b", fontFamily: "Arial, sans-serif", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 800 }}><div style={{ width: 54, height: 54, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 15, background: "#ef553f", color: "white", transform: "rotate(-3deg)" }}>T</div>TurnPhotoArt</div>
        <div style={{ border: "2px solid #1d1d1b", borderRadius: 999, padding: "12px 20px", fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>PUBLIC PREVIEW</div>
      </div>
      <div style={{ display: "flex", maxWidth: 950, fontSize: 78, lineHeight: 0.98, letterSpacing: -4, fontWeight: 800 }}>Turn photos into <span style={{ color: "#ef553f", marginLeft: 18 }}>playful artwork</span></div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 24 }}><span>Private artwork generation testing is underway.</span><div style={{ display: "flex", alignItems: "center", gap: 18 }}><span style={{ width: 44, height: 10, borderRadius: 10, background: "#234fbb", transform: "rotate(-18deg)" }} /><span style={{ width: 34, height: 34, borderRadius: 99, background: "#f2c84b" }} /><span style={{ width: 40, height: 40, border: "7px solid #ef553f", borderRadius: 12, transform: "rotate(12deg)" }} /></div></div>
    </div>,
    { width: 1200, height: 630 },
  );
}
