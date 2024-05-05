import ListItems from '#/components/list-items';

import prisma from '#/prisma';

async function Page({
  params,
}: {
  params: { accId: string };
}) {
  const files = await prisma.file.findMany({
    where: {
      isBookmarked: true,
      accountId: params.accId,
    },
  });
  const folders = await prisma.folder.findMany({
    where: {
      isBookmarked: true,
      accountId: params.accId,
    },
  });

  return (
    <ListItems files={files} folders={folders} />
  );
}

export default Page;
