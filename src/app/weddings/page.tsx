import { HeroSection } from "./components/HeroSection";
import { ReviewsSection } from "./components/ReviewsSection";
import { GallerySection } from "./components/GallerySection";
import { WeddingCakeSection } from "./components/WeddingCakeSection";
import { SweetBarSection } from "./components/SweetBarSection";
import { SizeSection } from "./components/SizeSection";
import { AllergensSection } from "./components/AllergensSection";
import { DeliverySection } from "./components/DeliverySection";
import { PaymentSection } from "./components/PaymentSection";

import { getWeddingPageContent } from "@/lib/api";

export const revalidate = 3600; // 1 hodina

export default async function WeddingsPage() {
  const data = await getWeddingPageContent();

  if (!data) {
    return null;
  }

  const { reviews, galleryImages } = data;

  return (
    <main className="flex flex-col">

      {/* 1. Svatební dort a sweet bar – BÍLÁ */}
      <section className="bg-white">
        <HeroSection />
      </section>

      {/* 2. Co říkají zákazníci – BÉŽOVÁ */}
      <section className="bg-[#faf7f0] py-6 md:py-8">
        <ReviewsSection reviews={reviews} />
      </section>

      {/* 3. Galerie – BÍLÁ */}
      <section className="bg-white py-6 md:py-8">
        <GallerySection images={galleryImages} />
      </section>

      {/* 4. Svatební dorty – BÉŽOVÁ */}
      <section className="bg-[#faf7f0] py-6 md:py-8">
        <WeddingCakeSection />
      </section>

      {/* 5. Sweet bar – BÍLÁ */}
      <section className="bg-white py-6 md:py-8">
        <SweetBarSection />
      </section>

      {/* 6. Velikost dortu a sweet baru – BÉŽOVÁ */}
      <section className="bg-[#faf7f0] py-6 md:py-8">
        <SizeSection />
      </section>

      {/* 7. Alergeny – BÍLÁ */}
      <section className="bg-white py-6 md:py-8">
        <AllergensSection />
      </section>

      {/* 8. Doprava – BÉŽOVÁ */}
      <section className="bg-[#faf7f0] py-6 md:py-8">
        <DeliverySection />
      </section>

      {/* 9. Platby – BÍLÁ */}
      <section className="bg-white">
        <PaymentSection />
      </section>

    </main>
  );
}
