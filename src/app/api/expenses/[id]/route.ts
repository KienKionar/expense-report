// /api/expenses/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyToken } from "@/app/lib/auth";
import { z } from "zod";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  try {
    await prisma.expense.delete({ where: { id } });
    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal menghapus pengeluaran" },
      { status: 500 }
    );
  }
}

const updateSchema = z.object({
  amount: z.preprocess(
    (val) => Number(val),
    z.number().positive("Jumlah harus lebih dari 0")
  ),
  description: z.string().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);
    if (!user)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const expenseId = parseInt(params.id);
    if (isNaN(expenseId)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const body = await req.json();
    const data = updateSchema.parse(body);

    const existing = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    // if (existing.userId !== user.id) {
    //   return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    // }

    const updated = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        amount: data.amount,
        description: data.description || "",
      },
    });

    return NextResponse.json({
      message: "Berhasil diupdate",
      expense: updated,
    });
  } catch (err: any) {
    console.error("UPDATE ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Gagal update pengeluaran" },
      { status: 500 }
    );
  }
}
