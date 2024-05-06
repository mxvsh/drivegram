'use client';

import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

import { useEffect, useState } from 'react';

import AddAccount from '../add-account';
import Spinner from '../spinner';
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
    const _ = new TelegramClient(
      new StringSession(session),
      apiId,
      apiHash,
      { connectionRetries: 5, timeout: 0 },
    );
    _.connect()
      .catch((err) => {
        const error = err as Error;
        if (
          error.message.includes(
            'AUTH_KEY_DUPLICATED',
          )
        ) {
          _.disconnect();
          setRelogin(true);
        }
      })
      .then(() => {
        setClient(_);
      });
  }, [apiHash, apiId, session]);

  if (!client) {
    return (
      <div className="flex h-screen items-center justify-center gap-2">
        <Spinner />
        <div>Connecting</div>
      </div>
    );
  }

  if (relogin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <AddAccount />
      </div>
    );
  }

  return (
    <clientContext.Provider value={client}>
      {children}
    </clientContext.Provider>
  );
}

export default ClientProvider;
