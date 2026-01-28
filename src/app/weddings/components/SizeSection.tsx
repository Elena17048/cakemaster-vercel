"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SizeSection() {
  return (
    <section className="max-w-3xl mx-auto text-center space-y-10">

      {/* NADPIS */}
      <div className="space-y-3">
        <h2 className="text-3xl md:text-4xl font-headline font-bold">
          Velikost dortu a sweet baru
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Znáte počet hostů, ale nemáte úplně jasno v tom, kolik sladkého budete potřebovat?
          <br />
          Ráda vám s tím poradím.
        </p>
      </div>

      {/* SVATEBNÍ DORT */}
      <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground">
          Svatební dort
        </h3>

        <p>
          Velikost svatebního dortu vždy vychází z počtu svatebních hostů.
          Z vlastní zkušenosti ale doporučuji počítat s&nbsp;
          <strong className="text-foreground"> o 5–10&nbsp;% menším počtem porcí</strong>,
          než je počet pozvaných hostů.
        </p>

        <p>
          Ať chceme nebo ne, na svatbu se bohužel málokdy dostaví úplně všichni.
          Dort tak zbytečně nepřijde nazmar.
        </p>

        <ul className="space-y-1 font-medium text-foreground">
          <li>55 hostů → cca 50 porcí</li>
          <li>100 hostů → cca 90 porcí</li>
        </ul>

        <p>
          Svatební dort se navíc krájí na menší kousky než dorty narozeninové,
          protože na svatbě bývá sladkého pohoštění více.
        </p>
      </div>

      {/* SWEET BAR */}
      <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground">
          Sweet bar
        </h3>

        <p>
          Sweet bar je skvělé řešení – minimum starostí pro vás a maximální pohodlí pro hosty.
          Ti si sami vybírají to, na co mají chuť, a kdykoliv se ke sladkému mohou vrátit.
          A věřte, že se často vrací opakovaně.
        </p>

        <div>
          <p className="font-medium text-foreground mb-2">
            Obvykle doporučuji počítat:
          </p>
          <ul className="space-y-1">
            <li>2 dezerty na osobu</li>
            <li>2–3 makronky na osobu</li>
          </ul>
        </div>

        <div>
          <p className="font-medium text-foreground mb-2">
            Pokud se rozhodnete makronky do sweet baru nezařadit:
          </p>
          <ul>
            <li>3 dezerty na osobu</li>
          </ul>
        </div>
      </div>

      {/* ZÁVĚR + CTA */}
      <div className="space-y-4">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground">
          Nejste si jistí?
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          Pokud si i tak s počty nebudete jistí, žádný strach.
          Kontaktujte mě a vše spolu v klidu dořešíme.
        </p>

        <div className="pt-2">
          <Button asChild size="lg">
            <Link href="/contact">
              Kontaktovat mě
            </Link>
          </Button>
        </div>
      </div>

    </section>
  );
}
