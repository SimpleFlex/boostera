export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">{children}</div>
    </main>
  );
}
