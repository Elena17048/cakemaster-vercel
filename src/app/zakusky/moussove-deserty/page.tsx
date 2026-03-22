"use client";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function MoussoveDesertyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">

      <section className="grid md:grid-cols-2 gap-10 items-start">

        {/* ===================== */}
        {/* TEXT – VLEVO */}
        {/* ===================== */}
        <div className="space-y-8 text-left max-w-xl">

          {/* HLAVIČKA */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">
              Moussové deserty
            </h1>

            <p className="text-muted-foreground leading-snug">
              Jemné a lehké dezerty s nadýchanou strukturou a výraznou chutí.
              Moussové dezerty působí elegantně, moderně a jsou ideální volbou
              pro ty, kteří preferují méně sladké zákusky.
            </p>

            <p className="text-muted-foreground leading-snug">
              Mohou být připraveny v různých chuťových kombinacích – ovocné,
              čokoládové i oříškové – a snadno se přizpůsobí stylu vaší svatby.
              Skvěle se hodí jak do sweet baru, tak jako servírovaný dezert.
            </p>
          </div>

          {/* PŘÍCHUTĚ */}
          <div className="space-y-2">
            <h2 className="font-semibold">
              Příchutě
            </h2>

            <ul className="space-y-1 text-muted-foreground">
              {[
                "Yogurt s citronem",
                "Víšeň a boby Tonka",
                "Maliny se smetanou",
                "Marcipán a jahody",
                "Bazalka a mango",
                "Piňa Colada",
                "Čokoládá s mango a maraquiou",
                "Čokoládá s malinami",
                "Čokoládá s višní",
              ].map((variant) => (
                <li key={variant} className="flex items-start gap-2">
                  <span className="text-primary text-sm mt-1">▸</span>
                  <span>{variant}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CENA */}
          <div className="space-y-1 text-muted-foreground">
            <p>
              <strong>Minimální odběr:</strong> 10 ks / druh
            </p>
            <p>
              <strong>Cena:</strong> od 90 Kč / ks
            </p>
          </div>

          {/* SKLADOVÁNÍ */}
          <div className="space-y-2 pt-4">
            <h2 className="text-2xl font-headline font-bold">
              Skladování a péče
            </h2>

            <p className="text-muted-foreground leading-snug">
              Dezerty skladujte v původní krabici nebo plastové nádobě bez
              přístupu vzduchu.
            </p>

            <p className="text-muted-foreground leading-snug">
              Uchovávejte v chladu do{" "}
              <strong>8&nbsp;°C</strong> a nevystavujte přímému slunečnímu světlu.
            </p>
          </div>

          {/* ALERGENY */}
          <div className="space-y-2">
            <h2 className="text-2xl font-headline font-bold">
              Alergeny
            </h2>

            <p className="text-muted-foreground">
              Lepek (1), vejce (3), mléko (7), skořápkové plody (8) – dle zvolené varianty.
            </p>
          </div>

          {/* UPOZORNĚNÍ */}
          <div>
            <p className="text-muted-foreground italic text-sm leading-snug">
              Za nadstandardní změny, nákladnější nebo časově náročnější
              zdobení si vyhrazuji právo navýšit cenu dle složitosti zakázky.
            </p>
          </div>

        </div>

        {/* ===================== */}
        {/* CAROUSEL – VPRAVO */}
        {/* ===================== */}
        <div className="w-full flex justify-start md:justify-center">
          <div className="w-full max-w-xs md:max-w-sm">

            <Carousel
              opts={{ loop: true }}
              plugins={[
                Autoplay({
                  delay: 3500,
                  stopOnInteraction: false,
                }),
              ]}
            >
              <CarouselContent>
                {[
                  "/images/zakusky/moussove-deserty/1.jpg",
                  "/images/zakusky/moussove-deserty/2.jpg",
                  "/images/zakusky/moussove-deserty/3.jpg",
                ].map((src, i) => (
                  <CarouselItem key={i}>
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md">
                      <Image
                        src={src}
                        alt={`Moussové deserty ${i + 1}`}
                        fill
                        className="object-cover"
                        priority={i === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>

            <p className="mt-2 text-left text-xs text-muted-foreground">
              
            </p>
          </div>
        </div>

      </section>
    </div>
  );
}
