import type { Metadata } from "next";
import { PRODUCT } from "@/lib/turn-photo-art";
import "./globals.css";

export const metadata: Metadata = {
  title: `${PRODUCT.name} — Playful artwork from your favourite photos`,
  description: PRODUCT.description,
  openGraph: {
    title: `${PRODUCT.name} — Playful artwork from your favourite photos`,
    description: PRODUCT.description,
    type: "website",
  },
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
