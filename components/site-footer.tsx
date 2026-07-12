import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>Built with care in London</p>
      <p>Public generation is unavailable. Private testing is invite-only.</p>
      <nav aria-label="Footer"><Link href="/privacy">Privacy</Link><Link href="/terms">Preview Terms</Link></nav>
      <span>© {new Date().getFullYear()} TurnPhotoArt</span>
    </footer>
  );
}
