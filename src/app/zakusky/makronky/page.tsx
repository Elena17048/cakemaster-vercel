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

export default function MakronkyPage() {
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
              Makronky
            </h1>

            <p className="text-muted-foreground leading-snug">
              Jemné mandlové skořápky plněné krémy různých chutí.
              Elegantní francouzská klasika, která je nejen vizuálně
              působivá, ale i chuťově vyvážená.
            </p>

            <p className="text-muted-foreground leading-snug">
              Dělám je v dvou velikostech: <strong> S </strong> (šířka 3 cm) a <strong>M </strong>(šířka 5 cm).
            </p>
          </div>

          {/* PŘÍCHUTĚ */}
          <div className="space-y-2">
            <h2 className="font-semibold">
              Přichutě
            </h2>

            <ul className="space-y-1 text-muted-foreground">
              {[
                "Vanilka s karamelem",
                "Vanilka s jahodami",
                "Čokoláda s karamelem",
                "Čokoláda s malinami",
                "Čokoláda s pomerančem",
                "Tropik s tmavou čokoládou, mango a maraquiou",
                "Kokos",
                "Pistácie s višněmi",
                "Citron",
              ].map((flavour) => (
                <li key={flavour} className="flex items-start gap-2">
                  <span className="text-primary text-sm mt-1">▸</span>
                  <span>{flavour}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CENA */}
          <div className="space-y-1 text-muted-foreground">
            <p>
              <strong>Minimální odběr:</strong> 20 ks / druh
            </p>
            <p>
              <strong>Cena:</strong> velikost S od 35 Kč / ks, velikost M od 55 kč
            </p>
          </div>

          {/* SKLADOVÁNÍ */}
          <div className="space-y-2 pt-4">
            <h2 className="text-2xl font-headline font-bold">
              Skladování a péče
            </h2>

            <p className="text-muted-foreground leading-snug">
              Makronky skladujte v uzavřené krabičce bez přístupu vzduchu,
              ideálně v chladu.
            </p>

            <p className="text-muted-foreground leading-snug">
              Doporučuji uchovávat při teplotě do{" "}
              <strong>8&nbsp;°C</strong> a zkonzumovat do{" "}
              <strong>48 hodin</strong>.
            </p>
          </div>

          {/* ALERGENY */}
          <div className="space-y-2">
            <h2 className="text-2xl font-headline font-bold">
              Alergeny
            </h2>

            <p className="text-muted-foreground">
              Vejce (3), mléko (7), skořápkové plody (8 – mandle).
            </p>
          </div>

          {/* UPOZORNĚNÍ */}
          <div>
            <p className="text-muted-foreground italic text-sm leading-snug">
              Za nadstandardní změny, náročnější zdobení nebo speciální
              barevné kombinace si vyhrazuji právo úpravy ceny dle
              složitosti zakázky.
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
                  "/images/zakusky/makronky/1.jpg",
                  "/images/zakusky/makronky/2.jpg",
                  "/images/zakusky/makronky/3.jpeg",
                ].map((src, i) => (
                  <CarouselItem key={i}>
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md">
                      <Image
                        src={src}
                        alt={`Makronky ${i + 1}`}
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
