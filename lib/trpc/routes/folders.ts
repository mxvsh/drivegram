import { z } from 'zod';

import * as services from '#/lib/services/folders';

import { procedure } from '../trpc';

export const getFolders = procedure
  .input(
    z.object({
      accountId: z.string(),
      path: z.string().optional(),
    }),
  )
  .query(({ input }) => {
    return services.getFolders(input);
  });

export const getSingleFolder = procedure
  .input(
    z.object({
      accountId: z.string(),
      path: z.string(),
    }),
  )
  .query(async ({ input }) => {
    return (
      (await services.getSingleFolder(input)) ??
      null
    );
  });

export const createFolder = procedure
  .input(
    z.object({
      accountId: z.string(),
      parentPath: z.string(),
      name: z.string(),
    }),
  )
  .mutation(({ input }) => {
    return services.createFolder(input);
  });

export const deleteFolder = procedure
  .input(
    z.object({
      accountId: z.string(),
      path: z.string(),
    }),
  )
  .mutation(({ input }) => {
    return services.deleteFolder(input);
  });

export const renameFolder = procedure
  .input(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  )
  .mutation(({ input }) => {
    return services.renameFolder(input);
  });
