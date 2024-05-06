'use client';

import {
  BookmarkIcon,
  DownloadIcon,
  FilePlusIcon,
  TrashIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { useTelegramClient } from '#/lib/client/context';
import { Button } from '#/lib/components/ui/button';
import { useFileManager } from '#/lib/file-manager';
import { trpc } from '#/lib/trpc/client';

import Folder from './create-folder';
import RenameModal from './rename';
import UploadModal from './upload-file';

function Toolbar() {
  const params = useParams();
  const client = useTelegramClient();
  const toggleBookmarkFile =
    trpc.toggleBookmarkFile.useMutation();
  const deleteFile =
    trpc.deleteFile.useMutation();
  const deleteFolder =
    trpc.deleteFolder.useMutation();

  const [isDeleting, setIsDeleting] =
    useState(false);

  const {
    selectedFile,
    selectedFolder,
    setSelectedFile,
    setSelectedFolder,
    refetch,
  } = useFileManager();

  const isSelected = Boolean(
    selectedFile || selectedFolder,
  );

  const [isBookmarked, setIsBookmarked] =
    useState(false);

  useEffect(() => {
    if (selectedFile) {
      setIsBookmarked(
        Boolean(selectedFile.isBookmarked),
      );
    } else {
      setIsBookmarked(false);
    }
  }, [selectedFile]);

  const accountId = params.accountId as string;

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
        disabled={!selectedFile}
        isLoading={toggleBookmarkFile.isLoading}
        onClick={() => {
          if (selectedFile) {
            toggleBookmarkFile
              .mutateAsync(selectedFile.id)
              .then((res) => {
                refetch();
                setIsBookmarked(Boolean(res));
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
          // todo: add confirmation dialog
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
          } else if (selectedFolder) {
            setIsDeleting(true);
            deleteFolder
              .mutateAsync({
                accountId,
                path: selectedFolder.path,
              })
              .then(() => {
                refetch();
                setIsDeleting(false);
                setSelectedFolder(null);
                toast.success('Folder deleted');
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
