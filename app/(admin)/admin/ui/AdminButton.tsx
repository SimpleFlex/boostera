"use client";

export default function AdminButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/15 disabled:opacity-50"
    >
      {children}
    </button>
  );
}
