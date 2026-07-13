import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Preview Terms", description: "Plain-language terms for trying the TurnPhotoArt public preview." };

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Private-test terms" title="An invite-only artwork test." intro="These simple terms describe trusted friends-and-family testing. They are not final paid-customer terms.">
      <section><h2>What the test includes</h2><p>No payment is collected and no service-level guarantee is offered. Each reference photo can produce up to three successfully completed, downloadable artwork versions. Confirmed failures and safety blocks do not consume a successful version.</p></section>
      <section><h2>Your photos and conduct</h2><p>You must own or have permission to use every uploaded image. Do not upload unlawful, abusive, infringing, or harmful material. Safety systems may block a request or output.</p></section>
      <section><h2>Results and availability</h2><p>Generated results can vary. Download every result you want to keep before leaving: refreshing or closing the tab may remove it. Results have no commercial-print guarantee. The test may pause, change, or be unavailable without notice.</p></section>
      <section><h2>Reference and version rules</h2><p>Use a new reference photo when you want to create a separate group of artwork versions. Style and optional personality details may change between successful versions.</p></section>
      <section><h2>Marketing permission</h2><p>Participating does not give TurnPhotoArt permission to publish an original or generated image. Any showcase use requires separate, explicit written consent and manual review.</p></section>
      <section><h2>Before a commercial launch</h2><p>Separate legal review and new commercial terms are required before payments, public customer processing, accounts, printing, storage, or fulfilment.</p></section>
    </LegalPage>
  );
}
