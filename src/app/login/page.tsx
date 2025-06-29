"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AuthTemplate from "@/components/auth/AuthTemplate";
import AuthInput from "@/components/auth/AuthInput";
import AuthLinkText from "@/components/auth/AuthLinkText";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        const error = Array.isArray(data.error)
          ? data.error.map((msg: string) => `• ${msg}`).join("\n")
          : data.error || "Login gagal";
        throw new Error(error);
      }

      // Simpan token (misal ke localStorage, atau nanti pake cookie)
      localStorage.setItem("token", data.token);
      toast.success("Login berhasil 🚀");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan", { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthTemplate title="Masuk Akun">
      <form onSubmit={handleLogin}>
        <AuthInput
          id="email"
          label="Email"
          type="email"
          placeholder="youremail@email.com"
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
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>

      <AuthLinkText href="/register">Belum punya akun?</AuthLinkText>
    </AuthTemplate>
  );
}
