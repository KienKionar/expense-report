// src/components/layout/SidebarSheet.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import NavItem from "./NavItem";
import { Home, LineChart } from "lucide-react"; // Optional icons

export default function SidebarSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          ☰
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[250px]">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold mb-4">Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4">
          <NavItem
            href="/dashboard"
            label="Dashboard"
            icon={<Home size={18} />}
          />
          <NavItem
            href="/report"
            label="Report"
            icon={<LineChart size={18} />}
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
