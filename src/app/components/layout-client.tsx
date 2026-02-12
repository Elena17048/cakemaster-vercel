"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { AppProviders } from "@/app/components/app-providers";
import { DynamicBanners } from "@/app/components/dynamic-banners";
import { TopBar } from "@/app/components/top-bar";
import type { BannerSettings } from "@/lib/types";

export function LayoutClient({
  children,
  bannerSettings,
}: {
  children: React.ReactNode;
  bannerSettings: BannerSettings;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <AppProviders>
      <div className="flex min-h-screen flex-col">
        {false && <TopBar />}
        <Header />

        <DynamicBanners
          pathname={pathname}
          showHalloweenBanner={bannerSettings.showHalloweenBanner}
          showChristmasBanner={bannerSettings.showChristmasBanner}
        />

        <main className="flex-1">{children}</main>
        <Footer />
      </div>

      <Toaster />

      {/* Messenger button */}
      <a
        href="https://m.me/CakeMasterPrague"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat na Messengeru"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          backgroundColor: "#0084FF",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          zIndex: 9999,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="white"
        >
          <path d="M12 2C6.486 2 2 6.023 2 10.984c0 2.82 1.46 5.35 3.75 7.01V22l3.55-1.95c.87.24 1.79.37 2.7.37 5.514 0 10-4.023 10-8.984S17.514 2 12 2zm1.04 11.98-2.55-2.72-4.98 2.72 5.48-5.82 2.51 2.72 5.02-2.72-5.5 5.82z" />
        </svg>
      </a>
    </AppProviders>
  );
}
