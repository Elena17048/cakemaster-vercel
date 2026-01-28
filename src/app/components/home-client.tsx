"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomeClient() {
  return (
    <main className="flex flex-col">

      {/* HERO */}
      <section className="relative w-full h-[70vh] flex items-center justify-center">
        <Image
          src="/assets/web.jpg"
          alt="Cake Master"
          fill
          priority
          className="object-cover"
        />

        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-headline font-bold">
            Cake Master
          </h1>

          <p className="mt-4 text-lg max-w-xl mx-auto">
            Luxusní dorty na míru pro výjimečné příležitosti
          </p>

          <Button asChild className="mt-8">
            <Link href="/kontakt">
              Poptat dort <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* KDO STOJÍ ZA ZNAČKOU */}
      <section className="container mx-auto py-20 px-4">
        <h2 className="text-3xl font-headline font-bold mb-6">
          Kdo stojí za značkou Cake Master
        </h2>

        <p className="max-w-3xl text-muted-foreground">
          Jmenuji se Elena Alexeeva a specializuji se na výrobu
          moderních dortů, svatebních dezertů a sladkých stolů
          s důrazem na chuť, detail a estetiku.
        </p>
      </section>

      {/* GALERIE PREVIEW */}
      <section className="container mx-auto py-20 px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-headline font-bold">
            Galerie
          </h2>

          <Button variant="outline" asChild>
            <Link href="/galerie">
              Zobrazit vše
            </Link>
          </Button>
        </div>

        {/* sem si nech své obrázky */}
      </section>

      {/* GOOGLE REVIEWS */}
      <section className="container mx-auto py-20 px-4">
        <div
          className="elfsight-app-XXXXXXXX"
          data-elfsight-app-lazy
        />
      </section>

    </main>
  );
}
