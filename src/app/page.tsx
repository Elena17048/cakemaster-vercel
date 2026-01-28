"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/use-in-view";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { CustomCakeForm } from "@/app/components/custom-cake-form";
import { OrderQuestionnaireModal } from "@/app/components/order-questionnaire-modal";
export const runtime = "nodejs";

export default function Home() {
  const lang = "cs";

  const { ref: galleryRef, inView: galleryInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [isCustomCakeFormOpen, setCustomCakeFormOpen] = useState(false);
  const [isQuestionnaireOpen, setQuestionnaireOpen] = useState(false);

  const openCustomCakeForm = () => {
    setQuestionnaireOpen(false);
    setCustomCakeFormOpen(true);
  };

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
                height={200}
                className="mb-6 mx-auto md:mx-0"
              />

              <h1 className="text-4xl md:text-6xl font-headline font-bold">
                Dorty, které mají charakter
              </h1>

              <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl">
                Originální zakázkové dorty na míru – chuť, design a příběh v jednom.
              </p>

              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href="/contact">
                    Poptat dort
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Fmain_weeding.jpg?alt=media"
                alt="Svatební dort Cake Master"
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
              alt="Elena – Cake Master"
              width={500}
              height={400}
              className="rounded-2xl object-cover shadow-xl mx-auto"
            />

            <div>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
                Kdo stojí za značkou Cake Master
              </h2>

              <p className="text-muted-foreground mb-4">
                Jmenuji se Elena a stojím za cukrářskou laboratoří Cake Master.
                Každý dort je pro mě osobní projekt – kombinace chuti, estetiky
                a příběhu.
              </p>

              <p className="text-muted-foreground mb-4">
                Miluji experimenty, netradiční zakázky a precizní ruční práci.
                Pracuji výhradně se surovinami, kterým věřím.
              </p>

              <p className="text-muted-foreground">
                Mým cílem je vytvořit dort, který se stane přirozeným středem
                oslavy a zanechá silný dojem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section ref={galleryRef} className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div
            className={cn(
              "text-center transition-all duration-1000",
              galleryInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            )}
          >
            <Link href="/cakes">
              <h2 className="text-3xl md:text-4xl font-headline font-bold hover:underline">
                Galerie dortů
              </h2>
            </Link>

            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Výběr zakázkových dortů z mé tvorby.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["hero1.jpg", "hero2.jpg", "hero3.jpg"].map((img, index) => (
              <Link
                key={index}
                href="/cakes"
                className={cn(
                  "block group transition-all duration-1000",
                  galleryInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                )}
              >
                <Image
                  src={`https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Fcakes%2F${img}?alt=media`}
                  alt="Dort Cake Master"
                  width={600}
                  height={400}
                  className="w-full max-w-md mx-auto object-cover rounded-xl transition-transform group-hover:scale-105"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MODALS */}
      <OrderQuestionnaireModal
        isOpen={isQuestionnaireOpen}
        onClose={() => setQuestionnaireOpen(false)}
        onSelectCustom={openCustomCakeForm}
      />

      <Dialog open={isCustomCakeFormOpen} onOpenChange={setCustomCakeFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">
              Zakázkový dort
            </DialogTitle>
            <DialogDescription>
              Vyplňte krátký formulář a ozvu se vám s návrhem.
            </DialogDescription>
          </DialogHeader>
          <CustomCakeForm onClose={() => setCustomCakeFormOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* REVIEWS */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-3xl md:text-4xl font-headline font-bold mb-8">
            Co o mně říkají zákazníci
          </p>

          <div
            className="elfsight-app-500e74a1-3523-414d-9d2d-aa0b33334f83"
            data-elfsight-app-lazy
          />
        </div>
      </section>
    </div>
  );
}
