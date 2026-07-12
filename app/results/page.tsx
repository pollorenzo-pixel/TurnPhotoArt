import Link from "next/link";

export default function LegacyResultsPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <section style={{ maxWidth: 560, textAlign: "center" }}>
        <p className="section-kicker">TurnPhotoArt Phase 1</p>
        <h1 style={{ fontSize: "clamp(42px, 8vw, 72px)", letterSpacing: "-.06em", lineHeight: 1, margin: "20px 0" }}>The studio now lives on one page.</h1>
        <p style={{ font: "18px/1.6 Georgia, serif", color: "#5e584e", marginBottom: 28 }}>Results appear beside the upload flow, so your photo stays in your browser from start to finish.</p>
        <Link className="button button-primary" href="/#studio">Open the photo studio</Link>
      </section>
    </main>
  );
}
