import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { z } from 'zod';

import { TRPCError } from '@trpc/server';

import { env } from '#/lib/env';
import prisma from '#/prisma';

import { procedure } from '../trpc';

export const saveSession = procedure
  .input(
    z.object({
      id: z.string(),
      name: z.string(),
      session: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    const exist = await prisma.account.findUnique(
      {
        where: {
          id: input.id,
        },
      },
    );
    if (exist) {
      return await prisma.account.update({
        where: {
          id: input.id,
        },
        data: {
          session: input.session,
          name: input.name,
        },
      });
    }
    return prisma.account.create({
      data: {
        id: input.id,
        name: input.name,
        session: input.session,
      },
    });
  });
