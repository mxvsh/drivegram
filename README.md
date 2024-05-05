# DriveGram - Cloud Drive based on Telegram

> [!NOTE]
> This project is still under development.

DriveGram is a personal cloud storage application that uses Telegram as a drive.

![Group 2](https://github.com/mxvsh/drivegram/assets/31907722/0590e2d3-641a-4b50-8020-a909182d22ad)


## Features

- 📁 Organize files/folders
- 📤 Upload/Download files
- 🔖 Bookmark files
- 🗑️ Trash files

## Planned Features

- [ ] Share files
- [ ] Search files
- [ ] File preview
- [ ] File encryption
- [ ] File compression
- [ ] Link Google Drive
- [ ] Generate shareable link
- [ ] Custom chat for files

## Installation

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
DATABASE_URL=postgresql://username:password@localhost:5432/drivegram
```

### Run Locally

```bash
git clone git@github.com:mxvsh/drivegram.git
cd drivegram
bun install
bun run build
bun start
```
