import { unstable_noStore as notStore } from 'next/cache';

import AddAccount from '#/lib/components/accounts/add';

function Page() {
  notStore();
  return (
    <div className="flex h-screen items-center justify-center bg-muted/50">
      <AddAccount />
    </div>
  );
}

export default Page;
