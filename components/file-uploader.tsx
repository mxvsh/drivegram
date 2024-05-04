import { FileIcon } from 'lucide-react';

import { Button } from './ui/button';
import { Card } from './ui/card';

function MiniFileUploader() {
  return (
    <Card className="flex flex-col items-center justify-center gap-2 px-2 py-8">
      <FileIcon size={30} />
      <div>
        <h1 className="text-md text-center font-semibold">
          Upload Files
        </h1>
        <p className="text-center text-sm text-gray-500">
          Drag and drop files here
        </p>
      </div>
      <Button size="xs" variant={'outline'}>
        Choose file
      </Button>
    </Card>
  );
}

export default MiniFileUploader;
