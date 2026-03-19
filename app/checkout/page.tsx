"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Connection, Transaction } from "@solana/web3.js";
import { useAppKitAccount } from "@reown/appkit/react";
import { PLANS, type PlanId } from "../lib/plans";
import { Buffer } from "buffer";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  Wallet,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

type CreateTxResponse = {
  transactionBase64: string;
  amountLamports: number;
  merchant: string;
  planLabel: string;
};

type SolanaProvider = {
  isPhantom?: boolean;
  publicKey?: { toBase58(): string };
  signAndSendTransaction?: (tx: Transaction) => Promise<{ signature: string }>;
  signTransaction?: (tx: Transaction) => Promise<Transaction>;
};

function getProvider(): SolanaProvider | null {
  const w = window as unknown as { solana?: SolanaProvider };
  return w.solana ?? null;
}

type PayStep =
  | "idle"
  | "building"
  | "signing"
  | "confirming"
  | "verifying"
  | "done"
  | "error";

const STEP_LABELS: Record<PayStep, string> = {
  idle: "Pay with Wallet",
  building: "Preparing transaction...",
  signing: "Approve in your wallet...",
  confirming: "Confirming on-chain...",
  verifying: "Verifying payment...",
  done: "Payment confirmed ✓",
  error: "Payment failed",
};

function CheckoutInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const { address, isConnected } = useAppKitAccount({ namespace: "solana" });

  const ca = (sp.get("ca") ?? "").trim();
  const plan = (sp.get("plan") ?? "starter") as PlanId;

  const validCA = useMemo(() => {
    if (ca.length < 32 || ca.length > 44) return false;
    return /^[1-9A-HJ-NP-Za-km-z]+$/.test(ca);
  }, [ca]);

  const planConfig = PLANS[plan];
  const planOk = Boolean(planConfig);

  const [step, setStep] = useState<PayStep>("idle");
  const [errMsg, setErrMsg] = useState("");
  const [sig, setSig] = useState("");
  const [solPrice, setSolPrice] = useState<number | null>(null);

  // Live SOL price
  const fetchSolPrice = useCallback(async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
        { cache: "no-store" }
      );
      const json = (await res.json()) as { solana: { usd: number } };
      setSolPrice(json.solana.usd);
    } catch {
      /* keep old */
    }
  }, []);

  useEffect(() => {
    fetchSolPrice();
    const t = setInterval(fetchSolPrice, 30_000);
    return () => clearInterval(t);
  }, [fetchSolPrice]);

  const solAmount = useMemo(() => {
    if (!planConfig) return "—";
    if (solPrice) return (planConfig.usd / solPrice).toFixed(4);
    return (planConfig.lamports / 1_000_000_000).toFixed(4);
  }, [planConfig, solPrice]);

  const rpc =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ??
    "https://api.mainnet-beta.solana.com";

  const pay = async () => {
    try {
      setErrMsg("");
      setStep("building");

      if (!isConnected || !address)
        throw new Error("Connect your wallet first.");
      if (!validCA) throw new Error("Invalid token address.");
      if (!planOk) throw new Error("Invalid plan.");

      // 1. Create transaction
      const createRes = await fetch("/api/solana/create-payment-tx", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ payer: address, plan, ca }),
      });
      if (!createRes.ok) throw new Error(await createRes.text());
      const createJson = (await createRes.json()) as CreateTxResponse;

      const provider = getProvider();
      if (!provider)
        throw new Error("No Solana wallet found. Install Phantom.");

      const connection = new Connection(rpc, "confirmed");
      const tx = Transaction.from(
        Buffer.from(createJson.transactionBase64, "base64")
      );

      // 2. Sign
      setStep("signing");
      let signature: string | null = null;

      if (provider.signAndSendTransaction) {
        const out = await provider.signAndSendTransaction(tx);
        signature = out?.signature ?? null;
      } else if (provider.signTransaction) {
        const signed = await provider.signTransaction(tx);
        signature = await connection.sendRawTransaction(signed.serialize());
      }

      if (!signature) throw new Error("No signature returned from wallet.");
      setSig(signature);

      // 3. Confirm
      setStep("confirming");
      await connection.confirmTransaction(signature, "confirmed");

      // 4. Verify
      setStep("verifying");
      const verifyRes = await fetch("/api/solana/verify-payment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ signature, payer: address, plan, ca }),
      });
      if (!verifyRes.ok) throw new Error(await verifyRes.text());

      setStep("done");

      setTimeout(() => {
        router.push(
          `/memedrop?ca=${encodeURIComponent(ca)}&plan=${encodeURIComponent(plan)}&sig=${encodeURIComponent(signature!)}`
        );
      }, 2000);
    } catch (e: unknown) {
      setStep("error");
      setErrMsg(e instanceof Error ? e.message : "Payment failed");
    }
  };

  const isLoading = !["idle", "done", "error"].includes(step);
  const isDone = step === "done";

  if (!planConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center max-w-sm">
          <p className="text-red-300 font-semibold">Invalid plan selected.</p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm text-white/50 hover:text-white"
          >
            ← Go back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Back */}
        <Link
          href={`/promote?ca=${encodeURIComponent(ca)}`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition cursor-pointer"
        >
          ← Back to plans
        </Link>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden">
          {/* Top accent */}
          <div className="h-1 w-full bg-gradient-to-r from-yellow-300 via-green-400 to-cyan-400" />

          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Wallet className="h-5 w-5 text-white/80" />
              </div>
              <div>
                <p className="font-bold text-white/90">Complete Payment</p>
                <p className="text-xs text-white/40">Step 3 of 3</p>
              </div>
            </div>

            {/* Plan summary */}
            <div className="rounded-2xl border border-white/8 bg-white/5 p-5 mb-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/40 uppercase tracking-wider">
                  Plan
                </p>
                <p className="text-sm font-bold text-white/90">
                  {planConfig.label}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/40 uppercase tracking-wider">
                  Amount
                </p>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-yellow-300">
                    {solAmount} SOL
                  </p>
                  <p className="text-xs text-white/40">
                    ≈ ${planConfig.usd} USD
                  </p>
                </div>
              </div>
              <div className="h-px bg-white/8" />
              <div className="flex items-start justify-between">
                <p className="text-xs text-white/40 uppercase tracking-wider">
                  Token CA
                </p>
                <p className="text-xs text-white/60 font-mono text-right max-w-[200px] break-all">
                  {ca}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/40 uppercase tracking-wider">
                  Duration
                </p>
                <p className="text-xs text-white/70 font-semibold">
                  {planConfig.durationDays}{" "}
                  {planConfig.durationDays === 1 ? "day" : "days"}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6 space-y-1.5">
              {planConfig.features.map((f) => (
                <div
                  key={f}
                  className="flex items-start gap-2 text-xs text-white/55"
                >
                  <Zap className="h-3 w-3 text-yellow-300 flex-shrink-0 mt-0.5" />
                  {f}
                </div>
              ))}
            </div>

            {/* Progress steps */}
            {isLoading && (
              <div className="mb-5 space-y-2">
                {(
                  [
                    "building",
                    "signing",
                    "confirming",
                    "verifying",
                  ] as PayStep[]
                ).map((s) => {
                  const idx = [
                    "building",
                    "signing",
                    "confirming",
                    "verifying",
                  ].indexOf(s);
                  const currIdx = [
                    "building",
                    "signing",
                    "confirming",
                    "verifying",
                  ].indexOf(step);
                  const isDone = idx < currIdx;
                  const isCurrent = idx === currIdx;

                  return (
                    <div
                      key={s}
                      className={`flex items-center gap-3 text-xs transition-all ${
                        isDone
                          ? "text-green-400"
                          : isCurrent
                            ? "text-white/80"
                            : "text-white/20"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-current flex-shrink-0" />
                      )}
                      {STEP_LABELS[s]}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Done state */}
            {isDone && (
              <div className="mb-5 rounded-2xl border border-green-400/30 bg-green-400/10 p-5 text-center">
                <CheckCircle2 className="h-10 w-10 text-green-400 mx-auto mb-2" />
                <p className="font-bold text-green-300">Payment Confirmed!</p>
                <p className="text-xs text-green-300/60 mt-1">
                  Redirecting to your promotion...
                </p>
                {sig && (
                  <a
                    href={`https://solscan.io/tx/${sig}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs text-white/30 hover:text-white transition font-mono cursor-pointer"
                  >
                    View on Solscan ↗
                  </a>
                )}
              </div>
            )}

            {/* Error */}
            {step === "error" && errMsg && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-sm text-red-300">⚠️ {errMsg}</p>
                <button
                  type="button"
                  onClick={() => setStep("idle")}
                  className="mt-2 text-xs text-white/40 hover:text-white transition cursor-pointer"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Pay button */}
            {!isDone && (
              <button
                type="button"
                onClick={pay}
                disabled={isLoading || !validCA || !planOk || !isConnected}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-black hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />{" "}
                    {STEP_LABELS[step]}
                  </>
                ) : step === "error" ? (
                  "Try Again"
                ) : (
                  <>
                    <Wallet className="h-4 w-4" /> Pay {solAmount} SOL{" "}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}

            {/* Trust note */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/25">
              <ShieldCheck className="h-3.5 w-3.5 text-green-400/50" />
              Secured by Solana blockchain · Non-refundable
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-white/40" />
        </div>
      }
    >
      <CheckoutInner />
    </Suspense>
  );
}
