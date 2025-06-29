// src/components/chart/ExpenseBarChart.tsx
"use client";

import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
  Legend,
} from "chart.js";
import { Expense } from "@/app/types/expense";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
  Legend
);

export default function ExpenseBarChart({ expenses }: { expenses: Expense[] }) {
  const labels = [...new Set(expenses.map((e) => e.category.name))];

  const amounts = labels.map((label) =>
    expenses
      .filter((e) => e.category.name === label)
      .reduce((sum, e) => sum + Number(e.amount), 0)
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Total Pengeluaran",
        data: amounts,
        backgroundColor: "#60A5FA", // Warna biru muda
        borderColor: "#2563EB", // Warna biru tua
        borderWidth: 2,
        fill: true, // Isi area di bawah garis
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      elements: {
        line: {
          tension: 0.4, // bikin garis lebih melengkung
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}
