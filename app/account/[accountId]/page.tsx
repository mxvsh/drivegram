import ListItems from '#/lib/components/file-manager/list';
import Path from '#/lib/components/file-manager/path';
import Toolbar from '#/lib/components/file-manager/toolbar';
import { FileManagerProvider } from '#/lib/file-manager';

function Page() {
  return (
    <FileManagerProvider>
      <div className="flex h-full flex-col">
        <Path />
        <Toolbar />
        <ListItems />
      </div>
    </FileManagerProvider>
  );
}

export default Page;
