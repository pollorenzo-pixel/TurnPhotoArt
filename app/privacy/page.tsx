import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Privacy", description: "How photos and technical data are handled in the TurnPhotoArt public preview." };

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Plain-language privacy" title="How private testing handles photos." intro="TurnPhotoArt has a public disabled mode and a separate invite-only AI testing mode. This page explains both.">
      <section><h2>Public mode</h2><p>The public website does not offer an image upload or generation flow. No photo is selected, uploaded or processed when you browse the public landing pages.</p></section>
      <section><h2>Invite-only AI test mode</h2><p>When an invited tester creates artwork, the selected photo is sent to the TurnPhotoArt backend and then to OpenAI to create the requested illustration. OpenAI processing is subject to OpenAI’s applicable API data terms. TurnPhotoArt does not claim zero provider retention.</p><p>TurnPhotoArt does not persist raw reference-image bytes or generated-image bytes in its database. It stores an image fingerprint and minimal operational metadata such as dimensions, selected style, prompt version, status, and conservative usage records. Complete personality text is not stored; only its length and cryptographic hash may be retained.</p></section>
      <section><h2>Results in the current tab</h2><p>The browser keeps the selected reference and completed results in temporary memory using local <code>blob:</code> URLs. Testers should download every result they want to keep. Refreshing or closing the tab may remove the selected photo and generated results.</p></section>
      <section><h2>What is not enabled</h2><p>There are no public accounts, payments, analytics platform, public image storage, email delivery, or automated marketing-consent workflow. Private test access is temporary and is not a customer account.</p></section>
      <section><h2>Normal website delivery</h2><p>The hosting platform may create technical logs needed to deliver and protect the website, such as request timing, IP address, browser information, or error status. These are separate from the browser-local photo flow. We do not claim that browser memory or ordinary hosting is cryptographically private.</p></section>
      <section><h2>Your responsibility</h2><p>Only upload photos you have the right and permission to use. Avoid sensitive images if backend and provider processing is not appropriate for you.</p></section>
      <section><h2>Future changes</h2><p>Legal review and updated privacy terms are required before public commercial AI processing, payments, customer accounts, analytics, fulfilment, or image storage are activated.</p></section>
    </LegalPage>
  );
}
