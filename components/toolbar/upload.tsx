'use client';

import {
  FileIcon,
  UploadIcon,
  XIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useSearchParams } from 'next/navigation';

import { Button } from '#/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog';

import { useFileManager } from '../file-manager/context';

function UploadModal() {
  const searchParam = useSearchParams();
  const { refetch } = useFileManager();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] =
    useState(false);
  const [file, setFile] = useState<File | null>(
    null,
  );
  const [isDragging, setIsDragging] =
    useState(false);

  const path = searchParam.get('path') ?? '/';

  function handleSubmit() {
    const form = new FormData();

    form.append('file', file as Blob);
    form.append('path', path);

    setIsUploading(true);

    fetch('/api/upload', {
      method: 'POST',
      body: form,
      headers: {
        ContentType: 'multipart/form-data',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setIsUploading(false);
        if (res.ok) {
          toast.success('File uploaded');
          setFile(null);
          setIsOpen(false);
          refetch();
        }
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
        onOpenChange={setIsOpen}
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
            <div className="flex items-center gap-2 rounded-xl border bg-muted p-4">
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
