import { NextApiResponse } from 'next';
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { getClient } from '#/lib/client';
import prisma from '#/prisma';

export async function POST(
  req: NextRequest,
  res: NextApiResponse,
) {
  const { messageId, accountId } =
    await req.json();

  const file = await prisma.file.findFirst({
    where: {
      messageId,
    },
  });

  if (!file) {
    return Response.json({
      error: 'File not found',
    });
  }

  const client = await getClient(accountId);
  const result = await client.getMessages('me', {
    ids: parseInt(messageId),
  });
  if (result.length > 0) {
    const message = result[0];
    if (!message.media) {
      return Response.json({
        error: 'Message has no media',
      });
    }

    const buffer =
      await client.downloadMedia(message);

    return new Response(buffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${file.filename}"`,
        'Content-Type': file.filetype,
      },
    });
  } else {
    return Response.json({
      error: 'Message not found',
    });
  }
}
