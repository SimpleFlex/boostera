import AdminNav from "./ui/AdminNav";
import AdminShell from "./ui/AdminShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white/90">Admin</h1>
        <p className="mt-1 text-sm text-white/60">
          Monitor users, balances, and charge requests.
        </p>
      </div>

      <AdminNav />

      <div className="mt-6">{children}</div>
    </AdminShell>
  );
}
