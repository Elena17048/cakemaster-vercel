import "./globals.css";
import Script from "next/script";
import { LayoutClient } from "@/app/components/layout-client";
import { getBannerSettings } from "@/lib/api";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔥 Server-side načtení banner nastavení
  const bannerSettings = await getBannerSettings();

  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-body antialiased">
        <Script
          src="https://elfsightcdn.com/platform.js"
          strategy="lazyOnload"
        />

        <LayoutClient bannerSettings={bannerSettings}>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
