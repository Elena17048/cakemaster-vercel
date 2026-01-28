"use client";

import { useTranslation } from "react-i18next";
import { Phone, Clock, Instagram, Facebook } from "lucide-react";
import Link from "next/link";

export function TopBar() {
    const { t } = useTranslation('common');

    return (
        <div className="bg-primary text-primary-foreground">
            <div className="container mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-6 text-sm">
                    <a href={`tel:${t('contact.info.phone').replace(/\s/g, '')}`} className="flex items-center gap-2 hover:underline">
                        <Phone className="h-4 w-4" />
                        <span className="hidden md:inline">{t('contact.info.phone')}</span>
                    </a>
                    <div className="hidden sm:flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="hidden lg:inline">{t('contact.hours.label')}:</span>
                        <span>{t('contact.hours.time')}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="https://www.instagram.com/cakemaster.prague/" target="_blank" aria-label="Instagram">
                       <Instagram className="h-5 w-5 hover:opacity-80 transition-opacity" />
                    </Link>
                     <Link href="https://www.facebook.com/CakeMasterPrague/" target="_blank" aria-label="Facebook">
                       <Facebook className="h-5 w-5 hover:opacity-80 transition-opacity" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
