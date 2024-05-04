'use client';

import {
  CopyIcon,
  DownloadIcon,
  Edit2Icon,
  ExternalLinkIcon,
  FileIcon,
  InfoIcon,
  TrashIcon,
} from 'lucide-react';

import React, { useState } from 'react';

import { File } from '@prisma/client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '#/components/ui/context-menu';

function FileItem({
  file,
  onSelect,
  isSelected,
}: {
  file: File;
  isSelected?: boolean;
  onSelect?(): void;
}) {
  const [isRightClicked, setIsRightClicked] =
    useState(false);

  return (
    <ContextMenu
      onOpenChange={(isOpen) => {
        if (isOpen) {
          setIsRightClicked(true);
        } else {
          setIsRightClicked(false);
        }
      }}
    >
      <ContextMenuTrigger>
        <div
          className={`flex h-28 select-none flex-col items-center justify-center gap-3 rounded-lg px-2
            ${
              isSelected
                ? 'bg-gray-100'
                : isRightClicked
                  ? 'bg-gray-100'
                  : 'bg-transparent hover:bg-gray-50'
            }`}
          onClick={() => {
            onSelect?.();
          }}
        >
          <FileIcon size={30} />

          <h1 className="line-clamp-2 text-center">
            {file.filename}
          </h1>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem className="gap-2">
          <ExternalLinkIcon size={16} />
          Open with
        </ContextMenuItem>
        <ContextMenuItem className="gap-2">
          <DownloadIcon size={16} />
          Download
        </ContextMenuItem>
        <ContextMenuItem className="gap-2">
          <TrashIcon size={16} />
          Move to Trash
        </ContextMenuItem>
        <ContextMenuItem className="gap-2">
          <InfoIcon size={16} />
          File Information
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>
            Organize
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>
              Move to
            </ContextMenuItem>
            <ContextMenuItem>
              Add to Bookmark
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>
              Hide
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem className="gap-2">
          <Edit2Icon size={16} />
          Rename
        </ContextMenuItem>
        <ContextMenuItem className="gap-2">
          <CopyIcon size={16} />
          Make a copy
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default FileItem;
