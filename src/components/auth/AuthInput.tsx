// src/components/auth/AuthInput.tsx
import { Label } from "@radix-ui/react-label";

interface Props {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AuthInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: Props) {
  return (
    <div className="mb-4">
      <Label htmlFor={id} className="block text-sm font-medium mb-1 text-white">
        {label}
      </Label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full rounded px-3 py-2 text-sm bg-white/80 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
