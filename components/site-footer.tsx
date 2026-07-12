export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>Built with care in London</p>
      <p>Preview stage — photos stay in your browser and are never uploaded.</p>
      <span>© {new Date().getFullYear()} TurnPhotoArt</span>
    </footer>
  );
}
