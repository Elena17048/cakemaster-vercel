import "./globals.css";
import Script from "next/script";
import { LayoutClient } from "@/app/components/layout-client";
import ReactQueryProvider from "@/app/providers/react-query-provider";
import I18nProvider from "@/app/providers/i18n-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-body antialiased">
        <Script
          src="https://elfsightcdn.com/platform.js"
          strategy="lazyOnload"
        />

        <ReactQueryProvider>
          <I18nProvider>
            <LayoutClient>
              {children}
            </LayoutClient>
          </I18nProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
