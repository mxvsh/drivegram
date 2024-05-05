'use client';

import {
  CopyIcon,
  DownloadIcon,
  EditIcon,
  FilePlusIcon,
  MoveIcon,
  TrashIcon,
} from 'lucide-react';

import { Button } from '#/components/ui/button';

import { useFileManager } from '../file-manager/context';
import Folder from './folder';
import UploadModal from './upload';

function Toolbar() {
  const { selectedFile, selectedFolder } =
    useFileManager();

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
        icon={<CopyIcon size={18} />}
        variant="ghost"
        size="sm"
        disabled={!isSelected}
      >
        Copy
      </Button>
      <Button
        icon={<MoveIcon size={18} />}
        variant="ghost"
        size="sm"
        disabled={!isSelected}
      >
        Move
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
      >
        Delete
      </Button>
    </div>
  );
}

export default Toolbar;
