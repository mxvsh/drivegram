import AddAccount from '#/lib/components/accounts/add';
import AccountPicker from '#/lib/components/accounts/picker';
import { getAccounts } from '#/lib/services/accounts';

async function Home() {
  const accounts = await getAccounts();

  if (accounts.length === 0)
    return (
      <div className="bg-muted/50 flex h-screen items-center justify-center">
        <AddAccount />
      </div>
    );

  return (
    <div className="bg-muted/50 flex h-screen items-center justify-center">
      <AccountPicker accounts={accounts} />
    </div>
  );
}

export default Home;
