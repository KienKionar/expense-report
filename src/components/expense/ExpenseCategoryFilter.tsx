"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  categories: { id: number; name: string; icon?: string }[];
  selectedCategory: string;
  onChange: (value: string) => void;
}

export default function ExpenseCategoryFilter({
  categories,
  selectedCategory,
  onChange,
}: Props) {
  return (
    <Select value={selectedCategory} onValueChange={onChange}>
      <SelectTrigger className="w-64 mb-4">
        <SelectValue placeholder="Pilih Kategori" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua</SelectItem>
        {categories.map((cat) => (
          <SelectItem key={cat.id} value={String(cat.id)}>
            {cat.icon} {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
