'use client';

import { useState } from 'react';

import {
  useParams,
  useSearchParams,
} from 'next/navigation';

import { trpc } from '#/lib/trpc/client';

import type { File, Folder } from '../db/schema';
import { fileManagerContext } from './context';

export const FileManagerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const path = searchParams.get('path') ?? '/';

  const accountId = params.accountId as string;

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);
  const [selectedFolder, setSelectedFolder] =
    useState<Folder | null>(null);

  const {
    data: currentFolder,
    refetch: refetchCurrentFolder,
  } = trpc.getSingleFolder.useQuery(
    {
      path,
      accountId,
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
    accountId,
  });

  const {
    data: files,
    isLoading: filesLoading,
    refetch: refetchFiles,
  } = trpc.getFiles.useQuery({
    folderPath: path,
    accountId,
  });

  return (
    <fileManagerContext.Provider
      value={{
        files: files ?? [],
        folders: folders ?? [],
        currentFolder: currentFolder ?? null,
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
