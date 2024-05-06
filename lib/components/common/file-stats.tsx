import prettyBytes from 'pretty-bytes';

import { Card } from '../ui/card';

function FileStats({
  totalFiles,
  totalSize,
}: {
  totalFiles: number;
  totalSize: number;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm uppercase text-black/50">
        File Stats
      </p>
      <Card className="p-4">
        <h1 className="font-semibold">
          Total Files
        </h1>
        <p className="text-gray-500">
          {totalFiles} file
          {totalFiles > 1 ? 's' : ''}
        </p>
      </Card>
      <Card className="p-4">
        <h1 className="font-semibold">
          Size Used
        </h1>
        <p className="text-gray-500">
          {prettyBytes(totalSize) || 0}
        </p>
      </Card>
    </div>
  );
}

export default FileStats;
