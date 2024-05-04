import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

import prisma from '#/prisma';

import { env } from './env';

let client: TelegramClient | null = null;
export async function getClient() {
  if (client) return client;

  const account =
    await prisma.account.findFirst();

  if (!account)
    throw new Error('No account found');

  client = new TelegramClient(
    new StringSession(account.session),
    env.TELEGRAM_API_ID,
    env.TELEGRAM_API_HASH,
    {
      connectionRetries: 5,
    },
  );
  await client.start({
    onError: (err) => console.log(err),
    phoneCode: async () => '',
    phoneNumber: '',
  });
  return client;
}
