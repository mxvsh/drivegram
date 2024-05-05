'use client';

import {
  BookmarkIcon,
  DownloadIcon,
  EditIcon,
  FilePlusIcon,
  TrashIcon,
} from 'lucide-react';

import { Button } from '#/components/ui/button';

import { trpc } from '#/lib/trpc/client';

import { useFileManager } from '../file-manager/context';
import Folder from './folder';
import UploadModal from './upload';

function Toolbar() {
  const deleteFile =
    trpc.deleteFile.useMutation();

  const {
    selectedFile,
    selectedFolder,
    setSelectedFile,
    refetch,
  } = useFileManager();

  const isSelected = Boolean(
    selectedFile || selectedFolder,
  );

  return (
    <div className="flex select-none items-center border-b p-1">
      <Button
        icon={<FilePlusIcon size={18} />}
        variant="ghost"
        size="sm"
        disabled
      >
        Add File
      </Button>

      <Folder />

      <UploadModal />
      <div className="mx-2 h-6 w-0.5 border-l" />
      <Button
        icon={<BookmarkIcon size={18} />}
        variant="ghost"
        size="sm"
        disabled={!isSelected}
      >
        Bookmark
      </Button>
      <Button
        icon={<DownloadIcon size={18} />}
        variant="ghost"
        size="sm"
        disabled={!isSelected}
      >
        Download
      </Button>
      <Button
        icon={<EditIcon size={18} />}
        variant="ghost"
        size="sm"
        disabled={!isSelected}
      >
        Rename
      </Button>
      <Button
        icon={<TrashIcon size={18} />}
        variant="ghost"
        size="sm"
        disabled={!isSelected}
        isLoading={deleteFile.isLoading}
        onClick={() => {
          if (selectedFile) {
            deleteFile
              .mutateAsync(selectedFile.id)
              .then(() => {
                refetch();
                setSelectedFile(null);
              });
          }
        }}
      >
        Delete
      </Button>
    </div>
  );
}

export default Toolbar;
