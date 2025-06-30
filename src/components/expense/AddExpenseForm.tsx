"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Category {
  id: number;
  name: string;
  icon?: string;
}

interface AddExpenseFormProps {
  onSuccess?: () => void; // ✅ buat auto-close modal
}

export default function AddExpenseForm({ onSuccess }: AddExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch kategori
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch {
        toast.error("Gagal ambil kategori");
      }
    };

    fetchCategories();
  }, []);

  // ✅ Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User belum login");

      const body = {
        categoryId: Number(categoryId),
        amount: Number(amount),
        description,
        date,
      };

      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data");

      toast.success("Pengeluaran berhasil ditambahkan 💸");

      // ✅ reset form
      setAmount("");
      setCategoryId("");
      setDescription("");
      setDate("");

      // ✅ auto-close modal (kalau ada callback)
      onSuccess?.();
    } catch (err: any) {
      const msg = Array.isArray(err.message)
        ? err.message.join("\n")
        : err.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded shadow"
    >
      <h2 className="text-xl font-semibold">Tambah Pengeluaran</h2>

      <Input
        type="number"
        placeholder="Jumlah (Rp)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <Select
        value={categoryId}
        onValueChange={(value) => setCategoryId(value)}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Pilih Kategori" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={String(cat.id)}>
              {cat.icon} {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Textarea
        placeholder="Deskripsi (opsional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(new Date(date), "PPP") : <span>Pilih Tanggal</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date ? new Date(date) : undefined}
            onSelect={(day) =>
              setDate(day ? day.toLocaleDateString("sv-SE") : "")
            }
            // initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Menyimpan..." : "Simpan"}
      </Button>
    </form>
  );
}
