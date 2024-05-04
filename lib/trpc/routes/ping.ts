import { procedure } from '../trpc';

export const ping = procedure.query(() => 'pong');
