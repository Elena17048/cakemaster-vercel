"use client";

import { HeroSection } from "./components/HeroSection";
import { ReviewsSection } from "./components/ReviewsSection";
import { GallerySection } from "./components/GallerySection";
import { WeddingCakeSection } from "./components/WeddingCakeSection";
import { SweetBarSection } from "./components/SweetBarSection";
import { SizeSection } from "./components/SizeSection";
import { AllergensSection } from "./components/AllergensSection";
import { DeliverySection } from "./components/DeliverySection";
import { PaymentSection } from "./components/PaymentSection";

import { useQuery } from "@tanstack/react-query";
import { getWeddingPageContent } from "@/lib/api";
import type { WeddingPageContent } from "@/lib/types";

export default function WeddingsPage() {
  const { data, isError } = useQuery<WeddingPageContent>({
    queryKey: ["weddingPageContent"],
    queryFn: getWeddingPageContent,

    // 🚀 OKAMŽITÝ RENDER
    initialData: {
      reviews: [],
      galleryImages: [],
    },

    // ⛔ Firebase offline = žádné zdržování
    retry: false,

    // 🧠 cache
    staleTime: 10 * 60 * 1000, // 10 minut
  });

  if (isError && process.env.NODE_ENV === "development") {
    console.warn("Wedding page content unavailable");
  }

  const { reviews = [], galleryImages = [] } = data ?? {};

  return (
    <main className="flex flex-col">

      {/* 1. Svatební dort a sweet bar – BÍLÁ */}
      <section className="bg-white py-6 md:py-8">
        <HeroSection />
      </section>

      {/* 2. Co říkají zákazníci – BÉŽOVÁ */}
      {reviews.length > 0 && (
        <section className="bg-[#faf7f0] py-6 md:py-8">
          <ReviewsSection reviews={reviews} />
        </section>
      )}

      {/* 3. Galerie – BÍLÁ */}
      {galleryImages.length > 0 && (
        <section className="bg-white py-6 md:py-8">
          <GallerySection images={galleryImages} />
        </section>
      )}

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
      <section className="bg-white py-6 md:py-8">
        <PaymentSection />
      </section>

    </main>
  );
}
