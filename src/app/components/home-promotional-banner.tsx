
"use client";

import { useQuery } from '@tanstack/react-query';
import { getBannerSettings } from '@/lib/api';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Gift, Ghost } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Promotion {
  key: 'halloween' | 'christmas';
  title: string;
  subtitle: string;
  buttonText: string;
  imageUrl: string;
  link: string;
  Icon: React.ElementType;
}

export function HomePromotionalBanner() {
  const { t } = useTranslation('home');
  const { data: bannerSettings, isLoading } = useQuery({
    queryKey: ['bannerSettings'],
    queryFn: getBannerSettings,
  });

  const promotions: Promotion[] = [
    {
      key: 'christmas',
      title: t('christmas.title'),
      subtitle: t('christmas.subtitle'),
      buttonText: t('christmas.orderButton.available'),
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Fcm_banner.png?alt=media',
      link: '/christmas',
      Icon: Gift,
    },
    {
      key: 'halloween',
      title: t('halloween.title'),
      subtitle: t('halloween.subtitle'),
      buttonText: t('halloween.orderButton.available'),
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Fhw_banner.png?alt=media',
      link: '/halloween',
      Icon: Ghost,
    },
  ];
  
  // Christmas gets priority if both are active
  const activePromotionKey = bannerSettings?.showChristmasBanner ? 'christmas' : bannerSettings?.showHalloweenBanner ? 'halloween' : null;
  const activePromotion = promotions.find(p => p.key === activePromotionKey);
  
  if (isLoading) {
      return (
          <section className="w-full">
            <div className="container mx-auto px-4 md:px-6 py-8">
                 <Skeleton className="w-full h-80 rounded-lg" />
            </div>
          </section>
      )
  }

  if (!activePromotion) {
    return null;
  }
  
  const { title, subtitle, buttonText, imageUrl, link, Icon } = activePromotion;

  return (
    <section className="w-full">
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="relative h-80 rounded-lg overflow-hidden group">
                <Image
                    src={imageUrl}
                    alt={`${title} promotion banner`}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                    <h2 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                        {title}
                    </h2>
                    <p className="text-lg md:text-xl mt-2 font-body drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] max-w-2xl">
                        {subtitle}
                    </p>
                    <Button asChild size="lg" className="mt-6">
                        <Link href={link}>
                            <Icon className="mr-2 h-5 w-5" />
                            {buttonText}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    </div>
                </div>
            </div>
      </div>
    </section>
  );
}
