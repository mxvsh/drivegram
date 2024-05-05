# DriveGram - Cloud Drive based on Telegram

> [!NOTE]
> This project is still under development.

DriveGram is a personal cloud storage application that uses Telegram as a drive.

![Group 2](https://github.com/mxvsh/drivegram/assets/31907722/0590e2d3-641a-4b50-8020-a909182d22ad)

Run on your local machine without any external dependencies. You just need to create a Telegram application and get the API ID and API Hash from [my.telegram.org](https://my.telegram.org).

## Features

- ✨ Clean UI
- 📁 Organize your content
- 📤 Upload/download files
- 🔖 Bookmark files
- 🗑️ Move to trash
- 📱 Multiple accounts

## Roadmap

- [ ] Search files
- [ ] File preview
- [ ] Link Google Drive
- [ ] Generate shareable link
- [ ] Custom chat for uploading files

## 🚀 Installation

Right now, you can run the project locally by following the steps below.

> [!NOTE]
> Docker file and docker-compose file will be added soon.

### Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables.

```bash
# Telegram
TELEGRAM_API_ID=
TELEGRAM_API_HASH=
# Database
DATABASE_URL=file:./drivegram.sqlite
```

If you want to use a different database, you can change the provider in the `schema.prisma` file, and use the `DATABASE_URL` environment variable.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Run Production Server

```bash
git clone git@github.com:mxvsh/drivegram.git
cd drivegram
bun install
bun run build
bun start
```
