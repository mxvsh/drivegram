import { eq } from 'drizzle-orm';
import { z } from 'zod';

import db from '../db';
import { files } from '../db/schema';

type GetFilesInput = {
  accountId: string;
  folderPath: string;
};
export function getFiles(input: GetFilesInput) {
  const files = db.query.files.findMany({
    where(fields, operators) {
      return operators.and(
        operators.eq(
          fields.accountId,
          input.accountId,
        ),
        operators.eq(
          fields.folderPath,
          input.folderPath,
        ),
      );
    },
    orderBy(fields, operators) {
      return operators.asc(fields.filename);
    },
  });
  return files;
}

type GetSingleFileInput = {
  id: number;
};
export function getSingleFile(
  input: GetSingleFileInput,
) {
  const file = db.query.files.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, input.id);
    },
  });
  return file;
}

export const CreateFileDTO = z.object({
  filename: z.string(),
  filetype: z.string(),
  size: z.number(),
  folderPath: z.string(),
  accountId: z.string(),
  fileId: z.string(),
  chatId: z.string(),
  messageId: z.string(),
});
type CreateFileInput = z.infer<
  typeof CreateFileDTO
>;
export async function createFile(
  input: CreateFileInput,
) {
  const file = await db
    .insert(files)
    .values(input);
  return file;
}

export function deleteFile(id: number) {
  return db.delete(files).where(eq(files.id, id));
}

export async function toggleBookmarkFile(
  id: number,
) {
  const file = await db.query.files.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!file) {
    return null;
  }

  return db
    .update(files)
    .set({ isBookmarked: !file.isBookmarked })
    .where(eq(files.id, id))
    .returning({
      isBookmarked: files.isBookmarked,
    })
    .then((res) => res[0].isBookmarked ?? null);
}

type RenameFileInput = {
  id: number;
  name: string;
};
export function renameFile(
  input: RenameFileInput,
) {
  return db
    .update(files)
    .set({
      filename: input.name,
    })
    .where(eq(files.id, input.id))
    .returning({ filename: files.filename });
}

export function getBookmarkedFiles(
  accountId: string,
) {
  return db.query.files.findMany({
    where(fields, operators) {
      return operators.and(
        operators.eq(fields.accountId, accountId),
        operators.eq(fields.isBookmarked, true),
      );
    },
  });
}

export function getTrashFiles(accountId: string) {
  return db.query.files.findMany({
    where(fields, operators) {
      return operators.and(
        operators.eq(fields.accountId, accountId),
        operators.eq(fields.isDeleted, true),
      );
    },
  });
}

export async function getFileStats(
  accountId: string,
) {
  const files = await db.query.files.findMany({
    where(fields, operators) {
      return operators.eq(
        fields.accountId,
        accountId,
      );
    },
    columns: {
      size: true,
    },
  });

  const totalSize: number = files
    .map((file) => file.size)
    .reduce((acc, size) => acc + size, 0);
  return {
    totalFiles: files.length,
    totalSize,
  };
}
