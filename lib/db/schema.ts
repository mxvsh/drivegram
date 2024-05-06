import { sql } from 'drizzle-orm';
import {
  integer,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  name: text('name'),
  session: text('session').notNull(),
  createdAt: text('createdAt').default(
    sql`(CURRENT_TIMESTAMP)`,
  ),
});

const files = sqliteTable('files', {
  id: integer('id').primaryKey({
    autoIncrement: true,
  }),
  filename: text('filename').notNull(),
  filetype: text('filetype').notNull(),
  size: integer('size').notNull(),
  folderPath: text('folderPath').default(
    sql`'/'`,
  ),
  isBookmarked: integer('isBookmarked', {
    mode: 'boolean',
  }).default(sql`0`),
  isDeleted: integer('isDeleted', {
    mode: 'boolean',
  }).default(sql`0`),
  deletedAt: text('deletedAt'),

  chatId: text('chatId').notNull(),
  fileId: text('fileId').notNull(),
  messageId: text('messageId').notNull(),
  accountId: text('accountId').notNull(),

  createdAt: text('createdAt')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

const folders = sqliteTable('folders', {
  id: integer('id').primaryKey({
    autoIncrement: true,
  }),
  name: text('name').notNull(),
  totalFiles: integer('totalFiles').default(
    sql`0`,
  ),
  totalSize: integer('totalSize').default(sql`0`),
  path: text('path')
    .default(sql`'/'`)
    .notNull(),
  accountId: text('accountId').notNull(),
  parentPath: text('parentPath').default(
    sql`'/'`,
  ),
  isBookmarked: integer('isBookmarked', {
    mode: 'boolean',
  }).default(sql`0`),
  isDeleted: integer('isDeleted', {
    mode: 'boolean',
  }).default(sql`0`),
  deletedAt: text('deletedAt'),
  createdAt: text('createdAt').default(
    sql`(CURRENT_TIMESTAMP)`,
  ),
});

export { accounts, files, folders };

export type Account =
  typeof accounts.$inferSelect;
export type File = typeof files.$inferSelect;
export type Folder = typeof folders.$inferSelect;
