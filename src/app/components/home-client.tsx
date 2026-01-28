"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CakeSlice, Printer, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

export default function HomeClient() {
  const { t } = useTranslation(["home", "contact"]);

  const { ref: galleryRef, inView: galleryInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { ref: servicesRef, inView: servicesInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="w-full py-12 md:py-20 lg:py-24 bg-card overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Flogo_transparent.svg?alt=media"
                alt="Cake Master"
                width={220}
                height={120}
                className="mb-6"
              />

              <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight">
                {t("hero.title", { ns: "home" })}
              </h1>

              <p className="mt-4 max-w-xl text-lg md:text-xl text-muted-foreground">
                {t("hero.subtitle", { ns: "home" })}
              </p>

              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    {t("hero.cta", { ns: "home" })}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Fmain_weeding.jpg?alt=media"
                alt="Cake Master – wedding cake"
                width={700}
                height={700}
                unoptimized
                className="rounded-full aspect-square object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* GALERIE */}
      <section
        ref={galleryRef}
        className="w-full py-16 md:py-24 bg-background"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div
            className={cn(
              "text-center transition-all duration-1000",
              galleryInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            )}
          >
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
              {t("gallery.title", { ns: "home" })}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              {t("gallery.subtitle", { ns: "home" })}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["hero1", "hero2", "hero3"].map((img, i) => (
              <div
                key={img}
                className={cn(
                  "overflow-hidden rounded-lg transition-all duration-1000",
                  galleryInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                )}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <Image
                  src={`https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Fcakes%2F${img}.jpg?alt=media`}
                  alt="Cake Master gallery"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="/cakes">
                {t("gallery.cta", { ns: "home" })}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SLUŽBY */}
      <section ref={servicesRef} className="w-full py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-center text-3xl md:text-4xl font-headline font-bold">
            {t("services.title", { ns: "home" })}
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-2 text-center">
            <div>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <CakeSlice />
              </div>
              <h3 className="text-2xl font-headline font-semibold">
                {t("services.customDesigns.title", { ns: "home" })}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {t("services.customDesigns.description", { ns: "home" })}
              </p>
            </div>

            <div>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Printer />
              </div>
              <h3 className="text-2xl font-headline font-semibold">
                {t("services.ediblePrinting.title", { ns: "home" })}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {t("services.ediblePrinting.description", { ns: "home" })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-background text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">
            {t("cta.title", { ns: "contact" })}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            {t("cta.subtitle", { ns: "contact" })}
          </p>

          <Button size="lg" className="mt-8" asChild>
            <Link href="/contact">
              <Mail className="mr-2 h-5 w-5" />
              {t("cta.button", { ns: "contact" })}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
