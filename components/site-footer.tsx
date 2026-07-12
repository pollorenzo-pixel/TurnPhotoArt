export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>Built with care in London</p>
      <p>Preview stage — photos stay in this browser tab and are not uploaded by TurnPhotoArt.</p>
      <span>© {new Date().getFullYear()} TurnPhotoArt</span>
    </footer>
  );
}
