"use client";

import EmptyState from "./EmptyState";
import AdminTable from "./AdminTable";

type UserRow = {
  address: string;
  solBalance?: number;
  lastSeenAt?: string;
};

export default function UsersClient() {
  // Next step: replace with real fetch + balances
  const users: UserRow[] = [];

  if (users.length === 0) {
    return (
      <EmptyState
        title="No users yet"
        desc="Once wallets sign in, you’ll see them here with live SOL balances."
      />
    );
  }

  return (
    <AdminTable headers={["Wallet", "SOL Balance", "Last Seen", "Actions"]}>
      {users.map((u) => (
        <tr
          key={u.address}
          className="rounded-2xl border border-white/10 bg-black/20 text-sm text-white/80"
        >
          <td className="px-4 py-3">
            <div className="font-semibold text-white/90">{u.address}</div>
          </td>

          <td className="px-4 py-3">
            {typeof u.solBalance === "number"
              ? `${u.solBalance.toFixed(6)} SOL`
              : "—"}
          </td>

          <td className="px-4 py-3">
            {u.lastSeenAt ? new Date(u.lastSeenAt).toLocaleString() : "—"}
          </td>

          <td className="px-4 py-3">
            <a
              href={`https://solscan.io/account/${u.address}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/15"
            >
              View on Solscan
            </a>
          </td>
        </tr>
      ))}
    </AdminTable>
  );
}
