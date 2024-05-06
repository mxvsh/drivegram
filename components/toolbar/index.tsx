'use client';

import {
  BookmarkIcon,
  DownloadIcon,
  EditIcon,
  FilePlusIcon,
  TrashIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { useEffect, useState } from 'react';

import { Button } from '#/components/ui/button';

import { trpc } from '#/lib/trpc/client';

import { useTelegramClient } from '../client/context';
import { useFileManager } from '../file-manager/context';
import Folder from './folder';
import RenameModal from './rename';
import UploadModal from './upload';

function Toolbar() {
  const client = useTelegramClient();
  const toggleBookmarkFile =
    trpc.toggleBookmarkFile.useMutation();
  const deleteFile =
    trpc.deleteFile.useMutation();

  const [isDeleting, setIsDeleting] =
    useState(false);

  const {
    selectedFile,
    selectedFolder,
    setSelectedFile,
    refetch,
  } = useFileManager();

  const isSelected = Boolean(
    selectedFile || selectedFolder,
  );

  const [isBookmarked, setIsBookmarked] =
    useState(false);

  useEffect(() => {
    if (selectedFile) {
      setIsBookmarked(selectedFile.isBookmarked);
    } else {
      setIsBookmarked(false);
    }
  }, [selectedFile]);

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
        isLoading={toggleBookmarkFile.isLoading}
        onClick={() => {
          if (selectedFile) {
            toggleBookmarkFile
              .mutateAsync(selectedFile.id)
              .then((res) => {
                refetch();
                setIsBookmarked(res);
              });
          }
        }}
      >
        {isBookmarked ? 'Unbookmark' : 'Bookmark'}
      </Button>
      <Button
        icon={<DownloadIcon size={18} />}
        variant="ghost"
        size="sm"
        disabled={!isSelected}
      >
        Download
      </Button>

      <RenameModal
        isSelected={isSelected}
        type={selectedFile ? 'file' : 'folder'}
      />
      <Button
        icon={<TrashIcon size={18} />}
        variant="ghost"
        size="sm"
        disabled={!isSelected || isDeleting}
        isLoading={isDeleting}
        onClick={async () => {
          if (selectedFile) {
            setIsDeleting(true);
            client
              .deleteMessages(
                'me',
                [
                  parseInt(
                    selectedFile.messageId,
                  ),
                ],
                {
                  revoke: true,
                },
              )
              .then(() => {
                deleteFile
                  .mutateAsync(selectedFile.id)
                  .then(() => {
                    refetch();
                    setSelectedFile(null);
                    toast.success('File deleted');
                    setIsDeleting(false);
                  });
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
