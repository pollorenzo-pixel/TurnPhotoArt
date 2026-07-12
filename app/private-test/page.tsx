import type { Metadata } from "next";
import Link from "next/link";
import { PrivateAccessForm } from "@/components/private-access-form";

export const metadata:Metadata={title:"Private Test",robots:{index:false,follow:false}};
export default function PrivateTestPage(){return <main id="main-content" className="private-gate"><Link className="wordmark" href="/"><span aria-hidden="true" className="wordmark-mark">T</span>TurnPhotoArt</Link><div className="gate-card"><p className="section-kicker">Invite-only foundation</p><h1>Private artwork testing</h1><p>This space is for invited friends, family and the TurnPhotoArt owner. Access does not create a public account.</p><PrivateAccessForm/><small>Never place an access code in a URL or share it publicly.</small></div><Link className="back-link" href="/">← Back to the public site</Link></main>}
