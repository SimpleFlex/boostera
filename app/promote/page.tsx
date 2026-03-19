"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppKitAccount } from "@reown/appkit/react";
import { PLANS, type PlanId } from "../lib/plans";
import type { PaymentRecord } from "../lib/paymentsStore";
import {
  Zap,
  CheckCircle2,
  Clock,
  History,
  TrendingUp,
  Shield,
  Star,
  Crown,
  Rocket,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────────

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatSol(lamports: number, solPrice: number | null) {
  const sol = lamports / 1_000_000_000;
  if (!solPrice) return `${sol.toFixed(4)} SOL`;
  const usd = sol * solPrice;
  return `${sol.toFixed(4)} SOL (~$${usd.toFixed(2)})`;
}

function timeLeft(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  return days > 0 ? `${days}d ${hours}h remaining` : `${hours}h remaining`;
}

const PLAN_ICONS: Record<PlanId, React.ElementType> = {
  discovery: Rocket,
  starter: TrendingUp,
  growth: Zap,
  authority: Shield,
  authority_plus: Crown,
};

const PLAN_COLORS: Record<
  PlanId,
  { border: string; glow: string; badge: string; icon: string }
> = {
  discovery: {
    border: "border-blue-400/30",
    glow: "shadow-blue-500/10",
    badge: "bg-blue-500/20 text-blue-300",
    icon: "text-blue-400",
  },
  starter: {
    border: "border-green-400/30",
    glow: "shadow-green-500/10",
    badge: "bg-green-500/20 text-green-300",
    icon: "text-green-400",
  },
  growth: {
    border: "border-yellow-400/30",
    glow: "shadow-yellow-500/10",
    badge: "bg-yellow-500/20 text-yellow-300",
    icon: "text-yellow-400",
  },
  authority: {
    border: "border-purple-400/30",
    glow: "shadow-purple-500/10",
    badge: "bg-purple-500/20 text-purple-300",
    icon: "text-purple-400",
  },
  authority_plus: {
    border: "border-orange-400/30",
    glow: "shadow-orange-500/10",
    badge: "bg-orange-500/20 text-orange-300",
    icon: "text-orange-400",
  },
};

// ── Main inner component ───────────────────────────────────────────────────────

function PromoteInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const { address, isConnected } = useAppKitAccount({ namespace: "solana" });

  const ca = (sp.get("ca") ?? "").trim();
  const validCA = useMemo(() => {
    if (ca.length < 32 || ca.length > 44) return false;
    return /^[1-9A-HJ-NP-Za-km-z]+$/.test(ca);
  }, [ca]);

  // ── State ──────────────────────────────────────────────────────────────────
  const [selected, setSelected] = useState<PlanId>("starter");
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [priceAge, setPriceAge] = useState(0);
  const [tab, setTab] = useState<"plans" | "history">("plans");
  const [activePlan, setActivePlan] = useState<PaymentRecord | null>(null);
  const [history, setHistory] = useState<PaymentRecord[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  // ── Fetch live SOL price ───────────────────────────────────────────────────
  const fetchSolPrice = useCallback(async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
        { cache: "no-store" }
      );
      const json = (await res.json()) as { solana: { usd: number } };
      setSolPrice(json.solana.usd);
      setPriceAge(0);
    } catch {
      // keep old price
    }
  }, []);

  useEffect(() => {
    fetchSolPrice();
    const interval = setInterval(fetchSolPrice, 30_000);
    return () => clearInterval(interval);
  }, [fetchSolPrice]);

  // Age counter
  useEffect(() => {
    const t = setInterval(() => setPriceAge((a) => a + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // ── Fetch active plan + history ────────────────────────────────────────────
  useEffect(() => {
    if (!address) return;
    setLoadingPlans(true);
    fetch(`/api/solana/my-plans?wallet=${address}&ca=${encodeURIComponent(ca)}`)
      .then((r) => r.json())
      .then(
        (d: { activePlan: PaymentRecord | null; history: PaymentRecord[] }) => {
          setActivePlan(d.activePlan);
          setHistory(d.history);
        }
      )
      .catch(() => {})
      .finally(() => setLoadingPlans(false));
  }, [address, ca]);

  const chosen = PLANS[selected];

  const solAmount = useMemo(() => {
    if (!solPrice) return (chosen.lamports / 1_000_000_000).toFixed(4);
    return (chosen.usd / solPrice).toFixed(4);
  }, [chosen, solPrice]);

  const onContinue = () => {
    router.push(
      `/checkout?ca=${encodeURIComponent(ca)}&plan=${encodeURIComponent(selected)}`
    );
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        {/* ── Top bar ─────────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 transition cursor-pointer"
          >
            ← Back
          </Link>
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold ${solPrice ? "bg-green-500/10 text-green-300 border border-green-500/20" : "bg-white/5 text-white/40 border border-white/10"}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${solPrice ? "bg-green-400 animate-pulse" : "bg-white/30"}`}
              />
              {solPrice
                ? `1 SOL = $${solPrice.toLocaleString()}`
                : "Fetching price..."}
              {solPrice && (
                <span className="text-white/30 ml-1">{priceAge}s ago</span>
              )}
            </div>
            <div className="text-xs text-white/40">Step 2 of 3</div>
          </div>
        </div>

        {/* ── CA + active plan header ──────────────────────────────────────── */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Token Address
              </p>
              <p className="mt-1 font-mono text-sm text-white/80 break-all">
                {ca || "—"}
              </p>
              {!validCA && (
                <p className="mt-2 text-xs text-red-400">
                  Invalid token address. Go back and re-enter.
                </p>
              )}
            </div>

            {activePlan && (
              <div className="flex items-center gap-2 rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-2">
                <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-green-300">
                    Active Plan
                  </p>
                  <p className="text-xs text-green-300/70">
                    {activePlan.planLabel}
                  </p>
                  <p className="text-xs text-green-300/50 flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" />{" "}
                    {timeLeft(activePlan.expiresAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────────── */}
        <div className="mb-6 flex gap-2">
          {(["plans", "history"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition cursor-pointer ${
                tab === t
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {t === "plans" ? (
                <>
                  <Star className="h-4 w-4" /> Plans
                </>
              ) : (
                <>
                  <History className="h-4 w-4" /> History{" "}
                  {history.length > 0 && (
                    <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
                      {history.length}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>

        {/* ── Plans tab ───────────────────────────────────────────────────── */}
        {tab === "plans" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(Object.keys(PLANS) as PlanId[]).map((id) => {
                const p = PLANS[id];
                const active = id === selected;
                const colors = PLAN_COLORS[id];
                const Icon = PLAN_ICONS[id];
                const solAmt = solPrice
                  ? (p.usd / solPrice).toFixed(4)
                  : (p.lamports / 1_000_000_000).toFixed(4);
                const isCurrentPlan = activePlan?.plan === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelected(id)}
                    className={`relative rounded-2xl border p-5 text-left transition-all duration-200 cursor-pointer ${
                      active
                        ? `${colors.border} bg-white/8 shadow-lg ${colors.glow}`
                        : "border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15"
                    }`}
                  >
                    {/* Active plan badge */}
                    {isCurrentPlan && (
                      <div className="absolute -top-2.5 left-4 flex items-center gap-1 rounded-full bg-green-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
                        <CheckCircle2 className="h-3 w-3" /> ACTIVE
                      </div>
                    )}

                    {/* Selected indicator */}
                    {active && (
                      <div className="absolute -top-2.5 right-4 flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-black">
                        ✓ Selected
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5`}
                      >
                        <Icon className={`h-4 w-4 ${colors.icon}`} />
                      </div>
                      <span
                        className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${colors.badge}`}
                      >
                        ${p.usd}
                      </span>
                    </div>

                    <p className="font-bold text-white/90 text-sm leading-tight mb-1">
                      {p.label}
                    </p>
                    <p className="text-xs text-white/40 mb-1">{p.purpose}</p>
                    <p className="text-xs font-semibold text-white/50 mb-3">
                      ⏱ {p.durationDays} {p.durationDays === 1 ? "day" : "days"}{" "}
                      promotion
                    </p>

                    {/* Live SOL price */}
                    <div
                      className={`rounded-lg px-3 py-2 mb-3 ${colors.badge} bg-opacity-50`}
                    >
                      <p className="text-xs font-bold">
                        {solAmt} SOL
                        {solPrice && (
                          <span className="font-normal text-white/50 ml-1">
                            ≈ ${p.usd}
                          </span>
                        )}
                      </p>
                      {!solPrice && (
                        <p className="text-[10px] text-white/30 mt-0.5 animate-pulse">
                          Fetching live price...
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-1.5">
                      {p.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-1.5 text-xs text-white/60"
                        >
                          <span
                            className={`mt-0.5 flex-shrink-0 ${colors.icon}`}
                          >
                            ✓
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            {/* ── Sticky checkout bar ───────────────────────────────────── */}
            <div className="mt-6 sticky bottom-4">
              <div className="rounded-2xl border border-white/10 bg-black/40 px-6 py-4 backdrop-blur-2xl flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-white/40">Selected plan</p>
                  <p className="font-bold text-white/90">{chosen.label}</p>
                  <p className="text-xs text-white/50 mt-0.5">
                    {solPrice ? (
                      <>
                        <span className="text-yellow-300 font-semibold">
                          {solAmount} SOL
                        </span>{" "}
                        ≈ ${chosen.usd}
                      </>
                    ) : (
                      <span className="animate-pulse text-white/30">
                        Loading live price...
                      </span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!validCA || !isConnected}
                  onClick={onContinue}
                  className="rounded-xl bg-white px-8 py-3 text-sm font-bold text-black hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── History tab ─────────────────────────────────────────────────── */}
        {tab === "history" && (
          <div className="space-y-3">
            {loadingPlans && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/40 animate-pulse">
                Loading history...
              </div>
            )}

            {!loadingPlans && history.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
                <History className="h-8 w-8 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/40">No payment history yet.</p>
                <p className="text-xs text-white/25 mt-1">
                  Your transactions will appear here after payment.
                </p>
              </div>
            )}

            {history.map((record) => {
              const colors =
                PLAN_COLORS[record.plan as PlanId] ?? PLAN_COLORS.starter;
              const expired = new Date(record.expiresAt) < new Date();

              return (
                <div
                  key={record.id}
                  className="rounded-2xl border border-white/8 bg-white/4 px-5 py-4 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center border ${colors.border} bg-white/5`}
                    >
                      {expired ? (
                        <Clock className="h-4 w-4 text-white/30" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/90">
                        {record.planLabel}
                      </p>
                      <p className="text-xs text-white/40 font-mono">
                        {shortAddr(record.ca)}
                      </p>
                      <p className="text-xs text-white/30 mt-0.5">
                        {new Date(record.paidAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-white/80">
                      {(record.lamports / 1_000_000_000).toFixed(4)} SOL
                    </p>
                    <p className="text-xs text-white/40">${record.usd}</p>
                    <div
                      className={`mt-1 inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                        expired
                          ? "bg-white/5 text-white/30"
                          : "bg-green-500/15 text-green-300"
                      }`}
                    >
                      {expired ? "Expired" : timeLeft(record.expiresAt)}
                    </div>
                  </div>

                  <a
                    href={`https://solscan.io/tx/${record.signature}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-white/30 hover:text-white transition font-mono cursor-pointer"
                  >
                    {record.signature.slice(0, 12)}... ↗
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PromotePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white/40 animate-pulse text-sm">Loading...</div>
        </div>
      }
    >
      <PromoteInner />
    </Suspense>
  );
}
