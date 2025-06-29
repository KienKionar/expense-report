"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/auth/RequiredAuth";
import AddExpenseDialog from "@/components/expense/AddExpenseDialog";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ExpenseBarChart from "@/components/chart/ExpenseChartBar";

ChartJS.register(ArcElement, Tooltip, Legend);

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
  const [showAll, setShowAll] = useState(false);

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
        setExpenses(data.expenses);
      } else {
        toast.error(data.error || "Gagal mengambil data");
      }
    } catch (err) {
      toast.error("Error mengambil data pengeluaran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // 🧠 Keluarin label dulu
  const labels = [...new Set(expenses.map((e) => e.category.name))];

  // 🎯 Totalin pengeluaran per kategori
  const amounts = labels.map((label) =>
    expenses
      .filter((e) => e.category.name === label)
      .reduce((sum, e) => sum + Number(e.amount), 0)
  );
  // Pie Chart Data (Total per kategori)
  const chartData = {
    labels,
    datasets: [
      {
        data: amounts,
        backgroundColor: [
          "#0ea5e9",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#ec4899",
        ],
      },
    ],
  };

  return (
    <RequireAuth>
      <MainLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

          <AddExpenseDialog onRefetch={fetchExpenses} />

          {loading ? (
            <p className="text-blue-600 text-center animate-pulse">
              Loading...
            </p>
          ) : expenses.length === 0 ? (
            <p className="text-red-600 text-center">Belum ada pengeluaran.</p>
          ) : (
            <>
              <div className="flex flex-col gap-6">
                {/* Card */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {(showAll ? expenses : expenses.slice(0, 3)).map((exp) => (
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
                {/* Card End */}

                {/* Show more Button */}

                {expenses.length > 6 && (
                  <div className="flex justify-center ">
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="mt-4 text-sky-500 bg-slate-300/50 rounded py-1 px-3 border border-slate-300/60 hover:cursor-pointer hover:underline"
                    >
                      {showAll ? "Show less" : "Show more"}
                    </button>
                  </div>
                )}
                {/* Show more Button End */}
              </div>

              {/* Chart Area */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Statistik</h2>
                <div className="max-w-2xl mx-auto">
                  <ExpenseBarChart expenses={expenses} />
                </div>
              </div>
              {/* Chart Area End */}
            </>
          )}
        </div>
      </MainLayout>
    </RequireAuth>
  );
}
