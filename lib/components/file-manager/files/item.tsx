'use client';

import {
  BookmarkIcon,
  CodeSquareIcon,
  CopyIcon,
  DownloadIcon,
  Edit2Icon,
  ExternalLinkIcon,
  FileIcon,
  ImageIcon,
  InfoIcon,
  TextIcon,
  TrashIcon,
  VideoIcon,
} from 'lucide-react';

import React, { useMemo, useState } from 'react';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '#/lib/components/ui/context-menu';
import type { File } from '#/lib/db/schema';

const icons: Record<string, React.ElementType> = {
  default: FileIcon,
  image: ImageIcon,
  video: VideoIcon,
  pdf: TextIcon,
  text: TextIcon,
  application: CodeSquareIcon,
};

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

  const Icon = useMemo(() => {
    const iconKeys = Object.keys(icons);
    const type = iconKeys.find((key) =>
      file.filetype.match(key),
    );
    return icons[type ?? 'default'];
  }, [file]);

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
          className={`relative flex h-28 select-none flex-col items-center justify-center gap-3 rounded-lg px-2
            ${
              isSelected
                ? 'bg-gray-100'
                : isRightClicked
                  ? 'bg-gray-100'
                  : 'bg-transparent hover:bg-gray-50'
            }`}
          onClick={(ev) => {
            ev.stopPropagation();
            onSelect?.();
          }}
        >
          <Icon size={32} />

          <h1 className="line-clamp-2 text-center">
            {file.filename}
          </h1>

          {file.isBookmarked && (
            <BookmarkIcon
              className="fill-primary text-primary absolute right-2 top-2"
              size={15}
            />
          )}
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

        <ContextMenuItem
          className="gap-2"
          onClick={(ev) => {
            ev.preventDefault();
          }}
        >
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
