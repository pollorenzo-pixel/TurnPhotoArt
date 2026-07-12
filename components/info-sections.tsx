import { Download, ImagePlus, WandSparkles } from "lucide-react";

export function InfoSections() {
  return (
    <>
      <section className="how-section" aria-labelledby="how-title">
        <div className="section-intro">
          <span className="section-kicker">Simple by design</span>
          <h2 id="how-title">From camera roll to keepsake</h2>
        </div>
        <ol className="steps">
          <li><span className="step-number">01</span><ImagePlus aria-hidden="true" /><h3>Upload your photo</h3><p>Choose one favourite from your device.</p></li>
          <li><span className="step-number">02</span><WandSparkles aria-hidden="true" /><h3>We create the playful look</h3><p>One signature style, thoughtfully made.</p></li>
          <li><span className="step-number">03</span><Download aria-hidden="true" /><h3>Download and share</h3><p>Save your artwork and make someone smile.</p></li>
        </ol>
      </section>
      <section className="future-section" aria-labelledby="future-title">
        <div>
          <span className="section-kicker light">Made for the moments you keep</span>
          <h2 id="future-title">Small memories,<br />made frame-worthy.</h2>
          <p>TurnPhotoArt is growing into a playful way to celebrate the people, pets and little things you love.</p>
        </div>
        <ul className="future-list" aria-label="Future artwork ideas">
          <li><span>Pet portraits</span><b aria-hidden="true">01</b></li>
          <li><span>Family moments</span><b aria-hidden="true">02</b></li>
          <li><span>Favourite meals</span><b aria-hidden="true">03</b></li>
          <li><span>Gift artwork</span><b aria-hidden="true">04</b></li>
        </ul>
      </section>
    </>
  );
}
