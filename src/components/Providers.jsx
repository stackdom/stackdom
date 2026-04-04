'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { Toaster } from '@/components/ui/toaster';

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClientInstance}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
