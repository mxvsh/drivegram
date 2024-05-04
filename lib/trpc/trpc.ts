import { initTRPC } from '@trpc/server';

import { Context } from './context';

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware((opts) => {
  const { ctx } = opts;

  if (!ctx.session) {
    throw new Error('Not authorized');
  }

  return opts.next({
    ctx,
  });
});

export const router = t.router;
export const procedure = t.procedure;
export const protectedProcedure =
  t.procedure.use(isAuthed);
