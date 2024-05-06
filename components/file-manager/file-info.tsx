import {
  DownloadIcon,
  TrashIcon,
  XIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { useParams } from 'next/navigation';

import { File } from '@prisma/client';

import { useTelegramClient } from '../client/context';
import { Button } from '../ui/button';
import MoveToTrash from './move-to-trash';

function FileInfo({
  file,
  onClose,
}: {
  file: File;
  onClose: () => void;
}) {
  const params = useParams();
  const client = useTelegramClient();

  async function handleDownload() {
    const loadingId = toast.loading(
      'Downloading file',
    );
    const result = await client.getMessages(
      'me',
      {
        ids: parseInt(file.messageId),
      },
    );
    if (result.length > 0) {
      const message = result[0];
      if (message === undefined) {
        toast.dismiss(loadingId);
        toast.error('Message not found');
        return;
      }

      const buffer = await client.downloadMedia(
        message,
        {
          progressCallback: (progress) => {
            console.log('progress', progress);
            // toast.message(
            //   (progress * 100).toFixed(2),
            //   {
            //     id: loadingId,
            //   },
            // );
          },
        },
      );

      if (buffer) {
        const blob = new Blob([buffer], {
          type: file.filetype,
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', file.filename);

        a.click();
        URL.revokeObjectURL(url);

        toast.dismiss(loadingId);
        toast.success('File downloaded');
      } else {
        toast.dismiss(loadingId);
        toast.error('Message not found');
      }
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between gap-6 border-b bg-white px-4">
        <h1 className="line-clamp-2 font-semibold">
          {file.filename}
        </h1>
        <XIcon
          size={20}
          onClick={() => onClose()}
        />
      </div>
      <div className="flex-1 space-y-2 overflow-auto">
        <div className="space-y-4 p-4">
          <div>
            <h1 className="text-xs uppercase text-gray-500">
              File Size
            </h1>
            <span className="mt-1 font-semibold">
              {(file.size / 1024).toFixed(2)} KB
            </span>
          </div>
          <div>
            <h1 className="text-xs uppercase text-gray-500">
              File Type
            </h1>
            <span className="mt-1 font-semibold">
              {file.filetype}
            </span>
          </div>
          <div>
            <h1 className="text-xs uppercase text-gray-500">
              Upload Date
            </h1>
            <span className="mt-1 font-semibold">
              {new Date(
                file.createdAt,
              ).toDateString()}
            </span>
          </div>
          <div>
            <h1 className="text-xs uppercase text-gray-500">
              Message ID
            </h1>
            <span className="mt-1 font-semibold">
              {file.messageId}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 border-t bg-white p-2">
        <Button
          icon={<DownloadIcon size={20} />}
          size="sm"
          onClick={handleDownload}
        >
          Download
        </Button>
        <MoveToTrash
          fileId={file.id}
          onSuccess={onClose}
        >
          <Button
            icon={<TrashIcon size={20} />}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Move to Trash
          </Button>
        </MoveToTrash>
      </div>
    </div>
  );
}

export default FileInfo;
