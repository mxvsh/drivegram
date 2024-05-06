import { z } from 'zod';

import * as services from '#/lib/services/files';

import { procedure } from '../trpc';

export const getFiles = procedure
  .input(
    z.object({
      accountId: z.string(),
      folderPath: z.string().optional(),
    }),
  )
  .query(async ({ input }) => {
    return services.getFiles({
      accountId: input.accountId,
      folderPath: input.folderPath ?? '/',
    });
  });

export const createFile = procedure
  .input(services.CreateFileDTO)
  .mutation(async ({ input }) => {
    return services.createFile(input);
  });

export const deleteFile = procedure
  .input(z.number())
  .mutation(async ({ input }) => {
    return services.deleteFile(input);
  });

export const toggleBookmarkFile = procedure
  .input(z.number())
  .mutation(async ({ input }) => {
    return services.toggleBookmarkFile(input);
  });

export const renameFile = procedure
  .input(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    return services.renameFile(input);
  });
