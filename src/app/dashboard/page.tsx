"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/auth/RequiredAuth";
import AddExpenseDialog from "@/components/expense/AddExpenseDialog";
import { toast } from "sonner";

interface Expense {
  id: number;
  amount: number;
  description?: string;
  date: string;
  category: {
    name: string;
    icon?: string;
  };
}

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Taruh DI SINI
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setExpenses(data.expenses); // harusnya array
      } else {
        toast.error(data.error || "Gagal mengambil data");
      }
    } catch (err) {
      toast.error("Error mengambil data pengeluaran");
    } finally {
      setLoading(false);
    }
  };

  // ⛳ Panggil sekali pas page load
  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <RequireAuth>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <AddExpenseDialog onRefetch={fetchExpenses} />

        {loading ? (
          <p>Loading...</p>
        ) : expenses.length === 0 ? (
          <p>Belum ada pengeluaran.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {expenses.map((exp) => (
              <Card key={exp.id} className="bg-white shadow-md">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      Rp {Number(exp.amount).toLocaleString()}
                    </h2>
                    <Badge variant="outline">
                      {exp.category.icon} {exp.category.name}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {exp.description || "-"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(exp.date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </RequireAuth>
  );
}
