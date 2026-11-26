import type { Metadata, Viewport } from "next";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/700-italic.css";
import "@fontsource/fraunces/900.css";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import "./globals.css";
import { SITE_URL, SITE_NAME, X_HANDLE, cardPath } from "@/lib/site";

const description = "First letter of your name + second digit of your age = your Thanksgiving name. Spin the reels and post your card to X.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description,
  openGraph: { title: SITE_NAME, description, images: [{ url: cardPath(), width: 1200, height: 630 }], type: "website" },
  twitter: { card: "summary_large_image", title: SITE_NAME, description, creator: X_HANDLE, images: [cardPath()] },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#F4EBDD" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
