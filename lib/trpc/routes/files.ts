import { z } from 'zod';

import { getClient } from '#/lib/client';
import prisma from '#/prisma';

import { procedure } from '../trpc';

export const getFolders = procedure
  .input(
    z.object({
      accountId: z.string(),
      path: z.string().optional(),
    }),
  )
  .query(async ({ input }) => {
    return prisma.folder.findMany({
      where: {
        parentPath: input.path ?? '/',
        isDeleted: false,
        accountId: input.accountId,
      },
    });
  });

export const getFolderDetails = procedure
  .input(
    z.object({
      accountId: z.string(),
      folderPath: z.string().optional(),
    }),
  )
  .query(async ({ input }) => {
    return prisma.folder.findFirst({
      where: {
        accountId: input.accountId,
        path: input.folderPath,
      },
    });
  });

export const getFiles = procedure
  .input(
    z.object({
      accountId: z.string(),
      path: z.string().optional(),
    }),
  )
  .query(async ({ input }) => {
    return prisma.file.findMany({
      where: {
        accountId: input.accountId,
        folderPath: input.path ?? '/',
        isDeleted: false,
      },
      orderBy: {
        filename: 'asc',
      },
    });
  });

export const createFolder = procedure
  .input(
    z.object({
      name: z.string(),
      accountId: z.string(),
      path: z.string().optional(),
    }),
  )
  .mutation(async ({ input }) => {
    const parent = await prisma.folder.findFirst({
      where: {
        path: input.path ?? null,
      },
    });
    return prisma.folder.create({
      data: {
        accountId: input.accountId,
        name: input.name,
        parentId: parent?.id ?? null,
        path:
          parent?.path === '/'
            ? `/${input.name}`
            : `${parent?.path ?? ''}/${input.name}`,
        parentPath: parent?.path ?? '/',
      },
    });
  });

export const createFile = procedure
  .input(
    z.object({
      filename: z.string(),
      filetype: z.string(),
      size: z.number(),
      path: z.string(),
      accountId: z.string(),
      fileId: z.string(),
      chatId: z.string(),
      messageId: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    return prisma.file.create({
      data: {
        accountId: input.accountId,
        filename: input.filename,
        filetype: input.filetype,
        folderPath: input.path,
        chatId: input.chatId,
        messageId: input.messageId,
        fileId: input.fileId,
        size: input.size,
      },
    });
  });

export const moveToTrash = procedure
  .input(
    z.object({
      id: z.number(),
      type: z.enum(['file', 'folder']),
    }),
  )
  .mutation(async ({ input }) => {
    if (input.type === 'file') {
      return prisma.file.update({
        where: {
          id: input.id,
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
    }

    return prisma.folder.update({
      where: {
        id: input.id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  });

export const restore = procedure
  .input(
    z.object({
      id: z.number(),
      type: z.enum(['file', 'folder']),
    }),
  )
  .mutation(async ({ input }) => {
    if (input.type === 'file') {
      return prisma.file.update({
        where: {
          id: input.id,
        },
        data: {
          isDeleted: false,
          deletedAt: null,
        },
      });
    }

    return prisma.folder.update({
      where: {
        id: input.id,
      },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });
  });

export const deleteFile = procedure
  .input(z.number())
  .mutation(async ({ input }) => {
    return prisma.file.delete({
      where: {
        id: input,
      },
    });
  });

export const deleteFolder = procedure
  .input(z.number())
  .mutation(async ({ input }) => {
    return prisma.folder.delete({
      where: {
        id: input,
      },
    });
  });

export const toggleBookmarkFile = procedure
  .input(z.number())
  .mutation(async ({ input }) => {
    const file = await prisma.file.findFirst({
      where: {
        id: input,
      },
      select: { isBookmarked: true },
    });

    if (!file) return false;

    await prisma.file.update({
      where: {
        id: input,
      },
      data: {
        isBookmarked: !file.isBookmarked,
      },
    });

    return !file.isBookmarked;
  });
