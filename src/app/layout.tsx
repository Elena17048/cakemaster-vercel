"use client";

import "./globals.css";
import { LayoutClient } from "@/app/components/layout-client";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-body antialiased">
        {/* Elfsight Google Reviews – načte se jednou pro celý web */}
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
