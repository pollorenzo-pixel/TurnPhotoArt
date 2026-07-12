import Link from "next/link";

export default function NotFound() {
  return <main id="main-content" className="state-page"><div className="state-mark" aria-hidden="true">✦</div><p className="section-kicker">404 · Out of frame</p><h1>This page wandered outside the frame.</h1><p>The playful photo studio is still right where you left it.</p><Link className="button button-primary" href="/#studio">Back to the studio</Link></main>;
}
