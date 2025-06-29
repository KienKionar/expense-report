// src/app/api/expenses/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { z, ZodError } from "zod";
import { prisma } from "@/app/lib/prisma";

const expenseSchema = z.object({
  categoryId: z.number({ required_error: "Kategori wajib dipilih" }),
  amount: z.number({ required_error: "Jumlah wajib diisi" }),
  description: z.string().optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal tidak valid",
  }),
});

// POST /api/expenses
export async function POST(req: NextRequest) {
  try {
    // ✅ Ambil token
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      console.warn("🚫 No token provided.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };
    const userId = decoded.id;

    // ✅ Parse dan validasi body
    const body = await req.json();
    console.log("📦 Incoming request body:", body);

    const { categoryId, amount, description, date } = expenseSchema.parse(body);

    // ✅ Simpan ke database
    const expense = await prisma.expense.create({
      data: {
        userId,
        categoryId,
        amount,
        description,
        date: new Date(date),
      },
    });

    console.log("✅ Expense saved:", expense);
    return NextResponse.json({ expense }, { status: 201 });
  } catch (err: any) {
    if (err instanceof ZodError) {
      const errors = err.issues.map((i) => i.message);
      console.warn("❌ Zod validation error:", errors);
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    if (err.name === "JsonWebTokenError") {
      console.error("❌ Invalid token.");
      return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
    }

    console.error("🔥 Unexpected error:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan pengeluaran" },
      { status: 500 }
    );
  }
}

// GET /api/expenses
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };
    const userId = decoded.id;

    const expenses = await prisma.expense.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ expenses }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error GET expenses:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data pengeluaran" },
      { status: 500 }
    );
  }
}
