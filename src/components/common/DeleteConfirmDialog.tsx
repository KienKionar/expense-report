"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Pengeluaran</DialogTitle>
          <DialogDescription>
            Yakin ingin menghapus pengeluaran ini? Tindakan ini tidak bisa
            dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
