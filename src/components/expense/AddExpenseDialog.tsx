"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddExpenseForm from "./AddExpenseForm";
import { useState } from "react";

export default function AddExpenseDialog({
  onRefetch,
}: {
  onRefetch: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4">+ Tambah Pengeluaran</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Pengeluaran</DialogTitle>
          <DialogDescription>
            Masukkan detail pengeluaran yang ingin dicatat.
          </DialogDescription>
        </DialogHeader>

        <AddExpenseForm
          onSuccess={() => {
            onRefetch(); // ✅ fetch dari parent
            setOpen(false); // ✅ tutup modal
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
