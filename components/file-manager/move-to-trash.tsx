'use client';

import { toast } from 'sonner';

import { useState } from 'react';

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

import { trpc } from '#/lib/trpc/client';

import { useFileManager } from '../file-manager/context';

function MoveToTrash({
  children,
  fileId,
  onSuccess,
}: {
  fileId?: number;
  children: React.ReactNode;
  onSuccess?(): void;
}) {
  const { refetch } = useFileManager();
  const [isOpen, setIsOpen] = useState(false);
  const moveToTrash =
    trpc.moveToTrash.useMutation();

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DialogTrigger
          asChild
          onClick={() => {
            setIsOpen(true);
          }}
        >
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Move to Trash
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to move this
              file to trash?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button
              variant={'outline'}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              isLoading={moveToTrash.isLoading}
              onClick={() => {
                if (fileId) {
                  moveToTrash
                    .mutateAsync({
                      id: fileId,
                      type: 'file',
                    })
                    .then(() => {
                      toast.success(
                        'File moved to trash',
                      );
                      refetch();
                      setIsOpen(false);
                      onSuccess?.();
                    });
                }
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MoveToTrash;
