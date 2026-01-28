
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import { cs } from "date-fns/locale";
import { getFunctions, httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";


import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import type { SizeOption } from "@/lib/types";

const cakeSchema = z.object({
  flavor: z.string({ required_error: "Please select a flavor." }),
  size: z.string({ required_error: "Please select a size." }),
  decorations: z
    .string()
    .min(10, "Please describe the decorations in more detail.")
    .max(300, "Description is too long."),
  chocolateDrip: z.string({ required_error: "Please select a chocolate drip option." }),
  pickupDate: z.date({
    required_error: "A pickup date is required.",
  }),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
});

type CakeFormValues = z.infer<typeof cakeSchema>;

export const cakeOptions = {
  flavors: [
    "chocoRaspberry",
    "tropicalMangoPassion",
    "oreoCheesecake",
    "pistachioRaspberryStrawberry",
    "carrotCherry",
    "strawberryVanillaCheesecake",
  ],
  chocolateDrips: ["none", "white", "dark"],
};

export function FastOrder() {
  const { t, i18n } = useTranslation('constructor');
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sizes: SizeOption[] = [
    { id: '1', label: 'small_1_5kg', price: 1950 },
    { id: '2', label: 'medium_2_5kg', price: 3250 },
  ];

  const form = useForm<CakeFormValues>({
    resolver: zodResolver(cakeSchema),
    defaultValues: {
      decorations: "",
      email: "",
      phone: "",
      flavor: cakeOptions.flavors[0],
      chocolateDrip: cakeOptions.chocolateDrips[0],
    },
  });

  useEffect(() => {
    if (sizes.length > 0 && !form.getValues('size')) {
      const defaultSize = sizes[0];
      if (defaultSize) {
        form.setValue('size', defaultSize.label);
        setSelectedSize(defaultSize);
      }
    }
  }, [sizes, form]);

  const handleSizeChange = (label: string) => {
    const size = sizes.find(s => s.label === label);
    if (size) {
      setSelectedSize(size);
      form.setValue("size", label);
    }
  }

  const handleSubmit = async (data: CakeFormValues) => {
    setIsSubmitting(true);

    if (!selectedSize) {
      toast({
        title: "Error",
        description: "Please select a size.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const submitOrder = httpsCallable(functions, 'submitOrder');

      const orderData = {
        ...data,
        topping: 'macarons and fresh fruit', // This is now a fixed value
        frosting: '', // Removed from form
        pickupDate: data.pickupDate.toISOString(),
        price: selectedSize.price,
      };

      await submitOrder(orderData);

      toast({
        title: t("form.toast.title"),
        description: t("form.toast.description"),
      });

      form.reset();
      if (sizes.length > 0) {
        const defaultSize = sizes[0];
        form.setValue('size', defaultSize.label);
        setSelectedSize(defaultSize);
      } else {
        setSelectedSize(null);
      }
    } catch (error: any) {
      console.error("Error submitting order:", error);
      toast({
        title: "Order Failed",
        description: error.message || "There was a problem submitting your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const minDate = addDays(new Date(), 2);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            {t("form.title")}
          </CardTitle>
          <CardDescription>{t("form.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="flavor"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-lg font-headline capitalize">
                      {t("form.labels.flavor")}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      >
                        {cakeOptions.flavors.map((option) => (
                          <FormItem
                            key={option}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={option} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t(`options.flavors.${option}`)}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-lg font-headline capitalize">
                      {t("form.labels.size")}
                    </FormLabel>

                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleSizeChange(value);
                        }}
                        value={field.value}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      >
                        {sizes.map((size) => (
                          <FormItem key={size.id} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={size.label} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t(`options.sizes.${size.label}`)}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label className="text-lg font-headline">
                  {t("form.labels.decorations")}
                </Label>
                <p className="text-sm text-muted-foreground pt-2">{t('form.fixedDecorations')}</p>
              </div>



              <FormField
                control={form.control}
                name="chocolateDrip"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-lg font-headline capitalize">
                      {t("form.labels.chocolateDrip")}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                      >
                        {cakeOptions.chocolateDrips.map((option) => (
                          <FormItem
                            key={option}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={option} />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                              {t(`options.chocolateDrips.${option}`)}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="decorations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-headline">
                      {t("form.labels.decorationWishes")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t(
                          "form.placeholders.decorations"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("form.descriptions.decorations")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="pickupDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("form.labels.pickupDate")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: i18n.language === 'cs' ? cs : undefined })
                            ) : (
                              <span>{t("form.placeholders.pickupDate")}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < minDate}
                          initialFocus
                          locale={i18n.language === 'cs' ? cs : undefined}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.labels.email")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("form.placeholders.email")} {...field} />
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
                        <FormLabel>{t("form.labels.phone")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("form.placeholders.phone")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-2xl font-bold font-headline text-right">
                  <span>{t('form.total')}: </span>
                  <span>
                    {selectedSize ? `${selectedSize.price} CZK` : t('form.selectSizePrompt')}
                  </span>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : (
                  <>
                    {t("form.submitButton")}{" "}
                    <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
