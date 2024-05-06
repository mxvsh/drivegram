import ClientProvider from '#/components/client/provider';
import Header from '#/components/header';
import Sidebar from '#/components/sidebar';

import { env } from '#/lib/env';
import prisma from '#/prisma';

async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    accId: string;
  };
}) {
  const account = await prisma.account.findFirst({
    where: { id: params.accId },
  });
  const accounts = await prisma.account.findMany({
    select: { id: true, name: true },
  });
  if (!account) {
    return (
      <div className="flex h-screen items-center justify-center">
        Account not found
      </div>
    );
  }
  return (
    <ClientProvider
      session={account.session}
      apiId={env.NEXT_PUBLIC_TELEGRAM_API_ID}
      apiHash={env.NEXT_PUBLIC_TELEGRAM_API_HASH}
    >
      <div className="flex h-screen flex-col overflow-hidden">
        <Header
          account={account}
          accounts={accounts}
        />
        <div className="flex flex-1 overflow-auto">
          <div className="space-y-4 border-r bg-muted">
            <Sidebar />
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </ClientProvider>
  );
}

export default Layout;
