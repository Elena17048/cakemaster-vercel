"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

export default function WeddingCakesPage() {
  // ✅ HOOK JE UVNITŘ KOMPONENTY
  const autoplay = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  return (
    <div className="flex flex-col">

      {/* ÚVOD */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-headline font-bold mb-6">
              Svatební dorty
            </h1>
            <p className="text-lg text-muted-foreground">
              Chcete klasický několikapatrový bílý dort, nebo raději několik menších?
              Každá svatba je jiná – a já se ráda přizpůsobím vaší představě.
            </p>
            <p className="text-lg text-muted-foreground">
              Zvládnu minimalistickou eleganci i odvážnější řešení na míru.
            </p>
          </div>

          <Image
            src="/images/weddings/hero.jpg"
            alt="Svatební dort Cake Master"
            width={500}
            height={500}
            className="rounded-2xl object-cover shadow-xl"
          />
        </div>
      </section>

      {/* VELIKOST A CENA */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
            Velikost a cena
          </h2>

          <p className="text-lg text-muted-foreground mb-6">
          U svatebních dortů počítám porci přibližně <strong>100 g na osobu</strong>, a to s ohledem na přítomnost dalších sladkostí.
            Na rozdíl od běžných zakázek (kde se počítá s 200 g na osobu) jsou následující údaje upravené právě s ohledem na tuto svatební specifiku.
          </p>

          <ul className="space-y-4 text-lg">
            <li>
              <strong>Jednopatrové dorty</strong><br />
              Ø 15 cm – 1,5 kg (15 porcí): <strong>1 950 Kč</strong><br />
              Ø 18 cm – 2,5 kg (25 porcí): <strong>3 250 Kč</strong>
            </li>

            <li>
              <strong>Vícepatrové dorty</strong><br />
              30–40 porcí: <strong>3 900 – 5 200 Kč</strong><br />
              45–80 porcí: <strong>5 500 – 10 000 Kč</strong><br />
              Nad 80 porcí: individuální nabídka
            </li>
          </ul>

          <p className="mt-6 text-muted-foreground">
          Cena je orientační a zahrnuje sestavený a obmazaný dort se základním zdobením čerstvým ovocem. Jakékoliv další požadavky na zdobení cenu ovlivňují – finální částku lze stanovit až po upřesnění vzhledu dortu.
          </p>

          <p className="mt-4 text-muted-foreground"> Každý dort lze připravit také <strong>bezlepkově</strong> za příplatek <strong>10 %</strong>. </p>
        </div>
      </section>

      {/* PŘÍCHUTĚ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4 text-center">
            Vyberte příchuť
          </h2>

          <p className="text-center text-muted-foreground mb-8">
            U vícepatrových dortů může mít každé patro jinou příchuť.
          </p>

          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[autoplay.current]}
            className="max-w-5xl mx-auto"
          >
            <CarouselContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <CarouselItem
                  key={num}
                  className="basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-2">
                    <Image
                      src={`/images/flavours/${num}.jpg`}
                      alt={`Příchuť svatebního dortu ${num}`}
                      width={600}
                      height={600}
                      className="rounded-xl object-cover shadow-md"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
            Máte dotazy nebo potřebujete poradit?
          </h2>

          <Button asChild size="lg">
            <Link href="/contact">
              Kontaktujte mě <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
