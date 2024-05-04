import * as routes from './routes';
import { router } from './trpc';

export const appRouter = router(routes);

export type AppRouter = typeof appRouter;
