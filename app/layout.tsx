import type { Metadata } from "next";
import { Noto_Sans_Khmer } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "sonner";

const notoSansKhmer = Noto_Sans_Khmer({
  subsets: ["khmer", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-khmer",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SabaySell - ទីផ្សារលក់ទំនិញអនឡាញកម្ពុជា",
  description: "ទីផ្សារលក់ទំនិញអនឡាញឥតគិតថ្លៃសម្រាប់កម្ពុជា - Free online marketplace for Cambodia",
  keywords: ["cambodia", "marketplace", "auction", "buy", "sell", "khmer", "កម្ពុជា", "ទីផ្សារ"],
  authors: [{ name: "SabaySell" }],
  openGraph: {
    title: "SabaySell - ទីផ្សារលក់ទំនិញអនឡាញកម្ពុជា",
    description: "ទីផ្សារលក់ទំនិញអនឡាញឥតគិតថ្លៃសម្រាប់កម្ពុជា",
    type: "website",
    locale: "km_KH",
    alternateLocale: "en_US",
  },
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
