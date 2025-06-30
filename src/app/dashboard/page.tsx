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
import ExpenseCategoryFilter from "@/components/expense/ExpenseCategoryFilter";
import DeleteConfirmDialog from "@/components/common/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import EditExpenseDialog from "@/components/expense/EditExpenseDialog";
import { Skeleton } from "@/components/ui/skeleton";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Expense {
  id: number;
  amount: number;
  description?: string;
  date: string;
  category: {
    id: number; // tambahin ini biar gak error
    name: string;
    icon?: string;
  };
}

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const filteredExpenses = expenses.filter((exp) => {
    const matchCategory =
      selectedCategory === "all" ||
      String(exp.category.id) === selectedCategory;

    const matchSearch =
      exp.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.category.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });
  // Delete Handlers
  // Dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);
  // Edit Handlers
  // Dialog state
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const openDeleteDialog = (id: number) => {
    setExpenseToDelete(id);
    setConfirmOpen(true);
  };
  const openEditDialog = (expense: Expense) => {
    setExpenseToEdit(expense);
    setEditDialogOpen(true);
  };
  const closeEditDialog = () => {
    setExpenseToEdit(null);
    setEditDialogOpen(false);
  };

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

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal menghapus");

      toast.success("Pengeluaran berhasil dihapus");
      fetchExpenses(); // Refresh list
    } catch (err) {
      toast.error("Error menghapus pengeluaran");
    }
  };
  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;
    await handleDelete(expenseToDelete);
    setConfirmOpen(false);
    setExpenseToDelete(null);
  };

  return (
    <RequireAuth>
      <MainLayout>
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            {loading ? (
              <Skeleton className="h-8 w-1/3" />
            ) : (
              <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            )}

            {loading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-[300px]" />
                <Skeleton className="h-10 w-[300px]" />
                <Skeleton className="h-10 w-[300px]" />
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center gap-3">
                <div className="flex gap-3">
                  <AddExpenseDialog onRefetch={fetchExpenses} />
                  <ExpenseCategoryFilter
                    selectedCategory={selectedCategory}
                    onChange={(val) => setSelectedCategory(val)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Cari pengeluaran..."
                    className="border rounded px-3 py-2 w-full md:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[120px] w-full rounded-md" />
                ))}
              </div>

              <div className="mt-8">
                <Skeleton className="h-6 w-1/4 mb-4" />
                <Skeleton className="h-[250px] w-full max-w-2xl mx-auto rounded-md" />
              </div>
            </>
          ) : expenses.length === 0 ? (
            <p className="text-red-600 text-center">Belum ada pengeluaran.</p>
          ) : (
            <>
              <div className="flex flex-col gap-6">
                {/* Card */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {(showAll
                    ? filteredExpenses
                    : filteredExpenses.slice(0, 3)
                  ).map((exp) => (
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

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="ghost"
                            onClick={() => openEditDialog(exp)} // 👈 buka dialog edit
                            className="text-blue-500 text-sm hover:underline hover:bg-blue-600/10 hover:text-blue-600"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => openDeleteDialog(exp.id)}
                            className="text-red-500 text-sm hover:underline hover:bg-red-600/10 hover:text-red-600"
                          >
                            Hapus
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <DeleteConfirmDialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={handleConfirmDelete}
                  />
                </div>
                {expenseToEdit && (
                  <EditExpenseDialog
                    open={editDialogOpen}
                    onClose={closeEditDialog}
                    expense={expenseToEdit}
                    onRefetch={fetchExpenses}
                  />
                )}

                {/* Card End */}

                {/* Show more Button */}

                {/* {filteredExpenses.length > 6 && ( */}
                {filteredExpenses.length > 3 && ( // 👈 bukan 6, karena lo nge-slice 3 kan?
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
