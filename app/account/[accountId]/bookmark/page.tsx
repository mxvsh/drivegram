import FileItem from '#/lib/components/file-manager/files/item';
import { getBookmarkedFiles } from '#/lib/services/files';

async function Page({
  params,
}: {
  params: {
    accountId: string;
  };
}) {
  const files = await getBookmarkedFiles(
    params.accountId,
  );

  if (!files.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">
            No items to show
          </p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="grid h-full flex-1 grid-cols-4 content-start justify-evenly gap-1 overflow-auto p-2 lg:grid-cols-6 2xl:grid-cols-8">
        {files.map((file) => (
          <FileItem key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}

export default Page;
