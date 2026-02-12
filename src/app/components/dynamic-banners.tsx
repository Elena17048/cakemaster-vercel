import { getBannerSettings } from "@/lib/api";
import { HalloweenBanner } from "@/app/components/halloween-banner";
import { ChristmasBanner } from "@/app/components/christmas-banner";

type Props = {
  pathname: string;
};

export async function DynamicBanners({ pathname }: Props) {
  // Načtení banner nastavení serverově (NE klientsky)
  const bannerSettings = await getBannerSettings();

  // Na homepage malé bannery nezobrazujeme
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
