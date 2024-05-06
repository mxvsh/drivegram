import { Config } from 'drizzle-kit';

import { env } from './lib/env';

export default {
  schema: './lib/db/schema.ts',
  out: './migrations',
  driver: 'turso',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
