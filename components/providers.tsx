'use client';

import { Toaster } from 'sonner';

import TrpcProvider from '#/lib/trpc/provider';

function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TrpcProvider>
      {children}
      <Toaster position="bottom-center" />
    </TrpcProvider>
  );
}

export default Providers;
