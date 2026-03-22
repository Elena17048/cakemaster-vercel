
"use client";

import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { t } = useTranslation(['contact', 'common']);

  const phone = t('common:contact.info.phone');
  const email = t('common:contact.info.email');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{t('modal.title')}</DialogTitle>
          <DialogDescription>{t('modal.subtitle')}</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <Button asChild variant="outline" className="w-full justify-start h-12 text-base">
                <a href={`tel:${phone.replace(/\s/g, '')}`}>
                    <Phone className="mr-3 h-5 w-5" />
                    <span>{phone}</span>
                </a>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-12 text-base">
                <a href={`mailto:${email}`}>
                    <Mail className="mr-3 h-5 w-5" />
                    <span>{email}</span>
                </a>
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
