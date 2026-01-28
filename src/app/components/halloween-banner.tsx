
"use client";

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Ghost, ArrowRight } from 'lucide-react';

export function HalloweenBanner() {
  const { t } = useTranslation('halloween');

  return (
    <Link href="/halloween">
      <div className="group bg-orange-600 text-white hover:bg-orange-700 transition-colors duration-300 w-full h-10 flex items-center justify-center text-sm font-medium cursor-pointer">
        <div className="flex items-center gap-3">
          <Ghost className="h-5 w-5 animate-bounce" />
          <span className="hidden sm:inline">{t('banner.text')}</span>
          <span className="sm:hidden">{t('banner.textShort')}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
