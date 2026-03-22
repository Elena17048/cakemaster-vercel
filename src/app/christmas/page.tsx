
"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChristmasOrderModal } from "./order-modal";
import { Gift } from "lucide-react";

const TOTAL_CUPCAKES = 100;

export default function ChristmasPage() {
  const { t } = useTranslation('christmas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderedCount, setOrderedCount] = useState(8); // Starting with some orders for visuals

  const remaining = TOTAL_CUPCAKES - orderedCount;
  const progress = (orderedCount / TOTAL_CUPCAKES) * 100;

  const handleOrderSuccess = (quantity: number) => {
    setOrderedCount(prev => prev + quantity);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-background min-h-screen">
        <div className="relative h-96">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Fcm_banner.png?alt=media"
            alt="Festive Christmas banner"
            fill
            className="object-cover"
            data-ai-hint="christmas banner"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <h1 className="text-5xl md:text-7xl font-headline font-bold text-red-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                {t('title')}
              </h1>
              <p className="text-xl md:text-2xl mt-2 font-body drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <h2 className="text-3xl font-headline font-semibold">{t('description.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('description.p1')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('description.p2')}
              </p>
              <div className="pt-4">
                 <Button 
                    size="lg" 
                    onClick={() => setIsModalOpen(true)} 
                    disabled={remaining <= 0}
                    className="bg-red-600 hover:bg-red-700 text-white shadow-lg transform hover:scale-105 transition-transform duration-300"
                >
                    <Gift className="mr-2 h-5 w-5" />
                    {remaining > 0 ? t('orderButton.available') : t('orderButton.soldOut')}
                </Button>
              </div>
            </div>
            <div className="p-8 bg-card rounded-lg shadow-xl border-2 border-red-500/50">
                <h3 className="text-2xl font-headline text-center mb-4">{t('stock.title')}</h3>
                <div className="text-center mb-2">
                    <span className="text-4xl font-bold text-primary">{remaining}</span>
                    <span className="text-muted-foreground"> / {TOTAL_CUPCAKES} {t('stock.remaining')}</span>
                </div>
                <Progress value={progress} className="[&>*]:bg-red-500" />
                <p className="text-center text-sm text-muted-foreground mt-4">
                    {t('stock.note')}
                </p>
            </div>
          </div>
        </div>
      </div>
      <ChristmasOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOrderSuccess={handleOrderSuccess}
        remaining={remaining}
      />
    </>
  );
}
