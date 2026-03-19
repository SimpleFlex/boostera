"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useSearchParams } from "next/navigation";
import {
  Trophy,
  Users,
  Sparkles,
  Rocket,
  CheckCircle2,
  Clock,
  Ticket,
  Zap,
} from "lucide-react";
import { PLANS } from "../lib/plans";
import type { PlanId } from "../lib/plans";

function isBase58(v: string) {
  if (v.length < 32 || v.length > 44) return false;
  return /^[1-9A-HJ-NP-Za-km-z]+$/.test(v);
}

function timeLeft(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  return days > 0 ? `${days}d ${hours}h left` : `${hours}h left`;
}

type DropData = {
  totalEntries: number;
  thisWeekEntries: number;
  winners: { addr: string; week: string; sol: string; date: string }[];
};

export default function MemeDropPanels() {
  const router = useRouter();
  const sp = useSearchParams();
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount({ namespace: "solana" });

  // Read active plan from URL params (set after payment)
  const urlCa = sp.get("ca") ?? "";
  const urlPlan = sp.get("plan") ?? "";
  const urlSig = sp.get("sig") ?? "";
  const activePlanObj = PLANS[urlPlan as PlanId] ?? null;
  const hasActivePlan = activePlanObj && isBase58(urlCa);

  const [ca, setCa] = useState(urlCa);
  const [touched, setTouched] = useState(false);
  const [dropData, setDropData] = useState<DropData | null>(null);
  const [twitter, setTwitter] = useState("");
  const [email, setEmail] = useState("");
  const [notifSent, setNotifSent] = useState(false);

  const isValid = isBase58(ca.trim());

  // Fetch entries + winners
  useEffect(() => {
    fetch("/api/memedrop")
      .then((r) => r.json())
      .then((d: DropData) => setDropData(d))
      .catch(() => {});
  }, []);

  const handlePromote = () => {
    if (!isConnected) {
      open({ view: "Connect", namespace: "solana" });
      return;
    }
    setTouched(true);
    if (!isValid) return;
    router.push(`/promote?ca=${encodeURIComponent(ca.trim())}`);
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-6xl space-y-6">
      {/* ── Active Plan Banner ─────────────────────────────────────────────── */}
      {hasActivePlan && (
        <div className="rounded-3xl border border-green-400/30 bg-green-400/8 p-5 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-400/20 border border-green-400/20">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-green-400/70">
                  Active Promotion
                </p>
                <p className="font-extrabold text-white/90">
                  {activePlanObj.label}
                </p>
                <p className="text-xs text-green-300/60 font-mono mt-0.5">
                  {urlCa.slice(0, 10)}...{urlCa.slice(-6)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 rounded-xl border border-green-400/20 bg-green-400/10 px-3 py-2 text-xs font-semibold text-green-300">
                <Ticket className="h-3.5 w-3.5" />
                Entered in this week&apos;s draw ✓
              </div>
              {urlSig && (
                <a
                  href={`https://solscan.io/tx/${urlSig}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-white/30 hover:text-white transition cursor-pointer font-mono"
                >
                  Tx ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Entry stats bar ──────────────────────────────────────────────── */}
      {dropData && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/8 bg-white/4 px-5 py-4 flex items-center gap-3">
            <Ticket className="h-5 w-5 text-purple-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-white/40">This Week</p>
              <p className="text-xl font-extrabold text-white/90">
                {dropData.thisWeekEntries}{" "}
                <span className="text-sm font-semibold text-white/40">
                  entries
                </span>
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/4 px-5 py-4 flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-white/40">Total Entries</p>
              <p className="text-xl font-extrabold text-white/90">
                {dropData.totalEntries}
              </p>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 px-5 py-4 flex items-center gap-3">
            <Zap className="h-5 w-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-yellow-400/60">Prize Pool</p>
              <p className="text-xl font-extrabold text-yellow-300">1 SOL</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Main panels ───────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT: How it works + CTA */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_30px_120px_-70px_rgba(0,0,0,0.55)]">
          <div className="p-7 sm:p-8">
            <h2 className="text-xl font-extrabold tracking-tight text-white/90 sm:text-2xl">
              How MemeDrop Works
            </h2>

            <div className="mt-6 space-y-5">
              {[
                {
                  num: "1",
                  color: "bg-purple-500",
                  textColor: "text-purple-300",
                  title: "Promote Your Meme Coin",
                  desc: (
                    <>
                      Pay{" "}
                      <span className="font-extrabold text-yellow-300">
                        $15
                      </span>{" "}
                      to promote your token and get entered into the weekly
                      draw.
                    </>
                  ),
                },
                {
                  num: "2",
                  color: "bg-pink-500",
                  textColor: "text-pink-300",
                  title: "Automatic Entry",
                  desc: "You're automatically entered into the weekly MemeDrop raffle. One entry per $15 paid.",
                },
                {
                  num: "3",
                  color: "bg-green-500",
                  textColor: "text-green-300",
                  title: (
                    <>
                      Win <span className="text-yellow-300">1 SOL</span>
                    </>
                  ),
                  desc: (
                    <>
                      Winner announced every{" "}
                      <span className="font-semibold text-white/85">
                        Sunday at 9PM UTC
                      </span>
                      . Paid directly to your wallet.
                    </>
                  ),
                },
              ].map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${step.color} text-sm font-extrabold text-white`}
                  >
                    {step.num}
                  </div>
                  <div>
                    <p className={`text-sm font-extrabold ${step.textColor}`}>
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-white/65">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CA input */}
            <div className="mt-7 space-y-3">
              <input
                value={ca}
                onChange={(e) => setCa(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder={
                  isConnected
                    ? "Enter your token contract address..."
                    : "Connect wallet first..."
                }
                disabled={!isConnected}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-3.5 text-sm text-white/90 placeholder:text-white/35 outline-none focus:border-white/20 transition disabled:opacity-50 cursor-text"
              />

              {touched && ca && !isValid && (
                <p className="text-xs text-red-400">
                  That doesn&apos;t look like a valid Solana address.
                </p>
              )}

              <button
                type="button"
                onClick={handlePromote}
                disabled={isConnected && touched && !isValid}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:opacity-95 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                <Rocket className="h-4 w-4" />
                {!isConnected
                  ? "Connect Wallet to Enter"
                  : "⚡ Promote & Enter Draw"}
              </button>

              <p className="text-center text-xs text-white/40">
                Entry fee:{" "}
                <span className="text-yellow-300 font-semibold">
                  $15 Discovery plan
                </span>{" "}
                · Paid in SOL
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Updates + Winners */}
        <div className="lg:col-span-1 space-y-6">
          {/* Get Updates */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl shadow-[0_30px_120px_-70px_rgba(0,0,0,0.55)]">
            <h3 className="text-base font-extrabold text-white/90">
              Get Updates (Optional)
            </h3>
            <div className="mt-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-white/60">
                  Twitter Handle
                </label>
                <input
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/90 placeholder:text-white/35 outline-none focus:border-white/20"
                  placeholder="@yourusername"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-white/60">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/90 placeholder:text-white/35 outline-none focus:border-white/20"
                  placeholder="your@email.com"
                />
              </div>
              {notifSent ? (
                <div className="flex items-center gap-2 rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm font-semibold text-green-300">
                  <CheckCircle2 className="h-4 w-4" /> You&apos;re on the list!
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (twitter || email) setNotifSent(true);
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3 text-sm font-extrabold text-white transition hover:opacity-95 cursor-pointer"
                >
                  🟦 Get Winner Notifications
                </button>
              )}
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs font-semibold text-white/60">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                No spam. Opt-out anytime.
              </div>
            </div>
          </div>

          {/* Previous Winners */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl shadow-[0_30px_120px_-70px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-center gap-2 mb-5">
              <Trophy className="h-4 w-4 text-yellow-300" />
              <h3 className="text-base font-extrabold text-white/90">
                Previous Winners
              </h3>
            </div>
            <div className="space-y-3">
              {(
                dropData?.winners ?? [
                  { addr: "9WzDXw...K7pQm", week: "Week 1", sol: "1 SOL" },
                  { addr: "7VbGHs...N2xRt", week: "Week 2", sol: "1 SOL" },
                  { addr: "4KcMnP...J8wVk", week: "Week 3", sol: "1 SOL" },
                ]
              ).map((w) => (
                <div
                  key={w.week}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-extrabold text-yellow-300">
                      {w.addr}
                    </p>
                    <p className="text-xs text-white/55">{w.week}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-green-300">
                      {w.sol}
                    </p>
                    <p className="text-xs text-white/55">Won</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-white/60">
              <Clock className="h-4 w-4 text-green-300" />
              Updated every Sunday 9PM UTC
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
