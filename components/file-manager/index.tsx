'use client';

import { AnimatePresence } from 'framer-motion';

import React from 'react';

import { useRouter } from 'next/navigation';

import { useFileManager } from './context';
import FileInfo from './file-info';
import FileItem from './file-item';
import FolderInfo from './folder-info';
import FolderItem from './folder-item';
import ItemLoader from './loader';

function formatDate<T>(
  data: Record<string, any>,
): T {
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  } as T;
}

function FileManager() {
  const r = useRouter();

  const {
    files,
    folders,
    isLoading,
    selectedFile,
    setSelectedFile,
    selectedFolder,
    setSelectedFolder,
  } = useFileManager();

  const noItems =
    !folders?.length && !files?.length;

  return (
    <AnimatePresence>
      <div className="flex flex-1 items-start overflow-hidden">
        {isLoading ? (
          <div className="grid h-full flex-1 grid-cols-3 content-start gap-4 overflow-hidden p-4 2xl:grid-cols-5">
            <ItemLoader count={20} />
          </div>
        ) : noItems ? (
          <div className="flex h-full flex-1 items-center justify-center">
            <span>No items found</span>
          </div>
        ) : (
          <div
            className="grid h-full flex-1 grid-cols-3 content-start justify-evenly gap-1 overflow-auto p-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
            onClick={() => {
              setSelectedFile(null);
              setSelectedFolder(null);
            }}
          >
            {folders.map((folder) => (
              <FolderItem
                key={folder.id}
                folder={formatDate(folder)}
                isSelected={
                  folder.id === selectedFolder?.id
                }
                onSelect={() => {
                  setSelectedFolder(folder);
                  setSelectedFile(null);
                }}
                onDoubleClick={() => {
                  const url = new URL(
                    window.location.href,
                  );
                  url.searchParams.set(
                    'path',
                    folder.path ?? '/',
                  );
                  r.push(url.toString());
                }}
              />
            ))}

            {files.map((file) => (
              <FileItem
                file={file}
                key={file.id}
                isSelected={
                  file.id === selectedFile?.id
                }
                onSelect={() => {
                  setSelectedFile(file);
                  setSelectedFolder(null);
                }}
              />
            ))}
          </div>
        )}

        <div className="h-full w-[25%] border-l bg-muted">
          {selectedFile ? (
            <FileInfo
              file={selectedFile}
              onClose={() =>
                setSelectedFile(null)
              }
            />
          ) : selectedFolder ? (
            <FolderInfo
              folder={selectedFolder}
              onClose={() =>
                setSelectedFolder(null)
              }
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span>No file selected</span>
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}

export default FileManager;
