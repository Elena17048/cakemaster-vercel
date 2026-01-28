'use client';

import { I18nextProvider } from 'react-i18next';
import { ReactNode, useEffect, useState } from 'react';
import i18n from '@/app/i18n';

export function TranslationsProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!i18n.isInitialized) {
      i18n.init().then(() => {
        setIsInitialized(true);
      });
    } else {
      setIsInitialized(true);
    }
  }, []);

  if (!isInitialized) {
    return null; 
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
