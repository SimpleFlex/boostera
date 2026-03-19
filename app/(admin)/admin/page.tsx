import StatCard from "./ui/StatCard";

export default function AdminOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard title="Total Users" value="—" sub="Wallet signups (from DB)" />
      <StatCard
        title="Pending Charges"
        value="—"
        sub="Awaiting user approval"
      />
      <StatCard title="Treasury" value="—" sub="Total received (on-chain)" />
    </div>
  );
}
