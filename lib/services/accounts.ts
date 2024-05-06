import { eq } from 'drizzle-orm';

import db from '../db';
import { accounts } from '../db/schema';

type SaveSessionInput = {
  session: string;
  accountId: string;
  accountName: string;
};
export async function saveSession(
  input: SaveSessionInput,
) {
  const exist = await db.query.accounts.findFirst(
    {
      where(fields, operators) {
        return operators.eq(
          fields.id,
          input.accountId,
        );
      },
    },
  );
  if (!exist) {
    const data = await db
      .insert(accounts)
      .values({
        id: input.accountId,
        session: input.session,
        name: input.accountName,
      })
      .returning({ id: accounts.id });
    return data;
  }

  const data = await db
    .update(accounts)
    .set({ session: input.session })
    .where(eq(accounts.id, input.accountId))
    .returning({ id: accounts.id });

  console.log(data);
  return data;
}

export function getAccounts() {
  return db.query.accounts.findMany();
}

type GetSingleAccountInput = {
  id: string;
};
export function getSingleAccount({
  id,
}: GetSingleAccountInput) {
  return db.query.accounts.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });
}
