'use client';

import { useState } from 'react';
import {
  useInfiniteQuery,
  useQuery,
  InfiniteData,
} from '@tanstack/react-query';
import { getGalleryImages, getCategories } from '@/lib/api';
import type { GalleryImage, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2, CameraOff, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageDetailModal } from '@/app/components/image-detail-modal';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type {
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';

type GalleryPage = {
  images: GalleryImage[];
  lastVisible?: QueryDocumentSnapshot<DocumentData>;
};

export default function CategoryClientPage({
  categoryId,
}: {
  categoryId: string;
}) {
  const { t, i18n } = useTranslation('cakes');
  const currentLang = i18n.language as 'cs' | 'en';

  const [selectedImage, setSelectedImage] =
    useState<GalleryImage | null>(null);

  /* Categories */
  const { data: categories, isLoading: isLoadingCategories } =
    useQuery<Category[]>({
      queryKey: ['categories'],
      queryFn: getCategories,
    });

  const category = categories?.find(
    (c) => c.id === categoryId
  );

  /* Gallery */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingImages,
    isError,
  } = useInfiniteQuery<
    GalleryPage,
    Error,
    InfiniteData<GalleryPage>,
    [string, string],
    QueryDocumentSnapshot<DocumentData> | undefined
  >({
    queryKey: ['galleryImages', categoryId],
    queryFn: ({ pageParam }) =>
      getGalleryImages({
        categoryId,
        pageSize: 9,
        lastVisible: pageParam,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.images.length === 9
        ? lastPage.lastVisible
        : undefined,
    enabled: !!categoryId,
  });

  const images: GalleryImage[] =
    data?.pages.flatMap(
      (p: GalleryPage) => p.images
    ) ?? [];

  /* ===================== */

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="mb-8">
          <Button asChild variant="outline" size="sm">
            <Link href="/cakes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToCategories')}
            </Link>
          </Button>
        </div>

        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold capitalize">
            {category?.name?.[currentLang] ??
              category?.name?.en}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {category?.description?.[currentLang] ??
              category?.description?.en}
          </p>
        </div>

        {isLoadingImages || isLoadingCategories ? (
          <div className="grid mt-12 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-full aspect-square rounded-lg"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-destructive">
            {t('error')}
          </div>
        ) : images.length === 0 ? (
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
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {images.map((img: GalleryImage) => (
                  <motion.div
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className="cursor-pointer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="overflow-hidden">
                      <CardContent className="p-0 aspect-square relative">
                        <Image
                          src={img.imageUrl}
                          alt="Galerie Cake Master"
                          fill
                          className="object-cover"
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

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

      {selectedImage && (
        <ImageDetailModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}
