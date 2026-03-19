"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function tab(active: boolean) {
  return active
    ? "border-white/25 bg-white/10 text-white"
    : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10";
}

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href="/admin"
        className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${tab(
          pathname === "/admin"
        )}`}
      >
        Overview
      </Link>

      <Link
        href="/admin/users"
        className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${tab(
          pathname === "/admin/users"
        )}`}
      >
        Users
      </Link>

      <Link
        href="/admin/charges"
        className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${tab(
          pathname === "/admin/charges"
        )}`}
      >
        Charges
      </Link>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="ml-auto rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/20"
      >
        Logout
      </button>
    </div>
  );
}
