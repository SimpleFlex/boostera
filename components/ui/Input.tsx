"use client";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
}

export default function Input({
  value,
  onChange,
  placeholder = "",
  type = "text",
  disabled = false,
  className = "",
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition ${className}`}
    />
  );
}
