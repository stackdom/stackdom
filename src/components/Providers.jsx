'use client';

import { Toaster } from '@/components/ui/toaster';

export default function Providers({ children }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
