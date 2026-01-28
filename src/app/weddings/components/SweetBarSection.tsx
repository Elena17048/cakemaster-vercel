import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SweetBarSection() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* OBRÁZEK */}
          <Link
            href="/zakusky"
            className="relative block max-w-md mx-auto w-full md:order-1"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md">
              <Image
                src="/images/weddings/sweet-bar.jpg"
                alt="Sweet bar a zákusky"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </Link>

          {/* TEXT */}
          <div className="space-y-6 md:order-2">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
              Sweet bar
            </h2>

            <p className="text-muted-foreground text-lg">
              Dezertní stůl a zákusky sladěné s vaší svatbou – chutě,
              barvy i celkový styl. Ideální doplněk ke svatebnímu dortu
              nebo samostatná sladká tečka.
            </p>

            <Button asChild size="lg">
              <Link href="/zakusky">
                Více o zákuscích
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
