
"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Gift, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const CUPCAKE_PRICE = 200;
const MAX_ORDER_AMOUNT = 12;

export function ChristmasOrderModal({ isOpen, onClose, onOrderSuccess, remaining }: { isOpen: boolean; onClose: () => void; onOrderSuccess: (quantity: number) => void, remaining: number }) {
  const { t, i18n } = useTranslation('christmas');
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [pickupDate, setPickupDate] = useState("2024-12-23");
  const [pickupTime, setPickupTime] = useState("10:00");

  const availableQuantity = Math.min(MAX_ORDER_AMOUNT, remaining);
  const totalPrice = quantity * CUPCAKE_PRICE;

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + amount;
      if (newQuantity < 1) return 1;
      if (newQuantity > availableQuantity) return availableQuantity;
      return newQuantity;
    });
  };

  const handleSubmit = () => {
    // In a real app, you'd send this to a backend.
    console.log({
      quantity,
      pickupDate,
      pickupTime,
      totalPrice,
    });
    
    toast({
        title: t('modal.toast.title'),
        description: t('modal.toast.description', { count: quantity, date: pickupDate, time: pickupTime }),
    });

    onOrderSuccess(quantity);
    setQuantity(1); // Reset for next time
  };

  const pickupTimes = Array.from({ length: 11 }, (_, i) => `${10 + i}:00`);
  const locale = i18n.language === 'cs' ? cs : undefined;
  const dateOptions = [
    { value: "2024-12-23", label: format(new Date(2024, 11, 23), "EEEE, MMMM d.", { locale }) },
    { value: "2024-12-24", label: format(new Date(2024, 11, 24), "EEEE, MMMM d.", { locale }) },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-card border-red-500/50">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <Gift className="text-red-500" /> {t('modal.title')}
          </DialogTitle>
          <DialogDescription>{t('modal.subtitle')}</DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-8 py-4">
            <div className="relative aspect-square rounded-lg overflow-hidden">
                 <Image
                    src="https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Fcm_cupcake.png?alt=media"
                    alt="Christmas Cupcake"
                    fill
                    className="object-cover"
                    data-ai-hint="christmas cupcake"
                 />
            </div>
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label>{t('modal.quantity.label')}</Label>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-bold w-12 text-center">{quantity}</span>
                         <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)} disabled={quantity >= availableQuantity}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">{t('modal.quantity.note', { max: availableQuantity })}</p>
                </div>
                 <div className="space-y-2">
                    <Label>{t('modal.date.label')}</Label>
                     <RadioGroup value={pickupDate} onValueChange={setPickupDate}>
                        {dateOptions.map(option => (
                            <div key={option.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.value} id={option.value} />
                                <Label htmlFor={option.value} className="font-normal capitalize">{option.label}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pickup-time">{t('modal.time.label')}</Label>
                    <Select value={pickupTime} onValueChange={setPickupTime}>
                        <SelectTrigger id="pickup-time">
                            <SelectValue placeholder={t('modal.time.placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                            {pickupTimes.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between sm:items-center pt-4 border-t">
            <div className="text-2xl font-bold font-headline text-right sm:text-left">
                <span>{t('modal.total')}: </span>
                <span>{totalPrice} CZK</span>
            </div>
            <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700 text-white">
                {t('modal.confirmButton')}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
