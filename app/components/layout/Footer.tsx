"use client";

import Link from "next/link";
import {
  Twitter,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Zap,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-6 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-yellow-400/10 blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-green-400/10 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-5 relative z-10">
        <div className="rounded-[24px] border border-white/8 bg-gradient-to-b from-white/6 to-white/2 backdrop-blur-2xl overflow-hidden">
          {/* Top accent */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent" />

          {/* ── MOBILE layout ─────────────────────────────────────────────── */}
          <div className="md:hidden px-5 py-6 space-y-5">
            {/* Logo + tagline row */}
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-2 cursor-pointer"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-300/20 to-green-400/20 border border-white/10">
                  <Zap className="h-3.5 w-3.5 text-yellow-300" />
                </div>
                <span className="text-lg font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-fuchsia-300 via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
                    Boost
                  </span>
                  <span className="text-white/90">Era</span>
                </span>
              </Link>

              {/* Social icons inline */}
              <div className="flex items-center gap-2">
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-yellow-300/10 hover:border-yellow-300/30 transition cursor-pointer"
                >
                  <Twitter className="h-3.5 w-3.5 text-yellow-300" />
                </a>
                <a
                  href="https://t.me/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-green-400/10 hover:border-green-400/30 transition cursor-pointer"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-green-400" />
                </a>
              </div>
            </div>

            {/* CTA row */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-black hover:bg-yellow-300 transition cursor-pointer"
              >
                Get Started <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/memedrop"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white/80 hover:bg-white/10 transition cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-yellow-300" /> MemeDrop
              </Link>
            </div>

            {/* Links row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {[
                  { label: "Home", href: "/" },
                  { label: "MemeDrop", href: "/memedrop" },
                  { label: "Leaderboard", href: "/leaderboard" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-xs text-white/45 hover:text-white transition cursor-pointer"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Trust badge */}
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-green-400/20 bg-green-400/5 px-3 py-1.5 text-[11px] font-medium text-green-300">
              <ShieldCheck className="h-3 w-3" />
              Wallet-connect only · No email required
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

            {/* Bottom */}
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-white/25">
                © {new Date().getFullYear()} Boost Era
              </p>
              <div className="flex items-center gap-3">
                {["Terms", "Privacy", "Support"].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="text-[11px] text-white/25 hover:text-white transition cursor-pointer"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── DESKTOP layout ────────────────────────────────────────────── */}
          <div className="hidden md:block p-10">
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
              {/* Brand */}
              <div>
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2 cursor-pointer"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-300/20 to-green-400/20 border border-white/10">
                    <Zap className="h-4 w-4 text-yellow-300" />
                  </div>
                  <span className="text-xl font-extrabold tracking-tight">
                    <span className="bg-gradient-to-r from-fuchsia-300 via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
                      Boost
                    </span>
                    <span className="text-white/90">Era</span>
                  </span>
                </Link>
                <p className="mt-4 text-sm leading-relaxed text-white/50 max-w-xs">
                  The fastest way to promote your Solana meme coin, run drops,
                  and grow your community.
                </p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-green-400/20 bg-green-400/5 px-3 py-2 text-xs font-medium text-green-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Wallet-connect only · No email required
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Link
                    href="/"
                    className="group inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-black transition hover:bg-yellow-300 cursor-pointer"
                  >
                    Get Started
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                  <Link
                    href="/memedrop"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white/80 hover:bg-white/10 hover:border-white/20 transition cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                    MemeDrop
                  </Link>
                </div>
              </div>

              {/* Product */}
              <div>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Product
                </p>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: "Home", href: "/" },
                    { label: "MemeDrop", href: "/memedrop" },
                    { label: "Leaderboard", href: "/leaderboard" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition cursor-pointer w-fit"
                    >
                      <span className="h-px w-3 bg-white/20 transition-all group-hover:w-5 group-hover:bg-yellow-300" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Community */}
              <div>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Community
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://x.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-3 cursor-pointer w-fit"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition group-hover:border-yellow-300/30 group-hover:bg-yellow-300/10">
                      <Twitter className="h-3.5 w-3.5 text-yellow-300" />
                    </div>
                    <span className="text-sm text-white/50 group-hover:text-white transition">
                      Twitter / X
                    </span>
                  </a>
                  <a
                    href="https://t.me/"
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-3 cursor-pointer w-fit"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition group-hover:border-green-400/30 group-hover:bg-green-400/10">
                      <MessageCircle className="h-3.5 w-3.5 text-green-400" />
                    </div>
                    <span className="text-sm text-white/50 group-hover:text-white transition">
                      Telegram
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* ── Animated ticker — desktop only ──────────────────────── */}
            <div className="my-8 relative overflow-hidden rounded-2xl border border-white/6 bg-white/3 py-4">
              {/* Fade masks */}
              <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-black/20 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-black/20 to-transparent z-10 pointer-events-none" />

              <div className="flex animate-[marquee_18s_linear_infinite] whitespace-nowrap gap-0">
                {[...Array(2)].map((_, ri) => (
                  <div key={ri} className="flex items-center gap-0 shrink-0">
                    {[
                      { icon: "🚀", text: "Launch your meme coin" },
                      { icon: "💎", text: "Built on Solana" },
                      { icon: "🎁", text: "Run MemeDrop campaigns" },
                      { icon: "📈", text: "Grow your community" },
                      { icon: "⚡", text: "No email required" },
                      { icon: "🔐", text: "Wallet-connect only" },
                      { icon: "🌟", text: "Promote your token" },
                    ].map((item, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-3 px-8"
                      >
                        <span className="text-base">{item.icon}</span>
                        <span className="text-xs font-semibold tracking-wide text-white/40 uppercase">
                          {item.text}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-yellow-300/40" />
                      </span>
                    ))}
                  </div>
                ))}
              </div>

              <style>
                {
                  "@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }"
                }
              </style>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-xs text-white/30">
                © {new Date().getFullYear()} Boost Era · Built on Solana
              </p>
              <div className="flex items-center gap-5">
                {["Terms", "Privacy", "Support"].map((item, i, arr) => (
                  <span key={item} className="flex items-center gap-5">
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="text-xs text-white/30 hover:text-white transition cursor-pointer"
                    >
                      {item}
                    </Link>
                    {i < arr.length - 1 && (
                      <span className="h-3 w-px bg-white/15" />
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-green-400/30 to-transparent" />
        </div>
      </div>
    </footer>
  );
}
