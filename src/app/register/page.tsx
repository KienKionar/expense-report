"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AuthTemplate from "@/components/auth/AuthTemplate";
import AuthInput from "@/components/auth/AuthInput";
import AuthLinkText from "@/components/auth/AuthLinkText";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        const error = Array.isArray(data.error)
          ? data.error.map((msg: string) => `• ${msg}`).join("\n")
          : data.error || "Register gagal";
        throw new Error(error);
      }

      toast.success("Berhasil daftar 🎉");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan", { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthTemplate title="Daftar Akun">
      <form onSubmit={handleRegister}>
        <AuthInput
          id="name"
          label="Nama"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
        />
        <AuthInput
          id="email"
          label="Email"
          type="email"
          placeholder="jhon@gmail.com"
          value={form.email}
          onChange={handleChange}
        />
        <AuthInput
          id="password"
          label="Kata Sandi"
          type="password"
          placeholder="********"
          value={form.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-sky-500 text-white w-full py-2 rounded mt-4 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {isLoading ? "Loading..." : "Register"}
        </button>
      </form>

      <AuthLinkText href="/login">Sudah punya akun?</AuthLinkText>
    </AuthTemplate>
  );
}
