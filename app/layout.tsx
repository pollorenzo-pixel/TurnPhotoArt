import type { Metadata, Viewport } from "next";
import { IS_INDEXING_ENABLED, SITE_URL, absoluteSiteUrl } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "TurnPhotoArt",
  title: {
    default: "TurnPhotoArt — Turn photos into playful artwork",
    template: "%s — TurnPhotoArt",
  },
  description: "Upload a favourite photo and explore a colourful, handmade-style artwork preview directly in your browser.",
  metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
  alternates: SITE_URL ? { canonical: SITE_URL } : undefined,
  robots: { index: IS_INDEXING_ENABLED, follow: IS_INDEXING_ENABLED },
  openGraph: {
    title: "TurnPhotoArt — Turn photos into playful artwork",
    description: "Upload a favourite photo and explore a colourful, handmade-style artwork preview directly in your browser.",
    type: "website",
    siteName: "TurnPhotoArt",
    url: SITE_URL ?? undefined,
    images: SITE_URL ? [{ url: absoluteSiteUrl("/social-preview")!, width: 1200, height: 630, alt: "TurnPhotoArt public preview" }] : undefined,
  },
  twitter: {
    card: SITE_URL ? "summary_large_image" : "summary",
    title: "TurnPhotoArt — Turn photos into playful artwork",
    description: "Upload a favourite photo and explore a colourful, handmade-style artwork preview directly in your browser.",
    images: SITE_URL ? [absoluteSiteUrl("/social-preview")!] : undefined,
  },
  icons: {
    icon: [{ url: "/turnphotoart-mark.svg", type: "image/svg+xml" }, { url: "/icon.png", type: "image/png" }],
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f0e3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
