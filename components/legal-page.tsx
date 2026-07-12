import Link from "next/link";
import type { ReactNode } from "react";

type LegalPageProps = { eyebrow: string; title: string; intro: string; children: ReactNode };

export function LegalPage({ eyebrow, title, intro, children }: LegalPageProps) {
  return (
    <div className="legal-shell">
      <header className="legal-header">
        <Link className="wordmark" href="/" aria-label="TurnPhotoArt home"><span aria-hidden="true" className="wordmark-mark">T</span>TurnPhotoArt</Link>
        <span className="preview-badge">Public Preview</span>
      </header>
      <main id="main-content" className="legal-main">
        <Link className="back-link" href="/#studio">← Back to the studio</Link>
        <p className="section-kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="legal-intro">{intro}</p>
        <p className="last-updated">Last updated 12 July 2026</p>
        <div className="legal-content">{children}</div>
      </main>
      <footer className="legal-footer"><span>Built with care in London</span><Link href="/privacy">Privacy</Link><Link href="/terms">Preview Terms</Link></footer>
    </div>
  );
}
