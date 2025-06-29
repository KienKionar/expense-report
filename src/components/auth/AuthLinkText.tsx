// src/components/auth/AuthLinkText.tsx
import Link from "next/link";

export default function AuthLinkText({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <p className="text-sm text-center text-gray-300 mt-4">
      {children}{" "}
      <Link href={href} className="text-sky-400 hover:underline">
        Klik di sini
      </Link>
    </p>
  );
}
