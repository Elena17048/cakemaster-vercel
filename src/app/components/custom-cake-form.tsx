
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
import { useRouter } from "next/navigation";


import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const customCakeSchema = z.object({
  description: z.string().min(10, "Please describe the cake in more detail.").max(500, "Description is too long."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
});

type CustomCakeFormValues = z.infer<typeof customCakeSchema>;

export function CustomCakeForm({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('home');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CustomCakeFormValues>({
    resolver: zodResolver(customCakeSchema),
    defaultValues: {
      description: "",
      email: "",
      phone: "",
    },
  });

  const handleSubmit = async (data: CustomCakeFormValues) => {
    setIsSubmitting(true);
    
    try {
        const submitOrder = httpsCallable(functions, 'submitOrder');
        
        const orderData = {
            flavor: "Custom",
            frosting: "Custom",
            topping: "Custom",
            size: "Custom",
            decorations: data.description,
            pickupDate: new Date().toISOString(), // Placeholder, as this is a quote request
            email: data.email,
            phone: data.phone,
            price: 0, // Price to be determined
        };

        await submitOrder(orderData);
        
        form.reset();
        onClose();
        router.push('/success');

    } catch (error: any) {
        console.error("Error submitting custom order:", error);
        toast({
            title: "Request Failed",
            description: error.message || "There was a problem submitting your request.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("customCakeModal.form.description.label")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("customCakeModal.form.description.placeholder")}
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>{t("customCakeModal.form.email.label")}</FormLabel>
                <FormControl>
                    <Input placeholder={t("customCakeModal.form.email.placeholder")} {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
                <FormItem>
                <FormLabel>{t("customCakeModal.form.phone.label")}</FormLabel>
                <FormControl>
                    <Input placeholder={t("customCakeModal.form.phone.placeholder")} {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-center text-muted-foreground">
            {t('customCakeModal.contactNote.text')}
            <a href="tel:+420774351057" className="font-medium text-primary hover:underline"> +420 774 351 057 </a>
            {t('customCakeModal.contactNote.or')}
            <a href="mailto:objednavky@cakemaster.cz" className="font-medium text-primary hover:underline"> objednavky@cakemaster.cz</a>.
          </p>
        </div>


        <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
                {t("customCakeModal.form.cancelButton")}
            </Button>
             <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : (
                <>
                    {t("customCakeModal.form.submitButton")}
                    <Send className="ml-2 h-4 w-4" />
                </>
                )}
            </Button>
        </div>
      </form>
    </Form>
  );
}
