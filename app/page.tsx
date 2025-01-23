import { unstable_noStore as notStore } from 'next/cache';
import { redirect } from 'next/navigation';

import AccountPicker from '#/lib/components/accounts/picker';
import { getAccounts } from '#/lib/services/accounts';

async function Home() {
  notStore();
  const accounts = await getAccounts();

  if (accounts.length === 0) {
    redirect('/add-account');
  }

  return (
    <div className="flex h-screen items-center justify-center bg-muted/50">
      <AccountPicker accounts={accounts} />
    </div>
  );
}

export default Home;
