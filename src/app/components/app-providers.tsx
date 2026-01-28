'use client';

import { AuthProvider } from '@/hooks/use-auth';
import { TranslationsProvider } from './translations-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TranslationsProvider>
        <AuthProvider>{children}</AuthProvider>
      </TranslationsProvider>
    </QueryClientProvider>
  );
}
