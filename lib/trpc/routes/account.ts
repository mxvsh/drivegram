import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { z } from 'zod';

import { env } from '#/lib/env';
import * as services from '#/lib/services/accounts';

import { procedure } from '../trpc';

// todo: better typing

let client: TelegramClient | null = null;
let resolvers = new Map<string, Function>();

function resolveResponse(
  message?: Record<string, unknown>,
) {
  const responseResolver =
    resolvers.get('response');
  if (responseResolver) {
    responseResolver(message);
  }
}

function createResponseResolver() {
  return new Promise<Record<string, string>>(
    (resolve) => {
      resolvers.set('response', resolve);
    },
  );
}

export const saveAccountSession = procedure
  .input(
    z.object({
      name: z.string(),
      session: z.string(),
      accountId: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    return services.saveSession({
      accountName: input.name,
      session: input.session,
      accountId: input.accountId,
    });
  });

export const sendPhoneCode = procedure
  .input(z.object({ phoneNumber: z.string() }))
  .mutation(async ({ input }) => {
    const id = env.TELEGRAM_API_ID;
    const hash = env.TELEGRAM_API_HASH;

    client = new TelegramClient(
      new StringSession(''),
      id,
      hash,
      {
        connectionRetries: 4,
      },
    );

    client
      .start({
        phoneNumber: input.phoneNumber,
        phoneCode: async () => {
          return new Promise((resolve) => {
            resolvers.set('phoneCode', resolve);
            resolveResponse();
          });
        },
        password: async () => {
          return new Promise((resolve) => {
            resolvers.set('password', resolve);
            resolveResponse({
              next: 'require_password',
            });
          });
        },
        onError(err) {
          client = null;
          console.error(err);
          resolveResponse({
            error: err.message,
          });
        },
      })
      .then(async () => {
        const user = await client?.getMe();
        const session =
          client?.session.save() + '';

        console.log('session', session);

        if (user && user.id) {
          resolveResponse({
            id: user.id,
            firstName: user?.firstName || '',
          });

          services.saveSession({
            accountId: user.id.toString(),
            accountName: user?.firstName || '',
            session,
          });
        }
      })
      .catch((err) => {
        client = null;
        console.error(err);
        resolveResponse({
          error: err.message,
        });
      });

    return createResponseResolver();
  });

export const verifyOtp = procedure
  .input(z.object({ code: z.string() }))
  .mutation(async ({ input }) => {
    const resolver = resolvers.get('phoneCode');
    if (resolver) {
      resolver(input.code);
    }
    return createResponseResolver();
  });

export const verifyPassword = procedure
  .input(z.object({ password: z.string() }))
  .mutation(async ({ input }) => {
    const resolver = resolvers.get('password');
    if (resolver) {
      resolver(input.password);
    }
    return createResponseResolver();
  });
