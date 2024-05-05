import { Api } from 'telegram';
import { CustomFile } from 'telegram/client/uploads';

import { getClient } from '#/lib/client';
import prisma from '#/prisma';

export async function POST(req: Request) {
  const client = await getClient();
  const form = await req.formData();

  const file = form.get('file') as File;
  const buffer = await file.arrayBuffer();

  const accountId = form.get(
    'accountId',
  ) as string;

  const toUpload = new CustomFile(
    file.name,
    file.size,
    '',
    Buffer.from(buffer),
  );

  const res = await client.sendFile('me', {
    file: toUpload,
    forceDocument: true,
  });

  const peer = res.peerId as Api.PeerUser;
  const chatId = peer.userId.valueOf().toString();
  const msgId = res.id.toString();

  await prisma.file.create({
    data: {
      filename: file.name,
      size: file.size,
      filetype: file.type,
      folderPath: form.get('path') as string,
      chatId,
      messageId: msgId,
      fileId: res.id.toString(),
      accountId,
    },
  });

  const folder = await prisma.folder.findFirst({
    where: { path: form.get('path') as string },
    select: {
      id: true,
      totalFiles: true,
      totalSize: true,
    },
  });

  if (folder)
    await prisma.folder.update({
      where: { id: folder.id },
      data: {
        totalFiles: (folder.totalFiles || 0) + 1,
        totalSize:
          (folder.totalSize || 0) + file.size,
      },
    });

  return Response.json({ ok: true });
}
