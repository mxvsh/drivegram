'use client';

import { EditIcon } from 'lucide-react';
import { toast } from 'sonner';

import { useRef, useState } from 'react';

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
import { Input } from '#/components/ui/input';

import { trpc } from '#/lib/trpc/client';

import { useFileManager } from '../file-manager/context';

type RenameModalProps = {
  isSelected: boolean;
  type: 'folder' | 'file';
};

function RenameModal({
  isSelected,
  type,
}: RenameModalProps) {
  const {
    refetch,
    selectedFile,
    selectedFolder,
  } = useFileManager();
  const [isOpen, setIsOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const rename =
    trpc.remaneFileOrFolder.useMutation();

  function handleSubmit() {
    const name = nameRef.current?.value;
    if (!name) {
      toast.error('Please enter a name');
      return;
    }

    rename
      .mutateAsync({
        id:
          type === 'file'
            ? selectedFile?.id!
            : selectedFolder?.id!,
        name,
        type,
      })
      .then(() => {
        setIsOpen(false);
        refetch();
      });
  }
  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DialogTrigger asChild>
          <Button
            icon={<EditIcon size={18} />}
            variant="ghost"
            size="sm"
            disabled={!isSelected}
          >
            Rename
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              Rename {type}
            </DialogTitle>
            <DialogDescription>
              Enter the new name for the {type}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input
              id="name"
              className="mt-1"
              placeholder="Enter folder name"
              ref={nameRef}
              defaultValue={
                type === 'file'
                  ? selectedFile?.filename
                  : selectedFolder?.name
              }
            />
          </div>

          <DialogFooter>
            <Button
              onClick={handleSubmit}
              isLoading={rename.isLoading}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RenameModal;
