// src/app/api/auth/login/route.ts
import { comparePassword, generateToken } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    const token = generateToken({ id: user.id, email: user.email });
    console.log("TOKEN:", token);

    return NextResponse.json(
      { message: "Login sukses", token },
      { status: 200 }
    );
  } catch (err: any) {
    if (err instanceof ZodError) {
      const messages = err.issues.map((i) => i.message);
      return NextResponse.json({ error: messages }, { status: 400 });
    }

    console.error(err);
    return NextResponse.json(
      { error: err?.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
