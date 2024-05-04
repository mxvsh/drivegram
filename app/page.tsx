import { redirect } from 'next/navigation';

import SignInForm from '#/components/sign-in';

import prisma from '#/prisma';

async function Home() {
  const accounts =
    await prisma.account.findMany();
  if (accounts.length === 0)
    return (
      <div className="flex h-screen items-center justify-center">
        <SignInForm />
      </div>
    );

  redirect(`/account/${accounts[0].id}`);
}

export default Home;
