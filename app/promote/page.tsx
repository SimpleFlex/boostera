"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { PACKAGES } from "../../lib/packages";

function detectChain(ca: string): string {
  if (ca.startsWith("0x") && ca.length === 42) return "Ethereum";
  if (ca.length === 44 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(ca)) return "Solana";
  return "Unknown";
}

function PromoteInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ca = searchParams.get("ca") || "";
  
  const [chain, setChain] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ca) {
      router.push("/");
      return;
    }
    const detected = detectChain(ca);
    setChain(detected);
    setLoading(false);
  }, [ca, router]);

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleContinue = () => {
    if (selectedPackage) {
      router.push(`/checkout?ca=${encodeURIComponent(ca)}&package=${selectedPackage.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => router.back()}
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="mb-4 text-lg font-semibold text-white/90">Token Information</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-sm text-white/50">Contract Address</span>
                  <span className="font-mono text-sm text-white/80">
                    {ca.slice(0, 8)}...{ca.slice(-6)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Detected Chain</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">
                    {chain}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-white/90">Select Your Package</h2>
            <div className="space-y-4">
              {PACKAGES && PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => handleSelectPackage(pkg)}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                    selectedPackage?.id === pkg.id
                      ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white/90">{pkg.name}</h3>
                        {pkg.popular && <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-300">Popular</span>}
                        {pkg.badge && <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300">{pkg.badge}</span>}
                      </div>
                      <p className="mt-1 text-sm text-white/50">Duration: {pkg.duration}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">${pkg.price.usd}</div>
                      <div className="text-xs text-white/40">≈ {pkg.price.usdt} USDT</div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pkg.features.slice(0, 3).map((feature) => (
                      <span key={feature} className="flex items-center gap-1 text-xs text-white/60">
                        <CheckCircle2 className="h-3 w-3 text-green-400" />
                        {feature}
                      </span>
                    ))}
                    {pkg.features.length > 3 && <span className="text-xs text-white/40">+{pkg.features.length - 3} more</span>}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleContinue}
              disabled={!selectedPackage}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 py-4 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-50"
            >
              Continue to Payment <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PromotePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <PromoteInner />
    </Suspense>
  );
}
