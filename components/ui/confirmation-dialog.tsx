"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  onConfirm: () => void;
  confirmText: string;
  cancelText?: string;
  confirmVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  subtitle,
  onConfirm,
  confirmText,
  cancelText = "Cancel",
  confirmVariant = "default",
  confirmDisabled = false,
  confirmLoading = false,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
        </DialogHeader>
        <DialogFooter className="flex gap-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={confirmLoading}
            className="flex-1 text-xs uppercase"
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={confirmDisabled || confirmLoading}
            className="flex-1 text-xs uppercase"
          >
            {confirmLoading ? "Loading..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
