"use client";

import { useEffect, useState } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Wallet,
  History,
  Zap,
  AlertCircle,
} from "lucide-react";
import type { PaymentRecord } from "../lib/paymentsStore";

function timeLeft(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  return days > 0 ? `${days}d ${hours}h left` : `${hours}h left`;
}

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function DashboardPage() {
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount({ namespace: "solana" });

  const [history, setHistory] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    fetch(`/api/solana/my-plans?wallet=${address}`)
      .then((r) => r.json())
      .then(
        (d: { activePlan: PaymentRecord | null; history: PaymentRecord[] }) => {
          setHistory(d.history ?? []);
        }
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [address]);

  const active = history.filter((r) => new Date(r.expiresAt) > new Date());
  const expired = history.filter((r) => new Date(r.expiresAt) <= new Date());

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-white">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Wallet className="h-8 w-8 text-white/40" />
          </div>
          <h2 className="text-xl font-bold text-white/90 mb-2">
            Connect your wallet
          </h2>
          <p className="text-sm text-white/40 mb-6">
            View your active promotions and payment history.
          </p>
          <button
            onClick={() => open({ view: "Connect", namespace: "solana" })}
            className="w-full rounded-2xl bg-white px-6 py-3 text-sm font-bold text-black hover:bg-yellow-300 transition cursor-pointer"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white/90">
              My Dashboard
            </h1>
            <p className="mt-1 font-mono text-xs text-white/40">{address}</p>
          </div>
          <Link
            href="/promote?ca="
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black hover:bg-yellow-300 transition cursor-pointer"
          >
            <Zap className="h-4 w-4" /> New Promotion
          </Link>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && history.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
            <AlertCircle className="h-10 w-10 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 font-semibold">No promotions yet</p>
            <p className="text-white/30 text-sm mt-1 mb-6">
              Start promoting your token to see your history here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-black hover:bg-yellow-300 transition cursor-pointer"
            >
              Promote a Token
            </Link>
          </div>
        )}

        {/* Active promotions */}
        {active.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <h2 className="text-sm font-bold text-white/70 uppercase tracking-wider">
                Active Promotions
              </h2>
            </div>
            <div className="space-y-3">
              {active.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-green-400/20 bg-green-400/5 px-5 py-4 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-400/20 border border-green-400/20">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white/90">{r.planLabel}</p>
                      <p className="text-xs font-mono text-white/40 mt-0.5">
                        {shortAddr(r.ca)}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-green-300">
                        <Clock className="h-3 w-3" /> {timeLeft(r.expiresAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-white/80">
                        {(r.lamports / 1e9).toFixed(4)} SOL
                      </p>
                      <p className="text-xs text-white/40">${r.usd}</p>
                    </div>
                    <Link
                      href={`/token/${r.ca}`}
                      className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 transition cursor-pointer"
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History */}
        {expired.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <History className="h-4 w-4 text-white/40" />
              <h2 className="text-sm font-bold text-white/40 uppercase tracking-wider">
                Past Promotions
              </h2>
            </div>
            <div className="space-y-3">
              {expired.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-white/8 bg-white/3 px-5 py-4 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                      <Clock className="h-5 w-5 text-white/30" />
                    </div>
                    <div>
                      <p className="font-bold text-white/50">{r.planLabel}</p>
                      <p className="text-xs font-mono text-white/30 mt-0.5">
                        {shortAddr(r.ca)}
                      </p>
                      <p className="text-xs text-white/25 mt-1">
                        {new Date(r.paidAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-white/40">
                        {(r.lamports / 1e9).toFixed(4)} SOL
                      </p>
                      <p className="text-xs text-white/25">${r.usd}</p>
                    </div>
                    <a
                      href={`https://solscan.io/tx/${r.signature}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-xs font-semibold text-white/30 hover:bg-white/8 transition cursor-pointer"
                    >
                      Tx <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
