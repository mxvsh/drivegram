import AccountPicker from '#/components/account-picker';
import AddAccount from '#/components/add-account';

import prisma from '#/prisma';

async function Home() {
  const accounts =
    await prisma.account.findMany();
  if (accounts.length === 0)
    return (
      <div className="flex h-screen items-center justify-center bg-muted/50">
        <AddAccount />
      </div>
    );

  return (
    <div className="flex h-screen items-center justify-center bg-muted/50">
      <AccountPicker accounts={accounts} />
    </div>
  );
}

export default Home;
