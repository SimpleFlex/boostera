"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Droplets,
  BarChart3,
  Activity,
  Copy,
  CheckCheck,
} from "lucide-react";

type DexPair = {
  pairAddress?: string;
  dexId?: string;
  baseToken?: { address?: string; symbol?: string; name?: string };
  quoteToken?: { symbol?: string };
  priceUsd?: string;
  liquidity?: { usd?: number };
  fdv?: number;
  volume?: { h24?: number };
  txns?: { h24?: { buys?: number; sells?: number } };
  priceChange?: { h24?: number };
  url?: string;
};

type ApiData = {
  best: DexPair | null;
  top: DexPair[];
  pairsCount: number;
};

function fmt(n: number | null | undefined, prefix = "$") {
  if (n == null) return "—";
  if (n >= 1e9) return `${prefix}${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${prefix}${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${prefix}${(n / 1e3).toFixed(2)}K`;
  return `${prefix}${n.toLocaleString()}`;
}

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function TokenPage() {
  const params = useParams();
  const ca = ((params?.ca as string) ?? "").trim();

  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [age, setAge] = useState(0);

  const fetchData = useCallback(async () => {
    if (!ca) return;
    try {
      setError("");
      const res = await fetch(
        `/api/dexscreener/solana/token?address=${encodeURIComponent(ca)}`,
        { cache: "no-store" }
      );
      const json = (await res.json()) as ApiData;
      setData(json);
      setAge(0);
    } catch {
      setError("Failed to fetch token data.");
    } finally {
      setLoading(false);
    }
  }, [ca]);

  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, 30_000);
    return () => clearInterval(t);
  }, [fetchData]);

  useEffect(() => {
    const t = setInterval(() => setAge((a) => a + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(ca).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const best = data?.best;
  const change = best?.priceChange?.h24 ?? null;
  const up = change != null && change >= 0;
  const price = best?.priceUsd
    ? `$${parseFloat(best.priceUsd).toFixed(6)}`
    : "—";

  return (
    <div className="min-h-screen px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        {/* Back */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition cursor-pointer"
        >
          ← Back to Home
        </Link>

        {/* Header */}
        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              {loading ? (
                <div className="h-8 w-40 rounded-xl bg-white/10 animate-pulse" />
              ) : (
                <h1 className="text-2xl font-extrabold text-white/90">
                  {best?.baseToken?.name ?? "Unknown Token"}
                  <span className="ml-2 text-base font-semibold text-white/40">
                    {best?.baseToken?.symbol}
                  </span>
                </h1>
              )}
              <div className="mt-2 flex items-center gap-2">
                <span className="font-mono text-xs text-white/40">
                  {shortAddr(ca)}
                </span>
                <button
                  onClick={copy}
                  className="text-white/30 hover:text-white transition cursor-pointer"
                >
                  {copied ? (
                    <CheckCheck className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-right">
              <p className="text-3xl font-extrabold text-white/90">{price}</p>
              {change != null && (
                <div
                  className={`mt-1 inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${
                    up
                      ? "bg-green-400/15 text-green-300"
                      : "bg-red-400/15 text-red-300"
                  }`}
                >
                  {up ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  {up ? "+" : ""}
                  {change.toFixed(2)}% (24h)
                </div>
              )}
              <p className="mt-1 text-xs text-white/30">Updated {age}s ago</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4">
          {[
            {
              label: "24h Volume",
              value: fmt(best?.volume?.h24),
              icon: BarChart3,
              color: "text-blue-400",
            },
            {
              label: "Liquidity",
              value: fmt(best?.liquidity?.usd),
              icon: Droplets,
              color: "text-cyan-400",
            },
            {
              label: "FDV",
              value: fmt(best?.fdv),
              icon: TrendingUp,
              color: "text-purple-400",
            },
            {
              label: "Pairs",
              value: data?.pairsCount ?? "—",
              icon: Activity,
              color: "text-yellow-400",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/8 bg-white/4 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <p className="text-xs text-white/40 font-semibold uppercase tracking-wide">
                  {s.label}
                </p>
              </div>
              {loading ? (
                <div className="h-6 w-20 rounded-lg bg-white/10 animate-pulse" />
              ) : (
                <p className="text-lg font-extrabold text-white/90">
                  {String(s.value)}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Buy/sell txns */}
        {best?.txns?.h24 && (
          <div className="mb-6 rounded-2xl border border-white/8 bg-white/4 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
              24h Transactions
            </p>
            <div className="flex gap-4">
              <div className="flex-1 rounded-xl bg-green-400/10 border border-green-400/20 p-3 text-center">
                <p className="text-xs text-green-400/70 mb-1">Buys</p>
                <p className="text-xl font-extrabold text-green-300">
                  {best.txns.h24.buys ?? 0}
                </p>
              </div>
              <div className="flex-1 rounded-xl bg-red-400/10 border border-red-400/20 p-3 text-center">
                <p className="text-xs text-red-400/70 mb-1">Sells</p>
                <p className="text-xl font-extrabold text-red-300">
                  {best.txns.h24.sells ?? 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top pairs */}
        {(data?.top?.length ?? 0) > 0 && (
          <div className="rounded-2xl border border-white/8 bg-white/4 overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-white/8">
              <p className="text-sm font-bold text-white/80">
                Top Trading Pairs
              </p>
            </div>
            <div className="divide-y divide-white/8">
              {data!.top.map((pair, i) => (
                <div
                  key={pair.pairAddress ?? i}
                  className="flex items-center justify-between px-5 py-3 gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white/30 w-4">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white/80">
                        {pair.baseToken?.symbol}/{pair.quoteToken?.symbol}
                      </p>
                      <p className="text-xs text-white/35 capitalize">
                        {pair.dexId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-xs text-white/40">Liquidity</p>
                      <p className="text-sm font-bold text-white/80">
                        {fmt(pair.liquidity?.usd)}
                      </p>
                    </div>
                    {pair.url && (
                      <a
                        href={pair.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white/30 hover:text-white transition cursor-pointer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DexScreener link */}
        {best?.url && (
          <div className="text-center">
            <a
              href={best.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white/80 hover:bg-white/10 transition cursor-pointer"
            >
              View full chart on DexScreener{" "}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
