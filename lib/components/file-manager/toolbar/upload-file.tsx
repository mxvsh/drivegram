'use client';

import {
  FileIcon,
  UploadIcon,
  XIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { Api } from 'telegram';
import { CustomFile } from 'telegram/client/uploads';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useParams,
  useSearchParams,
} from 'next/navigation';

import { useTelegramClient } from '#/lib/client/context';
import { Button } from '#/lib/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/lib/components/ui/dialog';
import { useFileManager } from '#/lib/file-manager';
import { trpc } from '#/lib/trpc/client';

import { Progress } from '../../ui/progress';

function UploadModal() {
  const params = useParams();
  const client = useTelegramClient();
  const searchParam = useSearchParams();
  const { refetch } = useFileManager();
  const [progress, setProgress] = useState(0);

  const createFile =
    trpc.createFile.useMutation();

  const fileRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] =
    useState(false);
  const [file, setFile] = useState<File | null>(
    null,
  );
  const [isDragging, setIsDragging] =
    useState(false);

  const folderPath =
    searchParam.get('path') ?? '/';

  async function handleSubmit() {
    if (!file) {
      toast.error('No file selected');
      return;
    }

    setIsUploading(true);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const toUpload = new CustomFile(
      file.name,
      file.size,
      '',
      // @ts-ignore
      buffer,
    );

    const res = await client.sendFile('me', {
      file: toUpload,
      forceDocument: true,
      workers: 10,
      progressCallback: (progress) => {
        setProgress(progress * 100);
      },
    });

    const peer = res.peerId as Api.PeerUser;
    const chatId = peer.userId
      .valueOf()
      .toString();
    const msgId = res.id.toString();

    await createFile
      .mutateAsync({
        folderPath,
        filename: file.name,
        filetype: file.type,
        size: file.size,
        accountId: params.accountId as string,
        chatId,
        messageId: msgId,
        fileId: res.id.toString(),
      })
      .then(() => {
        refetch();
        setIsOpen(false);
        setFile(null);
        setIsUploading(false);
        setProgress(0);
      });
  }

  useEffect(() => {
    if (file) {
      setIsDragging(false);
    }
  }, [file]);

  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={(val) => {
          if (progress > 0) return;
          setIsOpen(val);
        }}
      >
        <DialogTrigger asChild>
          <Button
            icon={<UploadIcon size={18} />}
            variant="ghost"
            size="sm"
          >
            Upload
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Upload file</DialogTitle>
            <DialogDescription>
              Drag and drop a file or click to
              upload
            </DialogDescription>
          </DialogHeader>
          {file ? (
            <div className="bg-muted flex items-center gap-2 rounded-xl border p-4">
              <FileIcon
                size={24}
                className="flex-shrink-0"
              />
              <span className="break-all text-sm">
                {file.name}
              </span>
              <div className="flex-1" />
              <XIcon
                size={16}
                onClick={() => {
                  setFile(null);
                }}
                className="flex-shrink-0"
              />
            </div>
          ) : (
            <div
              className={`flex h-60 flex-col items-center justify-center gap-2 rounded-xl border ${
                isDragging
                  ? 'bg-muted'
                  : 'bg-muted'
              }`}
              onClick={() => {
                fileRef.current?.click();
              }}
              onDragEnter={() => {
                setIsDragging(true);
              }}
              onDragLeave={() => {
                setIsDragging(false);
              }}
              onDrop={(ev) => {
                ev.preventDefault();
                const files =
                  ev.dataTransfer?.files;
                if (files?.length) {
                  setFile(files[0]);
                }
              }}
              onDragOver={(ev) => {
                ev.preventDefault();
              }}
            >
              <input
                type="file"
                className="hidden"
                ref={fileRef}
                onChange={(e) => {
                  const file =
                    e.target.files?.[0];
                  if (file) {
                    setFile(file);
                  }
                }}
              />
              {isDragging ? (
                <div>Drop here</div>
              ) : (
                <>
                  <FileIcon size={32} />
                  <span className="text-sm">
                    Drag and drop a file or click
                    to upload
                  </span>
                </>
              )}
            </div>
          )}

          {progress > 0 && (
            <Progress value={progress} />
          )}

          <DialogFooter>
            {file && (
              <Button
                onClick={handleSubmit}
                isLoading={isUploading}
              >
                Submit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UploadModal;
