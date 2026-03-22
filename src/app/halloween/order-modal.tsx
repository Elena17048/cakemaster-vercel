
"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Ghost, Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

interface OrderDetails {
    boxType: 'box_6' | 'box_12';
    quantity: number; // total cupcakes
    boxCount: number; // number of boxes
    totalPrice: number;
}

interface HalloweenOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOrderSuccess: () => void;
    order: OrderDetails;
}

export function HalloweenOrderModal({ isOpen, onClose, onOrderSuccess, order }: HalloweenOrderModalProps) {
  const { t, i18n } = useTranslation('halloween');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupDate, setPickupDate] = useState<string>("30.10");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const year = new Date().getFullYear();
        const [day, month] = pickupDate.split('.').map(Number);
        const pickupDateObj = new Date(year, month - 1, day);

        const orderData = {
            flavor: "Halloween Mix",
            frosting: "Mixed",
            topping: "Halloween decorations",
            size: order.boxType,
            decorations: `Halloween Cupcake Order: ${order.boxCount} x ${t(`boxes.${order.boxType}.title`)}. Total cupcakes: ${order.quantity}.`,
            pickupDate: pickupDateObj.toISOString(),
            email: email,
            phone: phone,
            price: order.totalPrice,
        };

        const submitOrder = httpsCallable(functions, 'submitOrder');
        await submitOrder(orderData);
        
        toast({
            title: t('modal.toast.title'),
            description: t('modal.toast.description', { 
                count: order.quantity, 
                box: t(`boxes.${order.boxType}.title`),
            }),
        });

        onOrderSuccess();
        setName('');
        setEmail('');
        setPhone('');
        setPickupDate("30.10");

    } catch (error: any) {
        console.error("Error submitting Halloween order:", error);
        toast({
            title: "Order Failed",
            description: error.message || "There was a problem submitting your order.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const isFormInvalid = !name || !email || !pickupDate;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-orange-500/50">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <Ghost className="text-orange-500" /> {t('modal.title')}
          </DialogTitle>
          <DialogDescription>{t('modal.subtitle')}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="name">{t('modal.form.name')}</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">{t('modal.form.email')}</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phone">{t('modal.form.phone')}</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>{t('modal.date.label')}</Label>
                    <RadioGroup 
                        value={pickupDate} 
                        onValueChange={setPickupDate} 
                        className="grid grid-cols-2 gap-4"
                    >
                        <div>
                            <RadioGroupItem value="30.10" id="d3010" className="sr-only" />
                            <Label htmlFor="d3010" className={cn("flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground", pickupDate === '30.10' && 'border-orange-500')}>
                                30.10
                            </Label>
                        </div>
                         <div>
                            <RadioGroupItem value="31.10" id="d3110" className="sr-only" />
                            <Label htmlFor="d3110" className={cn("flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground", pickupDate === '31.10' && 'border-orange-500')}>
                                31.10
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>

            <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between sm:items-center pt-4 border-t">
                <div className="text-xl font-bold font-headline text-right sm:text-left">
                    <span>{t('modal.total')}: </span>
                    <span>{order.totalPrice} CZK</span>
                </div>
                <Button type="submit" disabled={isSubmitting || isFormInvalid} className="bg-orange-600 hover:bg-orange-700 text-white">
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        t('modal.confirmButton')
                    )}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
