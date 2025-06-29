// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/app/lib/prisma";
import { hashPassword } from "@/app/lib/auth";

const registerSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    // Cek apakah email udah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Hash password
    const hashed = await hashPassword(password);

    // Simpan user ke DB
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashed,
      },
    });

    return NextResponse.json(
      { message: "Register sukses", user: { id: user.id, name: user.name } },
      { status: 201 }
    );
  } catch (err: any) {
    if (err instanceof ZodError) {
      const messages = err.issues.map((issue) => issue.message);
      return NextResponse.json({ error: messages }, { status: 400 });
    }

    console.error(err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
