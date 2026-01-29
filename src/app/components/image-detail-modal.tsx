'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';
import type { GalleryImage } from '@/lib/types';

export function ImageDetailModal({
  image,
  onClose,
}: {
  image: GalleryImage;
  onClose: () => void;
}) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-4 sm:p-6">
        <div className="relative aspect-square w-full">
          <Image
            src={image.imageUrl}
            alt="Detail obrázku z galerie Cake Master"
            fill
            className="object-contain rounded-md"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
