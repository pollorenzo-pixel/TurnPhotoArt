import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Privacy", description: "How photos and technical data are handled in the TurnPhotoArt public preview." };

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Plain-language privacy" title="Your photo stays with you." intro="This page explains how the current TurnPhotoArt public preview handles your photo and basic website delivery data.">
      <section><h2>Photos in this preview</h2><p>When you choose a photo, it remains in the current browser tab. Browser-native APIs check and display it, and create the downloadable preview locally. TurnPhotoArt does not intentionally upload your photo, send it to an image-generation provider, or permanently store it in this version.</p><p>Your browser may create a temporary local <code>blob:</code> URL in memory. Replacing the photo, removing it, refreshing the page, or closing the tab clears the active preview state.</p></section>
      <section><h2>What we do not collect</h2><p>This preview has no accounts, payments, analytics platform, database, external image storage, or active AI generation service. We do not extract or intentionally store EXIF metadata from your photo.</p></section>
      <section><h2>Normal website delivery</h2><p>The hosting platform may create technical logs needed to deliver and protect the website, such as request timing, IP address, browser information, or error status. These are separate from the browser-local photo flow. We do not claim that browser memory or ordinary hosting is cryptographically private.</p></section>
      <section><h2>Your responsibility</h2><p>Only upload photos you have the right and permission to use. Avoid using sensitive images if a local preview on the current device is not appropriate for you.</p></section>
      <section><h2>Future changes</h2><p>This privacy explanation must be reviewed and updated before TurnPhotoArt activates real AI generation, accounts, payments, analytics, or remote image processing.</p></section>
    </LegalPage>
  );
}
