import { cleanEnv, num, str } from 'envalid';

export const env = cleanEnv(process.env, {
  TELEGRAM_API_ID: num(),
  TELEGRAM_API_HASH: str(),
});
