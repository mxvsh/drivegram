import { redirect } from 'next/navigation';

import Header from '#/components/header';
import Sidebar from '#/components/sidebar';

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
    redirect('/');
  }
  return (
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
  );
}

export default Layout;
