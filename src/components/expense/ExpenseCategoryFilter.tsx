"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Props = {
  selectedCategory: string;
  onChange: (value: string) => void;
};

export default function ExpenseCategoryFilter({
  selectedCategory,
  onChange,
}: Props) {
  const [categories, setCategories] = useState<
    { id: number; name: string; icon?: string }[]
  >([]);

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

  return (
    <Select value={selectedCategory} onValueChange={onChange}>
      <SelectTrigger className="w-full md:w-[300px] mb-4">
        <SelectValue placeholder="Pilih kategori" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua Kategori ⚙️</SelectItem>
        {categories.map((cat) => (
          <SelectItem key={cat.id} value={String(cat.id)}>
            {" "}
            {/* ✅ pakai id */}
            {cat.name} {cat.icon && <span className="ml-2">{cat.icon}</span>}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
