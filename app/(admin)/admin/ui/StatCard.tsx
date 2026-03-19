export default function StatCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="text-xs uppercase tracking-wider text-white/50">
        {title}
      </div>
      <div className="mt-2 text-2xl font-extrabold text-white/90">{value}</div>
      {sub ? <div className="mt-1 text-sm text-white/60">{sub}</div> : null}
    </div>
  );
}
