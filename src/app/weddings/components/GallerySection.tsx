"use client";

import { useTranslation } from "react-i18next";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Props = {
  images: string[];
};

export function GallerySection({ images }: Props) {
  const { t } = useTranslation("weddings");

  if (!images || images.length === 0) return null;

  return (
    <section className="py-16 space-y-8">
      {/* Nadpis */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-headline font-bold">
          {t("gallery.title")}
        </h2>
        <p className="text-muted-foreground">
          {t("gallery.subtitle")}
        </p>
      </div>

      <Carousel
        plugins={[
          Autoplay({
            delay: 3500,
            stopOnInteraction: false,
          }),
        ]}
        opts={{ loop: true }}
        className="max-w-6xl mx-auto"
      >
        <CarouselContent>
          {images.map((src, i) => (
            <CarouselItem
              key={i}
              className="basis-full sm:basis-1/2 lg:basis-1/3 px-2"
            >
              <div className="relative overflow-hidden rounded-xl bg-background">
                <img
                  src={src}
                  alt={`Svatební galerie ${i + 1}`}
                  className="w-full h-auto max-h-[420px] mx-auto object-contain"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
