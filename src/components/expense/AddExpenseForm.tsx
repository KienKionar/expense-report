"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

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

      <input
        type="number"
        placeholder="Jumlah (Rp)"
        className="w-full border rounded px-3 py-2"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <select
        className="w-full border rounded px-3 py-2"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
      >
        <option value="">Pilih Kategori</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.icon} {cat.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Deskripsi (opsional)"
        className="w-full border rounded px-3 py-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="date"
        className="w-full border rounded px-3 py-2"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <button
        type="submit"
        className="bg-sky-500 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
