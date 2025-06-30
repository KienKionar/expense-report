"use client";

import { ReactNode, useEffect, useState } from "react";
import SidebarSheet from "./navigation/SidebarSheet";
import { toast } from "sonner";
import { getUserFromToken } from "@/app/lib/getUserFromToken";
import { Button } from "../ui/button";

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  //   const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserFromToken();
      setUserName(user?.name || null);
    };

    fetchUser();
  }, []);

  return (
    <>
      {/* Main content */}
      <div className="flex-1  flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <SidebarSheet />

          <div className="font-semibold text-gray-800">
            {userName ? `Hi, ${userName} 👋` : "Loading..."}
          </div>

          <Button
            variant="outline"
            color="red"
            className="text-red-500 hover:bg-red-600 hover:text-white cursor-pointer text-sm"
            onClick={async () => {
              toast.success("Berhasil logout");
              localStorage.removeItem("token");
              // Redirect to login page
              await new Promise((resolve) => setTimeout(resolve, 1000));
              window.location.href = "/login";
            }}
          >
            Logout
          </Button>
        </header>

        <main className="p-6 flex-1">{children}</main>
      </div>
    </>
  );
}
