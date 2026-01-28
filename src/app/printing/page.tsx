
"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, FileType, Image as ImageIcon, Ruler } from "lucide-react";

export default function EdiblePrinting() {
  const { t } = useTranslation('printing');

  return (
    <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">{t('title')}</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-12 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{t('details.title')}</CardTitle>
            <CardDescription>{t('details.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <FileType className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">{t('details.fileTypes.title')}</h3>
                <p className="text-muted-foreground">{t('details.fileTypes.description')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <ImageIcon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">{t('details.quality.title')}</h3>
                <p className="text-muted-foreground">{t('details.quality.description')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Ruler className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">{t('details.pricing.title')}</h3>
                <p className="text-muted-foreground">
                  {t('details.pricing.description')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{t('request.title')}</CardTitle>
            <CardDescription>{t('request.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('form.name.label')}</Label>
                  <Input id="name" placeholder={t('form.name.placeholder')} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="email">{t('form.email.label')}</Label>
                  <Input id="email" type="email" placeholder={t('form.email.placeholder')} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="design-file">{t('form.upload.label')}</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="flex text-sm text-muted-foreground">
                      <label htmlFor="design-file" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                        <span>{t('form.upload.button')}</span>
                        <input id="design-file" name="design-file" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">{t('form.upload.drag')}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{t('form.upload.hint')}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">{t('form.notes.label')}</Label>
                <Textarea id="notes" placeholder={t('form.notes.placeholder')} />
              </div>
              <Button type="submit" className="w-full">{t('form.submit')}</Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
                {t('form.altEmail.text')}
                <a href="mailto:print@cakemaster.cz" className="font-medium text-primary hover:underline">
                    print@cakemaster.cz
                </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
