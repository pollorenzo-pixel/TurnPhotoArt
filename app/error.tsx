"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main id="main-content" className="state-page" role="alert"><div className="state-mark coral-state" aria-hidden="true">!</div><p className="section-kicker">A small studio wobble</p><h1>Something didn’t land quite right.</h1><p>Your photo has not been sent anywhere. Try this page again, or return to the studio for a fresh start.</p><div className="state-actions"><button className="button button-primary" type="button" onClick={reset}>Try again</button><Link className="button button-secondary" href="/">Return to the studio</Link></div></main>;
}
