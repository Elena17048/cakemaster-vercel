"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCorporatePageContent } from "@/lib/api";
import type { CorporatePageContent } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CorporatePage() {
  const { t, i18n } = useTranslation(["corporate", "contact"]);
  const currentLang = i18n.language as "en" | "cs";

  const { data: content, isLoading, isError } =
    useQuery<CorporatePageContent>({
      queryKey: ["corporatePageContent"],
      queryFn: getCorporatePageContent,
    });

  /* ===================== */
  /* LOADING STATE */
  /* ===================== */
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 space-y-16">
        <section className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-5/6" />
          </div>
          <Skeleton className="w-full aspect-square rounded-lg" />
        </section>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <Skeleton className="w-full aspect-square rounded-lg" />
            <Skeleton className="w-full aspect-square rounded-lg" />
          </div>
        </section>
      </div>
    );
  }

  /* ===================== */
  /* ERROR STATE */
  /* ===================== */
  if (isError || !content) {
    return (
      <div className="container mx-auto text-center py-20 text-destructive">
        <p>{t("error")}</p>
      </div>
    );
  }

  const { reviews, galleryImages } = content;

  return (
    <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 space-y-24">

      {/* ===================== */}
      {/* HERO SECTION */}
      {/* ===================== */}
      <section className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-headline font-bold">
            {t("hero.title")}
          </h1>

          <div className="text-base text-muted-foreground leading-relaxed space-y-4">
            <p>{t("hero.description.p1")}</p>
            <p>{t("hero.description.p2")}</p>
            <p>{t("hero.description.p3")}</p>

            <ul className="space-y-2 py-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <span>{t(`hero.description.list.${i}`)}</span>
                </li>
              ))}
            </ul>
            {/* CTA BUTTON */}
            <Button size="lg" className="mt-6" asChild>
  <Link href="/kontakt">
    <Mail className="mr-2 h-5 w-5" />
    Kontaktujte mě
  </Link>
</Button>
          </div>
        </div>

        <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Fcakes%2Ffirms_main.jpg?alt=media"
            alt="Corporate event cakes"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* ===================== */}
      {/* REVIEWS */}
      {/* ===================== */}
      {reviews?.length > 0 && (
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
              {t("reviews.title")}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              {t("reviews.subtitle")}
            </p>
          </div>

          <Carousel opts={{ align: "start", loop: true }} className="max-w-4xl mx-auto">
            <CarouselContent>
              {reviews.map((review) => (
                <CarouselItem key={review.id} className="md:basis-1/2">
                  <Card className="h-full">
                    <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback>
                          {review.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <h3 className="font-semibold">{review.name}</h3>

                      <p className="text-muted-foreground italic">
                        „{review.text[currentLang] || review.text.en}“
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      )}

      {/* ===================== */}
      {/* GALLERY */}
      {/* ===================== */}
      {galleryImages?.length > 0 && (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map(
              (src, i) =>
                src && (
                  <div
                    key={i}
                    className="relative aspect-square rounded-lg overflow-hidden group"
                  >
                    <Image
                      src={src}
                      alt={`Corporate cake ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )
            )}
          </div>
        </section>
      )}
    </div>
  );
}
