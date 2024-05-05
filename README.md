# drivegram

> [!WARNING]
> This project is still under development.

DriveGram is a personal cloud storage application that uses Telegram as a drive.

![image](https://github.com/mxvsh/drivegram/assets/31907722/1706e7f1-9a8e-4ec2-8eb0-3c7d1c136090)

## Features

- Upload files to Telegram
- Download files from Telegram
- Create folders/files
- Bookmark files
- Trash files

## Planned Features

- Share files
- Search files
- File preview
- File encryption
- File compression
- Link Google Drive
- Generate shareable link

## Installation

Right now, you can run the project locally by following the steps below.

> [!NOTE]
> Docker file and docker-compose file will be added soon.

### Environment Variables

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
