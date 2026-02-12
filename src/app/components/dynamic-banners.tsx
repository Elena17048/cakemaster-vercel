"use client";

import { HalloweenBanner } from "@/app/components/halloween-banner";
import { ChristmasBanner } from "@/app/components/christmas-banner";

type Props = {
  pathname: string;
  showHalloweenBanner: boolean;
  showChristmasBanner: boolean;
};

export function DynamicBanners({
  pathname,
  showHalloweenBanner,
  showChristmasBanner,
}: Props) {
  if (pathname === "/") {
    return null;
  }

  const showHalloween =
    showHalloweenBanner && pathname !== "/halloween";

  const showChristmas =
    showChristmasBanner && pathname !== "/christmas";

  return (
    <>
      {showHalloween && <HalloweenBanner />}
      {showChristmas && <ChristmasBanner />}
    </>
  );
}
