import { z } from 'zod';

import * as services from '#/lib/services/accounts';

import { procedure } from '../trpc';

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
