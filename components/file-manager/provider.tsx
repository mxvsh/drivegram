'use client';

import { useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { File, Folder } from '@prisma/client';

import { trpc } from '#/lib/trpc/client';

import { fileManagerContext } from './context';

export const FileManagerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const searchParams = useSearchParams();
  const path = searchParams.get('path') ?? '/';

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);
  const [selectedFolder, setSelectedFolder] =
    useState<Folder | null>(null);

  const {
    data: currentFolder,
    refetch: refetchCurrentFolder,
  } = trpc.getFolderDetails.useQuery(
    {
      folderPath: path,
    },
    {
      enabled: path !== '/',
    },
  );

  const {
    data: folders,
    isLoading: foldersLoading,
    refetch: refetchFolders,
  } = trpc.getFolders.useQuery({
    path,
  });

  const {
    data: files,
    isLoading: filesLoading,
    refetch: refetchFiles,
  } = trpc.getFiles.useQuery({
    path,
  });

  return (
    <fileManagerContext.Provider
      value={{
        // @ts-ignore
        files: files ?? [],
        // @ts-ignore
        folders: folders ?? [],
        // @ts-ignore
        currentFolder,
        isLoading: foldersLoading || filesLoading,
        selectedFile: selectedFile,
        selectedFolder: selectedFolder,
        setSelectedFile: (file: File) => {
          setSelectedFile(file);
        },
        setSelectedFolder: (folder: Folder) => {
          setSelectedFolder(folder);
        },
        refetch: () => {
          refetchCurrentFolder();
          refetchFolders();
          refetchFiles();
        },
      }}
    >
      {children}
    </fileManagerContext.Provider>
  );
};
