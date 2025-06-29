"use client";

import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import SidebarSheet from "./navigation/SidebarSheet";
import { toast } from "sonner";

type Props = {
  children: ReactNode;
};

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Laporan", href: "/laporan" },
  { label: "Kategori", href: "/kategori" },
];

export default function MainLayout({ children }: Props) {
  //   const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Main content */}
      <div className="flex-1  flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <SidebarSheet />

          <div className="font-semibold text-gray-800">Hi, Rizal 👋</div>
          <button
            className="text-red-500 hover:underline text-sm"
            onClick={async () => {
              toast.success("Berhasil logout");
              localStorage.removeItem("token");
              // Redirect to login page
              await new Promise((resolve) => setTimeout(resolve, 1000));
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </header>

        <main className="p-6 flex-1">{children}</main>
      </div>
    </>
  );
}
