import { redirect } from 'next/navigation';

import AddAccount from '#/components/add-account';

import prisma from '#/prisma';

async function Home() {
  const accounts =
    await prisma.account.findMany();
  if (accounts.length === 0)
    return (
      <div className="flex h-screen items-center justify-center">
        <AddAccount />
      </div>
    );

  redirect(`/account/${accounts[0].id}`);
}

export default Home;
