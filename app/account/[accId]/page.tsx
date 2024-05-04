import FileManager from '#/components/file-manager';
import { FileManagerProvider } from '#/components/file-manager/provider';
import Path from '#/components/path';
import Toolbar from '#/components/toolbar';

function Page() {
  return (
    <FileManagerProvider>
      <div className="flex h-full flex-col">
        <Path />
        <Toolbar />
        <FileManager />
      </div>
    </FileManagerProvider>
  );
}

export default Page;
