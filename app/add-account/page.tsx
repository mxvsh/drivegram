import { unstable_noStore as notStore } from 'next/cache';

import AddAccount from '#/lib/components/accounts/add';
import { env } from '#/lib/env';

function Page() {
  notStore();
  return (
    <div className="flex h-screen items-center justify-center bg-muted/50">
      <AddAccount
        apiId={env.TELEGRAM_API_ID}
        apiHash={env.TELEGRAM_API_HASH}
      />
    </div>
  );
}

export default Page;
