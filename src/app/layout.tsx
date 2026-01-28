import "./globals.css";
import { LayoutClient } from "@/app/components/layout-client";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Cakemaster",
  description:
    "Design your dream cake at cakemaster.cz. We specialize in custom cakes, baking courses, and edible paper printing.",
};
export const runtime = "nodejs";

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