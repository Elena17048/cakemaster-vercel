"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function WeddingCakeSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-12">

          {/* TEXT */}
          <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mt-0">
              Svatební dorty
            </h2>

            <p className="text-muted-foreground text-lg">
              Každý svatební dort je jedinečný – stejně jako váš příběh.
              Ráda s vámi navrhnu dort na míru, který ozdobí vaši svatbu.
            </p>

            <Button asChild size="lg">
              <Link href="/svatebni-dorty">
                Více ke svatebním dortům
              </Link>
            </Button>
          </div>

          {/* OBRÁZEK */}
          <Link
            href="/svatebni-dorty"
            className="relative block max-w-md mx-auto w-full"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md">
              <Image
                src="/images/weddings/wedding-cake.jpg"
                alt="Svatební dort na míru"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
