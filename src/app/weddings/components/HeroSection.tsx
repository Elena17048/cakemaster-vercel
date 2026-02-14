"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

export function HeroSection() {
  const { t } = useTranslation("weddings");

  return (
    <div className="container mx-auto px-4 md:px-6 py-16 md:py-20">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* TEXT */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">
            {t("hero.title")}
          </h1>

          <p className="text-muted-foreground leading-relaxed">
            Ráda pro vás připravím svatební dort i sladký bar na míru – přesně
            podle vašich přání, stylu a představ.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            Postarám se o každý detail, aby byl váš svatební den výjimečný,
            nezapomenutelný a plný sladkých momentů. Vy si tak můžete užít svatbu
            bez starostí a s jistotou, že je vše v těch správných rukou.
          </p>
        </div>

        {/* OBRÁZEK */}
        <div className="w-full max-w-md mx-auto">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Fcakes%2Fwedding_main.jpg?alt=media"
            alt="Elegantní svatební dort"
            width={600}
            height={800}
            className="rounded-xl shadow-lg object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
