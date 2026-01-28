
'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import type { PopulatedGalleryImage } from '@/lib/types';
import { useTranslation } from 'react-i18next';

export function ImageDetailModal({ image, onClose }: { image: PopulatedGalleryImage; onClose: () => void }) {
    const { i18n } = useTranslation();
    const currentLang = i18n.language as 'en' | 'cs';
    const description = image.description?.[currentLang] || image.description?.en || '';

    return (
        <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-3xl p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                    <div className="relative aspect-square w-full">
                        <Image
                            src={image.imageUrl}
                            alt="Detailed view of a cake"
                            fill
                            className="object-contain rounded-md"
                        />
                    </div>
                    <div className="flex flex-col space-y-3">
                        {description && (
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {image.categories.map(category => (
                                <Link key={category.id} href={`/cakes/${category.id}`} onClick={onClose}>
                                    <Badge variant="secondary" className="capitalize cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                                        {category.name[currentLang] || category.name.en}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
