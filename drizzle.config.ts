import { Config } from 'drizzle-kit';

export default {
	schema: './lib/db/schema.ts',
	out: './migrations',
	driver: 'turso',
	dbCredentials: {
		url: 'file:./db.sqlite',
	},
} satisfies Config;
