'use client';

import { toast } from 'sonner';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

import { useEffect, useState } from 'react';

import AddAccount from '../components/accounts/add';
import { clientContext } from './context';

function ClientProvider({
  apiId,
  apiHash,
  session,
  children,
}: {
  apiId: number;
  apiHash: string;
  session: string;
  children: React.ReactNode;
}) {
  const [client, setClient] =
    useState<TelegramClient | null>(null);
  const [relogin, setRelogin] = useState(false);

  useEffect(() => {
    let hasError = false;
    const id = toast.loading(
      'Connecting to Telegram',
    );
    const _ = new TelegramClient(
      new StringSession(session),
      apiId,
      apiHash,
      { connectionRetries: 5 },
    );
    _.connect()
      .catch((err) => {
        hasError = true;
        const error = err as Error;
        if (
          error.message.includes(
            'AUTH_KEY_DUPLICATED',
          )
        ) {
          _.disconnect();
          // setRelogin(true);
          toast.dismiss(id);
          toast.warning(
            'The session is invalid. Please re-login.',
          );
        }
      })
      .then(() => {
        if (hasError) return;
        setClient(_);
        toast.dismiss(id);
        toast.success('Connected');
      });
  }, [apiHash, apiId, session]);

  if (relogin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <AddAccount
          apiId={apiId}
          apiHash={apiHash}
        />
      </div>
    );
  }

  return (
    <clientContext.Provider value={client!}>
      {children}
    </clientContext.Provider>
  );
}

export default ClientProvider;
