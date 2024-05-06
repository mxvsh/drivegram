import { and, eq } from 'drizzle-orm';

import db from '../db';
import { folders } from '../db/schema';

type GetFolderInput = {
  accountId: string;
  path?: string;
};
export function getFolders(
  input: GetFolderInput,
) {
  return db.query.folders.findMany({
    where(fields, operators) {
      return operators.and(
        operators.eq(
          fields.accountId,
          input.accountId,
        ),
        operators.eq(
          fields.parentPath,
          input.path ?? '/',
        ),
      );
    },
    orderBy(fields, operators) {
      return operators.asc(fields.name);
    },
  });
}

type GetSingleFolderInput = {
  accountId: string;
  path: string;
};
export function getSingleFolder(
  input: GetSingleFolderInput,
) {
  return db.query.folders.findFirst({
    where(fields, operators) {
      return operators.and(
        operators.eq(
          fields.accountId,
          input.accountId,
        ),
        operators.eq(fields.path, input.path),
      );
    },
  });
}

type CreateFolderInput = {
  accountId: string;
  parentPath: string;
  name: string;
};
export function createFolder(
  input: CreateFolderInput,
) {
  return db
    .insert(folders)
    .values({
      name: input.name,
      accountId: input.accountId,
      parentPath: input.parentPath,
      path:
        input.parentPath === '/'
          ? `/${input.name}`
          : `${input.parentPath}/${input.name}`,
    })
    .returning({ id: folders.id });
}

type DeleteFolderInput = {
  accountId: string;
  path: string;
};
export function deleteFolder(
  input: DeleteFolderInput,
) {
  return db
    .delete(folders)
    .where(
      and(
        eq(folders.accountId, input.accountId),
        eq(folders.path, input.path),
      ),
    )
    .returning({ id: folders.id });
}

type RenameFolderInput = {
  id: number;
  name: string;
};
export async function renameFolder(
  input: RenameFolderInput,
) {
  const folder = await db.query.folders.findFirst(
    {
      where(fields, operators) {
        return operators.eq(fields.id, input.id);
      },
    },
  );
  if (!folder) {
    return null;
  }

  return db
    .update(folders)
    .set({
      name: input.name,
      path:
        folder.parentPath === '/'
          ? `/${input.name}`
          : `${folder.parentPath}/${input.name}`,
    })
    .where(eq(folders.id, input.id))
    .returning({ name: folders.name });
}
