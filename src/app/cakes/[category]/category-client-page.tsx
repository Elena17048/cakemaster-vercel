'use client';

import { useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getGalleryImages, getCategories } from '@/lib/api';
import type { PopulatedGalleryImage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2, CameraOff, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageDetailModal } from '@/app/components/image-detail-modal';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { QueryDocumentSnapshot } from 'firebase/firestore';

export default function CategoryClientPage({ categoryId }: { categoryId: string }) {
  const { t, i18n } = useTranslation('cakes');
  const currentLang = i18n.language as 'en' | 'cs';
  const [selectedImage, setSelectedImage] = useState<PopulatedGalleryImage | null>(null);

  /* Categories */
  const { data: allCategories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const categoryDetails = allCategories?.find(cat => cat.id === categoryId);

  /* Images */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingImages,
    isError,
  } = useInfiniteQuery({
    queryKey: ['galleryImages', categoryId],
    queryFn: ({ pageParam }) =>
      getGalleryImages({
        categoryId,
        lastVisible: pageParam,
        pageSize: 9,
      }),
    initialPageParam: undefined as QueryDocumentSnapshot | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.images.length < 9) return undefined;
      return lastPage.lastVisible;
    },
    enabled: !!categoryId,
  });

  const allImages = data?.pages.flatMap(page => page.images) ?? [];

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        {/* Back button */}
        <div className="flex items-center mb-8">
          <Button asChild variant="outline" size="sm">
            <Link href="/cakes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToCategories')}
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold capitalize">
            {categoryDetails?.name?.[currentLang] || categoryDetails?.name?.en}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {categoryDetails?.description?.[currentLang] || categoryDetails?.description?.en}
          </p>
        </div>

        {/* States */}
        {isLoadingImages || isLoadingCategories ? (
          <div className="grid mt-12 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="w-full aspect-square rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-destructive">
            <p>{t('error')}</p>
          </div>
        ) : allImages.length === 0 ? (
          <div className="text-center py-20">
            <CameraOff className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-2xl font-semibold font-headline">
              {t('noImages.title')}
            </h3>
            <p className="mt-2 text-muted-foreground">
              {t('noImages.subtitle')}
            </p>
          </div>
        ) : (
          <>
            {/* Gallery Grid */}
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {allImages.map((image) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => setSelectedImage(image)}
                    className="cursor-pointer"
                  >
                    <Card className="overflow-hidden group">
                      <CardContent className="p-0 aspect-square relative">
                        <Image
                          src={image.imageUrl}
                          alt="Dort z galerie Cake Master"
                          fill
                          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Load more */}
            {hasNextPage && (
              <div className="mt-12 text-center">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  size="lg"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t('loadingButton')}
                    </>
                  ) : (
                    t('showMoreButton')
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {selectedImage && (
        <ImageDetailModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}
