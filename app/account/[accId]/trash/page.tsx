import ListItems from '#/components/list-items';

import prisma from '#/prisma';

async function Page() {
  const files = await prisma.file.findMany({
    where: { isDeleted: true },
  });
  const folders = await prisma.folder.findMany({
    where: { isDeleted: true },
  });

  return (
    <ListItems files={files} folders={folders} />
  );
}

export default Page;
