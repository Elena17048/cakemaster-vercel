"use client";

import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getBannerSettings } from "../../lib/api";
import { HalloweenBanner } from "@/app/components/halloween-banner";
import { ChristmasBanner } from "@/app/components/christmas-banner";

export function DynamicBanners() {
  const pathname = usePathname();

  const {
    data: bannerSettings,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bannerSettings"],
    queryFn: getBannerSettings,
    staleTime: 5 * 60 * 1000,
  });

  // ⛑️ Layout se NESMÍ rozbít
  if (isLoading || isError) {
    return null;
  }

  if (pathname === "/") {
    return null;
  }

  const showHalloweenBanner =
    bannerSettings?.showHalloweenBanner && pathname !== "/halloween";

  const showChristmasBanner =
    bannerSettings?.showChristmasBanner && pathname !== "/christmas";

  return (
    <>
      {showHalloweenBanner && <HalloweenBanner />}
      {showChristmasBanner && <ChristmasBanner />}
    </>
  );
}
