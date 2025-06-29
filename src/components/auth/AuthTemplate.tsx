// src/components/auth/AuthTemplate.tsx
export default function AuthTemplate({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-6 rounded shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-white">{title}</h1>
        {children}
      </div>
    </main>
  );
}
