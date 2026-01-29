'use client';

import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/lib/api';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CameraOff } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function CakeGalleryPage() {
  const { t, i18n } = useTranslation('cakes');
  const currentLang = i18n.language as 'en' | 'cs';

  const { data: categories, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,

    // 🚀 okamžitý render
    initialData: [],

    // ⛔ Firebase offline = žádné čekání
    retry: false,

    // 🧠 cache
    staleTime: 10 * 60 * 1000,
  });

  if (isError && process.env.NODE_ENV === 'development') {
    console.warn('Categories unavailable');
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      <div className="mt-12">
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="flex flex-col overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <Link
                  href={`/cakes/${category.id}`}
                  className="flex flex-col flex-grow"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={
                        category.imageUrl ||
                        'https://placehold.co/600x400/EFEFEF/777777?text=No+Image'
                      }
                      alt={
                        category.name[currentLang] || category.name.en
                      }
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  <div className="flex flex-col flex-grow p-6">
                    <CardHeader className="p-0">
                      <CardTitle className="text-2xl font-headline font-bold capitalize">
                        {category.name[currentLang] || category.name.en}
                      </CardTitle>

                      <CardDescription className="pt-2 min-h-[40px]">
                        {category.description?.[currentLang] ||
                          category.description?.en ||
                          ''}
                      </CardDescription>
                    </CardHeader>

                    <CardFooter className="p-0 mt-auto pt-4">
                      <Button variant="link" className="p-0 h-auto">
                        {t('viewAll')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <CameraOff className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-2xl font-semibold font-headline">
              {t('noCategories')}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
