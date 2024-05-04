import trpc from '@trpc/server';

// import { auth } from '#/lib/auth';
import prisma from '#/prisma';

export async function createContext() {
  // const session = await auth();

  return {
    prisma,
    session: null,
  };
}

export type Context = trpc.inferAsyncReturnType<
  typeof createContext
>;
