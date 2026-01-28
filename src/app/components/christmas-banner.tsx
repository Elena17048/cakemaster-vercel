
"use client";

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Gift, ArrowRight } from 'lucide-react';

export function ChristmasBanner() {
  const { t } = useTranslation('home');

  return (
    <Link href="/christmas">
      <div className="group bg-red-600 text-white hover:bg-red-700 transition-colors duration-300 w-full h-10 flex items-center justify-center text-sm font-medium cursor-pointer">
        <div className="flex items-center gap-3">
          <Gift className="h-5 w-5 animate-pulse" />
          <span className="hidden sm:inline">{t('banner.text')}</span>
          <span className="sm:hidden">{t('banner.textShort')}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
