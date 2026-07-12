import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Preview Terms", description: "Plain-language terms for trying the TurnPhotoArt public preview." };

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Preview terms" title="A preview, made for exploring." intro="These simple terms describe the free browser-local preview available today. They are not final commercial terms for a paid product.">
      <section><h2>What the preview is</h2><p>TurnPhotoArt currently offers an illustrative local artwork effect. It is not final AI-generated artwork, a printing service, or a paid product. Real AI generation and commercial terms will be introduced separately if those services launch.</p></section>
      <section><h2>Your photos</h2><p>You must own or have permission to use any photo you select. Do not use the preview with unlawful, abusive, infringing, or harmful material.</p></section>
      <section><h2>Preview output</h2><p>Results may look different across browsers, screens, and devices. Downloaded previews are provided for exploration and do not include a guarantee that they are suitable for commercial printing, professional production, or any particular purpose.</p></section>
      <section><h2>Availability and changes</h2><p>This is an early preview. Features, styling, limits, and availability may change, pause, or stop without notice while the product is developed.</p></section>
      <section><h2>Before a commercial launch</h2><p>TurnPhotoArt will need separate legal review and updated terms before enabling payments, real AI processing, fulfilment, accounts, or other commercial services.</p></section>
    </LegalPage>
  );
}
