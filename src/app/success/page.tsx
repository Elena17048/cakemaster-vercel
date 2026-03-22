"use client";

import { useTranslation } from "react-i18next";
import { PartyPopper, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SuccessPage() {
  const { t } = useTranslation('success');

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-12rem)] py-12">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary text-primary-foreground rounded-full h-20 w-20 flex items-center justify-center mb-6">
            <PartyPopper className="h-12 w-12" />
          </div>
          <CardTitle className="text-4xl font-headline">{t('title')}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            {t('subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-muted-foreground">
                {t('nextSteps')}
            </p>
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft className="mr-2 h-5 w-5" />
              {t('backButton')}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
