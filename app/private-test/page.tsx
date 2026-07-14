import type { Metadata } from "next";
import Link from "next/link";
import { PrivateAccessForm } from "@/components/private-access-form";

export const metadata:Metadata={title:"Private Test",robots:{index:false,follow:false}};
export default function PrivateTestPage(){return <main id="main-content" className="private-gate"><div className="paper-noise" aria-hidden="true"/><Link className="wordmark gate-wordmark" href="/"><span aria-hidden="true" className="wordmark-mark">T</span>TurnPhotoArt</Link><div className="gate-decor" aria-hidden="true"><i/><i/><i/><i/></div><div className="gate-card"><p className="section-kicker">Invite-only creative studio</p><h1>Make something unmistakably yours.</h1><p>Enter your private access code to turn one favourite photo into up to three expressive artwork versions.</p><PrivateAccessForm/><small>Your access code stays in this secure form. Never place it in a URL or share it publicly.</small></div><Link className="back-link" href="/">← Back to the public site</Link></main>}
