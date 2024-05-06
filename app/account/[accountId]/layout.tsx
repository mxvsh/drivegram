import ClientProvider from '#/lib/client/provider';
import Header from '#/lib/components/common/header';
import Sidebar from '#/lib/components/common/sidebar';
import { env } from '#/lib/env';
import {
  getAccounts,
  getSingleAccount,
} from '#/lib/services/accounts';

async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    accountId: string;
  };
}) {
  const account = await getSingleAccount({
    id: params.accountId,
  });

  if (!account) {
    return (
      <div className="flex h-screen items-center justify-center">
        Account not found
      </div>
    );
  }

  const accounts = await getAccounts();

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
          <div className="bg-muted space-y-4 border-r">
            <Sidebar />
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </ClientProvider>
  );
}

export default Layout;
