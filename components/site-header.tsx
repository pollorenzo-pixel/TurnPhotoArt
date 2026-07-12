import { PRODUCT } from "@/lib/turn-photo-art";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="TurnPhotoArt home">
        <span aria-hidden="true" className="wordmark-mark">T</span>
        {PRODUCT.name}
      </a>
      <div className="header-labels">
        <span className="studio-label">{PRODUCT.eyebrow}</span>
        <span className="preview-badge">Public Preview</span>
      </div>
    </header>
  );
}
