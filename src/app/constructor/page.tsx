
"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { FastOrder } from "./fast-order";

export default function FastOrderPage() {
  const { t } = useTranslation('constructor');

  return (
    <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
            <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">{t('title')}</h1>
            </div>
            <div className="relative aspect-square">
                 <Image
                    src="https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Fcakes%2Ftopping2.png?alt=media"
                    alt="A beautiful default custom cake"
                    fill
                    className="object-cover rounded-lg shadow-lg"
                    data-ai-hint="cake macaron blueberry"
                  />
            </div>
            <p className="text-lg text-muted-foreground">
              {t('description')}
            </p>
        </div>
        <div>
          <FastOrder />
        </div>
      </div>
    </div>
  );
}
