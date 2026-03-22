
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Sparkles } from "lucide-react";

interface OrderQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCustom: () => void;
}

export function OrderQuestionnaireModal({ isOpen, onClose, onSelectCustom }: OrderQuestionnaireModalProps) {
  const { t } = useTranslation('home');
  const router = useRouter();
  const [step, setStep] = useState(1);

  const handleGuestsAnswer = (isLargeParty: boolean) => {
    if (isLargeParty) {
      onSelectCustom();
    } else {
      setStep(2);
    }
  };

  const handleDesignAnswer = (wantsCustom: boolean) => {
    if (wantsCustom) {
      onSelectCustom();
    } else {
      onClose(); // Close modal first
      router.push('/fast-order'); // Then navigate
    }
  };
  
  const handleClose = () => {
    onClose();
    // Reset to step 1 after modal closes for next time
    setTimeout(() => setStep(1), 300);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="text-center">
          <DialogTitle className="font-headline text-2xl">{t('questionnaire.title')}</DialogTitle>
        </DialogHeader>
        
        <div>
          {step === 1 && (
            <div className="text-center space-y-4 flex flex-col">
              <p className="text-lg font-medium">{t('questionnaire.q1.title')}</p>
              <Card className="w-full overflow-hidden aspect-square">
                  <CardContent className="p-0 w-full h-full relative">
                      <Image
                          src="https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Fcakes%2Fbirthday.png?alt=media"
                          alt={t('questionnaire.q1.imageAlt')}
                          fill
                          className="object-cover rounded-md"
                          data-ai-hint="birthday cake"
                      />
                  </CardContent>
              </Card>
              <div className="flex justify-center gap-4 pt-2">
                  <Button onClick={() => handleGuestsAnswer(true)} size="lg">
                      <Users className="mr-2" /> {t('questionnaire.q1.yes')}
                  </Button>
                  <Button onClick={() => handleGuestsAnswer(false)} size="lg" variant="outline">{t('questionnaire.q1.no')}</Button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="text-center space-y-4 flex flex-col">
              <p className="text-lg font-medium">{t('questionnaire.q2.title')}</p>
              <Card className="w-full overflow-hidden aspect-square">
                  <CardContent className="p-0 w-full h-full relative">
                      <Image
                          src="https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Fcakes%2Fbasic_1.jpg?alt=media"
                          alt={t('questionnaire.q2.imageAlt')}
                          fill
                          className="object-cover rounded-md"
                          data-ai-hint="classic cake"
                      />
                  </CardContent>
              </Card>
              <div className="flex flex-col sm:flex-row justify-center gap-2 pt-2">
                  <Button onClick={() => handleDesignAnswer(false)} size="sm" className="flex-1">
                      <Sparkles className="mr-2" /> {t('questionnaire.q2.classic')}
                  </Button>
                  <Button onClick={() => handleDesignAnswer(true)} size="sm" variant="outline" className="flex-1">{t('questionnaire.q2.specific')}</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
