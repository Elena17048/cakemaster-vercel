"use client";

import { useTranslation } from "react-i18next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import type { WeddingPageContent } from "@/lib/types";

type Props = {
  reviews: WeddingPageContent["reviews"];
};

export function ReviewsSection({ reviews }: Props) {
  const { t, i18n } = useTranslation("weddings");
  const currentLang = i18n.language as "cs" | "en";

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="pt-0">
      <div className="space-y-6">

        {/* 🔹 TITULEK + PODTITULEK */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-headline font-bold">
            {t("reviews.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("reviews.subtitle")}
          </p>
        </div>

        {/* 🔹 CAROUSEL */}
        <Carousel
          opts={{ align: "start", loop: true }}
          className="max-w-6xl mx-auto"
        >
          <CarouselContent>
            {reviews.map((review) => (
              <CarouselItem
                key={review.id}
                className="basis-full sm:basis-1/2 lg:basis-1/3 px-3"
              >
                <Card className="h-full bg-white shadow-sm border">
                  <CardContent className="p-6 text-center flex flex-col gap-4">
                    {/* JMÉNO */}
                    <p className="font-semibold text-sm">
                      {review.name}
                    </p>

                    {/* TEXT */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                    „{review.text?.[currentLang] ?? review.text?.en ?? ""}“

                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

      </div>
    </section>
  );
}
