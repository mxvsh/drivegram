import { cleanEnv, num, str } from 'envalid';

export const env = cleanEnv(process.env, {
	DATABASE_URL: str(),
	NEXT_PUBLIC_TELEGRAM_API_ID: num({
		default: 0,
	}),
	NEXT_PUBLIC_TELEGRAM_API_HASH: str({
		default: '',
	}),
});
