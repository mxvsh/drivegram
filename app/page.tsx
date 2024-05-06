import { unstable_noStore as notStore } from 'next/cache';
import Image from 'next/image';

import AddAccount from '#/lib/components/accounts/add';
import AccountPicker from '#/lib/components/accounts/picker';
import { env } from '#/lib/env';
import logo from '#/lib/logo.svg';
import { getAccounts } from '#/lib/services/accounts';

async function Home() {
  notStore();
  const accounts = await getAccounts();

  if (accounts.length === 0) {
    return (
      <div className="relative flex h-screen items-center justify-center bg-muted/50">
        <AddAccount
          apiId={env.TELEGRAM_API_ID}
          apiHash={env.TELEGRAM_API_HASH}
        />
        <div className="absolute left-0 top-0 z-10 flex h-[45%] w-full flex-col items-center justify-center gap-2 bg-primary">
          <Image
            src={logo}
            alt="DriveGram"
            width={40}
            height={40}
            draggable={false}
          />
          <h1 className="pt-4 text-4xl font-bold text-white">
            DriveGram
          </h1>
          <p className="text-lg text-white/80">
            Personal cloud storage powered by
            Telegram
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-muted/50">
      <AccountPicker accounts={accounts} />
    </div>
  );
}

export default Home;
