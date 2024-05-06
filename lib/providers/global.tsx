'use client';

import { Toaster } from 'sonner';

import TrpcProvider from '../trpc/provider';

function GlobalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TrpcProvider>
      <Toaster />
      {children}
    </TrpcProvider>
  );
}

export default GlobalProvider;
