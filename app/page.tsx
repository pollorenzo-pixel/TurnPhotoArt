import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PUBLIC_HOUSE_STYLES } from "@/lib/server/house-styles";

export default function HomePage() {
  return <div id="top"><div className="paper-noise" aria-hidden="true"/><div className="page-shell"><SiteHeader/><main id="main-content">
    <section className="phase2-hero" aria-labelledby="hero-title"><p className="hero-eyebrow"><span/> Artwork for the moments you keep</p><h1 id="hero-title">Turn one favourite photo into <em>three playful artwork versions.</em></h1><p>Choose a bold graphic look or a soft storybook finish, then add a little more personality.</p><div className="private-status"><span aria-hidden="true"/> <div><b>Private testing underway</b><small>Generation is invite-only and unavailable to public visitors.</small></div></div><Link className="button button-secondary" href="/private-test">Private test entry</Link></section>
    <section className="house-styles" aria-labelledby="styles-title"><div className="section-intro"><span className="section-kicker">Two TurnPhotoArt house styles</span><h2 id="styles-title">One photo, two ways to feel.</h2><p>Each style keeps the original subject recognisable while giving the moment its own handcrafted character.</p></div><div className="style-public-grid">{PUBLIC_HOUSE_STYLES.map((style,index)=><article key={style.id} className={`public-style-card style-${index+1}`}><span>0{index+1}</span><h3>{style.name}</h3><p>{style.description}</p><div aria-hidden="true" className="style-marks"><i/><i/><i/></div></article>)}</div></section>
    <section className="showcase-placeholder" aria-labelledby="showcase-title"><p className="section-kicker">Friends & family showcase</p><h2 id="showcase-title">Real examples, shared only with permission.</h2><p>Approved before-and-after artwork will appear here later. No sample images are fabricated, and private-test images are never published automatically.</p><div className="empty-frames" aria-hidden="true"><span/><span/><span/></div></section>
    <section className="future-flow" aria-labelledby="future-flow-title"><h2 id="future-flow-title">How TurnPhotoArt will work</h2><ol><li><b>01</b><span>Upload one favourite photo</span></li><li><b>02</b><span>Choose a house style and optional details</span></li><li><b>03</b><span>Create and download three artwork versions</span></li></ol><p>No public generation or payment is available yet.</p></section>
  </main><SiteFooter/></div></div>;
}
