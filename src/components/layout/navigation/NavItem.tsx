"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

export default function NavItem({ href, label, icon }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
        isActive
          ? "text-sky-600 bg-sky-100 font-semibold"
          : "text-gray-700 hover:bg-sky-100 hover:text-sky-600"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
