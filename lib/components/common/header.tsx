'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#/lib/components/ui/select';
import type { Account } from '#/lib/db/schema';

import { Button } from '../ui/button';

function Header({
  account,
  accounts,
}: {
  account: Account;
  accounts: Account[];
}) {
  const r = useRouter();

  return (
    <div className="sticky top-0 flex h-16 items-center gap-2 border-b bg-white px-2 py-2">
      <Image
        src="/logo.png"
        width={100}
        height={100}
        alt="logo"
        className="h-11 w-11 rounded-xl"
        draggable="false"
      />
      <h1 className="text-xl font-semibold">
        drivegram
      </h1>
      <div className="flex-1" />
      <div>
        <Select
          value={account.id}
          onValueChange={(id) => {
            r.push(`/account/${id}`);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue
              placeholder={account.name}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="text-xs">
                Accounts
              </SelectLabel>
              {accounts.map(({ id, name }) => (
                <SelectItem value={id} key={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>

            <div className="px-2 py-2">
              <Link href="/add-account">
                <Button
                  size="xs"
                  className="w-full"
                >
                  Add account
                </Button>
              </Link>
            </div>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default Header;
