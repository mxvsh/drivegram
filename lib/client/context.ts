import { createContext, useContext } from 'react';
import { TelegramClient } from 'telegram';

export const clientContext = createContext(
  {} as TelegramClient,
);

export const useTelegramClient = () =>
  useContext(clientContext);
