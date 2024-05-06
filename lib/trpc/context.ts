import trpc from '@trpc/server';

export async function createContext() {
  return {};
}

export type Context = trpc.inferAsyncReturnType<
  typeof createContext
>;
