"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
export default function Home() {
  const { t } = useTranslation(["home", "contact"]);

  const { ref: galleryRef, inView: galleryInView } = useInView({
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
                alt="Cake Master Logo"
                width={400}
                height={400}
                className="mb-4"
              />

              <h1 className="text-4xl md:text-6xl font-headline font-bold">
                {t("hero.title", { ns: "home" })}
              </h1>

              <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                {t("hero.subtitle", { ns: "home" })}
              </p>

              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href="/contact">
                    Poptat dort <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Fmain_weeding.jpg?alt=media"
                alt="Hero Cake"
                width={800}
                height={800}
                unoptimized
                className="rounded-full aspect-square object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Image
              src="/images/o-mne.jpg"
              alt="Tvůrkyně značky Cake Master"
              width={500}
              height={600}
              className="rounded-2xl object-cover shadow-xl"
            />

            <div>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
                Kdo stojí za značkou Cake Master
              </h2>

              <p className="text-lg text-muted-foreground mb-4">
                Ahoj, jmenuji se Elena a jsem zakladatelkou, srdcem i rukama
                cukrářské laboratoře Cake Master.
              </p>

              <p className="text-lg text-muted-foreground mb-4">
                Každý kousek je ruční práce s důrazem na chuť, estetiku a detail.
              </p>

              <p className="text-lg text-muted-foreground">
                Každá zakázka je pro mě osobní. Budu se těšit na společné tvoření!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
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
      {/* Image 1 */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-1000 delay-200",
          galleryInView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        )}
      >
        <Link href="/gallery" className="block group">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Fcakes%2Fhero1.jpg?alt=media"
            alt="Bento cake"
            width={600}
            height={400}
            className="w-full max-w-md mx-auto object-cover rounded-xl transition-transform duration-300 ease-in-out group-hover:scale-105"
            data-ai-hint="bento cake"
          />
        </Link>
      </div>

      {/* Image 2 */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-1000 delay-300",
          galleryInView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        )}
      >
        <Link href="/gallery" className="block group">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Fcakes%2Fhero2.jpg?alt=media"
            alt="Colorful birthday cake"
            width={600}
            height={400}
            className="w-full max-w-md mx-auto object-cover rounded-xl transition-transform duration-300 ease-in-out group-hover:scale-105"
            data-ai-hint="birthday cake"
          />
        </Link>
      </div>

      {/* Image 3 */}
      <div
        className={cn(
          "overflow-hidden sm:col-span-2 lg:col-span-1 transition-all duration-1000 delay-500",
          galleryInView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        )}
      >
        <Link href="/gallery" className="block group">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Fcakes%2Fhero3.jpg?alt=media"
            alt="Chocolate cake"
            width={600}
            height={600}
            className="w-full max-w-md mx-auto object-cover rounded-xl transition-transform duration-300 ease-in-out group-hover:scale-105"
            data-ai-hint="chocolate cake"
          />
        </Link>
      </div>
    </div>
  </div>
</section>


          {/* GOOGLE REVIEWS */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-8">
            Co o mně říkají
          </h2>
          <div
            className="elfsight-app-500e74a1-3523-414d-9d2d-aa0b33334f83"
            data-elfsight-app-lazy
          />
        </div>
      </section>
    </div>
  );
}
