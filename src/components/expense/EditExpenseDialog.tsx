"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  expense: any;
  open: boolean;
  onClose: () => void;
  onRefetch: () => void;
};

export default function EditExpenseDialog({
  expense,
  open,
  onClose,
  onRefetch,
}: Props) {
  const [amount, setAmount] = useState(String(expense.amount || 0));
  const [description, setDescription] = useState(expense.description || "");

  // update field kalo expense berubah
  useEffect(() => {
    setAmount(expense.amount);
    setDescription(expense.description || "");
  }, [expense]);

  const handleUpdate = async () => {
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Jumlah harus lebih dari 0");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/expenses/${expense.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parsedAmount,
          description,
        }),
      });

      if (!res.ok) throw new Error("Gagal update");

      toast.success("Pengeluaran berhasil diupdate");
      onClose();
      onRefetch();
    } catch (err) {
      toast.error("Gagal update pengeluaran");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pengeluaran</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="number"
            placeholder="Jumlah"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Textarea
            placeholder="Deskripsi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button onClick={handleUpdate} className="w-full">
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
