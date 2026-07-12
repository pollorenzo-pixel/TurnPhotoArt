import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>Built with care in London</p>
      <p>Preview stage — photos stay in this browser tab and are not uploaded by TurnPhotoArt.</p>
      <nav aria-label="Footer"><Link href="/privacy">Privacy</Link><Link href="/terms">Preview Terms</Link></nav>
      <span>© {new Date().getFullYear()} TurnPhotoArt</span>
    </footer>
  );
}
