import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { z } from 'zod';

import { env } from '#/lib/env';
import prisma from '#/prisma';

import { procedure } from '../trpc';

let client: TelegramClient | null = null;

let clientResolvers: Record<
  string,
  null | ((value: string) => void)
> = {
  phoneCode: null,
  password: null,
};

let finalResolver:
  | null
  | ((user: Api.User) => void) = null;

async function setupCient(phoneNumber: string) {
  const apiId = env.TELEGRAM_API_ID;
  const apiHash = env.TELEGRAM_API_HASH;

  client = new TelegramClient(
    new StringSession(''),
    Number(apiId),
    apiHash,
    {
      connectionRetries: 5,
    },
  );

  await client.start({
    phoneNumber: phoneNumber,
    phoneCode: async () => {
      return new Promise((resolve) => {
        clientResolvers.phoneCode = resolve;
      });
    },
    password: async () => {
      return new Promise((resolve) => {
        clientResolvers.password = resolve;
      });
    },
    onError: (err) => {
      console.error('Error occurred', err);
    },
  });

  if (finalResolver) {
    const session = client.session.save() + '';
    const me = await client.getMe();
    await prisma.account.create({
      data: {
        id: me.id.toString(),
        name: me.firstName!,
        session,
        me,
        picture: '',
      },
    });
    finalResolver(me);
  }
}

export const generateOtp = procedure
  .input(
    z.object({
      phoneNumber: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    const { phoneNumber } = input;

    if (client) client = null;

    setupCient(phoneNumber);
  });

export const verifyOtp = procedure
  .input(z.string())
  .mutation(async ({ input }) => {
    if (!client) {
      throw new Error('Client not setup');
    }

    if (!clientResolvers.phoneCode) {
      throw new Error(
        'phoneCode resolver not setup',
      );
    }

    clientResolvers.phoneCode(input);
  });

export const verifyPassword = procedure
  .input(z.string())
  .mutation(async ({ input }) => {
    if (!client) {
      throw new Error('Client not setup');
    }

    if (!clientResolvers.password) {
      throw new Error(
        'password resolver not setup',
      );
    }

    clientResolvers.password(input);

    return new Promise<Api.User>((resolve) => {
      finalResolver = resolve;
    });
  });
