
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { getSizes } from '@/lib/api';
import { format, addDays } from "date-fns";
import { cs } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Skeleton } from "@/components/ui/skeleton";
import type { SizeOption } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";


const cakeSchema = z.object({
  flavor: z.string({ required_error: "Please select a flavor." }),
  frosting: z.string({ required_error: "Please select a frosting." }),
  topping: z.string({ required_error: "Please select a topping." }),
  size: z.string({ required_error: "Please select a size." }),
  decorations: z
    .string()
    .min(10, "Please describe the decorations in more detail.")
    .max(300, "Description is too long."),
  pickupDate: z.date({
    required_error: "A pickup date is required.",
  }),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
});

type CakeFormValues = z.infer<typeof cakeSchema>;

export const cakeOptions = {
  flavors: ["vanilla", "chocolate", "redVelvet", "lemon", "carrot"],
  frostings: ["buttercream", "creamCheese", "fondant", "ganache"],
  toppings: ["oreoRaspberry", "macaronBlueberry"],
};

export function CakeConstructor({ onToppingChange }: { onToppingChange: (topping: string) => void }) {
  const { t, i18n } = useTranslation();
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: sizes = [], isLoading: loadingSizes, isError } = useQuery<SizeOption[]>({
    queryKey: ['sizes'],
    queryFn: getSizes,
  });

  const form = useForm<CakeFormValues>({
    resolver: zodResolver(cakeSchema),
    defaultValues: {
      decorations: "",
      email: "",
      phone: "",
      flavor: cakeOptions.flavors[0],
      frosting: cakeOptions.frostings[0],
      topping: cakeOptions.toppings[0],
    },
  });

  useEffect(() => {
    if (sizes.length > 0 && !form.getValues('size')) {
        const smallSize = sizes.find(s => s.label === 'small');
        if (smallSize) {
            form.setValue('size', smallSize.label);
            setSelectedSize(smallSize);
        }
    }
  }, [sizes, form]);

  useEffect(() => {
    if(isError) {
        toast({
            title: "Error",
            description: "Could not load cake sizes. Please try again later.",
            variant: "destructive"
        });
    }
  }, [isError]);

  const handleSizeChange = (label: string) => {
    const size = sizes.find(s => s.label === label);
    if (size) {
        setSelectedSize(size);
        form.setValue("size", label);
    }
  }

  const handleSubmit = async (data: CakeFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Form Submitted:", data);
    
    toast({
      title: t("constructor.toast.title"),
      description: t("constructor.toast.description"),
    });

    form.reset();
    const smallSize = sizes.find(s => s.label === 'small');
    if (smallSize) {
        form.setValue('size', smallSize.label);
        setSelectedSize(smallSize);
    } else {
        setSelectedSize(null);
    }
    setIsSubmitting(false);
  }

  const sections: (keyof Pick<typeof cakeOptions, 'flavors' | 'frostings' | 'toppings'>)[] = [
    "flavors",
    "frostings",
  ];
  
  const minDate = addDays(new Date(), 2);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            {t("constructor.form.title")}
          </CardTitle>
          <CardDescription>{t("constructor.form.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              {sections.map((section) => (
                <FormField
                  key={section}
                  control={form.control}
                  name={section as 'flavor' | 'frosting'}
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-lg font-headline capitalize">
                         {t(`constructor.form.labels.${section}` as const)}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          {cakeOptions[section].map((option) => (
                            <FormItem
                              key={option}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={option} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {t(`constructor.options.${section}.${option}`)}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <FormField
                control={form.control}
                name="topping"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-lg font-headline capitalize">
                       {t(`constructor.form.labels.toppings` as const)}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          onToppingChange(value);
                        }}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        {cakeOptions.toppings.map((option) => (
                          <FormItem
                            key={option}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={option} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t(`constructor.options.toppings.${option}`)}
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
                          {t("constructor.form.labels.sizes")}
                      </FormLabel>
                      {loadingSizes ? (
                          <div className="grid grid-cols-2 gap-4">
                              <Skeleton className="h-6 w-24" />
                              <Skeleton className="h-6 w-24" />
                              <Skeleton className="h-6 w-24" />
                              <Skeleton className="h-6 w-24" />
                          </div>
                      ) : (
                          <FormControl>
                              <RadioGroup
                                  onValueChange={(value) => {
                                      field.onChange(value);
                                      handleSizeChange(value);
                                  }}
                                  value={field.value}
                                  className="grid grid-cols-2 gap-4"
                              >
                                  {sizes.map((size) => (
                                      <FormItem key={size.id} className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                              <RadioGroupItem value={size.label} />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                              {t(`constructor.options.sizes.${size.label}`)}
                                          </FormLabel>
                                      </FormItem>
                                  ))}
                              </RadioGroup>
                          </FormControl>
                      )}
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
                      {t("constructor.form.labels.decorations")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t(
                          "constructor.form.placeholders.decorations"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("constructor.form.descriptions.decorations")}
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
                    <FormLabel>{t("constructor.form.labels.pickupDate")}</FormLabel>
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
                              <span>{t("constructor.form.placeholders.pickupDate")}</span>
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
                        <FormLabel>{t("constructor.form.labels.email")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("constructor.form.placeholders.email")} {...field} />
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
                        <FormLabel>{t("constructor.form.labels.phone")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("constructor.form.placeholders.phone")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-2xl font-bold font-headline text-right">
                  <span>{t('constructor.form.total')}: </span>
                  <span>
                    {selectedSize ? `${selectedSize.price} CZK` : t('constructor.form.selectSizePrompt')}
                  </span>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : (
                  <>
                    {t("constructor.form.submitButton")}{" "}
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
