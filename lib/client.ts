import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

import prisma from '#/prisma';

import { env } from './env';

let clients = new Map<string, TelegramClient>();

export async function getClient(
  accountId: string,
) {
  if (clients.has(accountId)) {
    return clients.get(
      accountId,
    ) as TelegramClient;
  }

  const account = await prisma.account.findFirst({
    where: { id: accountId },
  });

  if (!account)
    throw new Error('No account found');

  const client = new TelegramClient(
    new StringSession(account.session),
    env.NEXT_PUBLIC_TELEGRAM_API_ID,
    env.NEXT_PUBLIC_TELEGRAM_API_HASH,
    {
      connectionRetries: 5,
    },
  );
  await client.start({
    onError: (err) => console.log(err),
    phoneCode: async () => '',
    phoneNumber: '',
  });

  clients.set(accountId, client);
  return client;
}
