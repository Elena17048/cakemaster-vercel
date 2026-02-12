import "./globals.css";
import Script from "next/script";
import { LayoutClient } from "@/app/components/layout-client";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-body antialiased bg-white">
        <Script
          src="https://elfsightcdn.com/platform.js"
          strategy="lazyOnload"
        />

        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
