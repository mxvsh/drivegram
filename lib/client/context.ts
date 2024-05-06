import { TelegramClient } from 'telegram';

import { createContext, useContext } from 'react';

export const clientContext = createContext(
  {} as TelegramClient,
);

export const useTelegramClient = () =>
  useContext(clientContext);
