export default function EmptyState({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
      <div className="text-lg font-extrabold text-white/90">{title}</div>
      <p className="mt-2 text-sm text-white/60">{desc}</p>
    </div>
  );
}
