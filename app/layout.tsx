import type { Metadata } from "next";
import { Noto_Sans_Khmer } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "sonner";
import { generateHomepageMetadata } from "@/lib/seo/metadata";

const notoSansKhmer = Noto_Sans_Khmer({
  subsets: ["khmer", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-khmer",
  display: "swap",
});

// SEO-optimized metadata for electronics marketplace
// Target keywords: buy/sell iphone/ipad/macbook/laptop cambodia/phnom penh
export const metadata: Metadata = {
  ...generateHomepageMetadata(),
  authors: [{ name: "SabaySell" }],
  manifest: "/manifest.json",
};

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: "#3b82f6",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="km">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${notoSansKhmer.variable} antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
