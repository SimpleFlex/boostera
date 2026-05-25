"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Copy, Loader2, Mail, RefreshCw } from "lucide-react";
import { PACKAGES, PAYMENT_ADDRESSES, PAYMENT_NETWORKS } from "../../lib/packages";

function detectChain(ca: string): string {
  if (ca.startsWith("0x") && ca.length === 42) return "Ethereum";
  if (ca.length === 44 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(ca)) return "Solana";
  return "Unknown";
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ca = searchParams.get("ca") || "";
  const packageId = searchParams.get("package") || "";
  
  const selectedPackage = PACKAGES.find(p => p.id === packageId);
  const [selectedMethod, setSelectedMethod] = useState<string>("USDT_TRC20");
  const [txHash, setTxHash] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [prices, setPrices] = useState<any>(null);
  const [cryptoAmounts, setCryptoAmounts] = useState<Record<string, number>>({});
  const [loadingPrices, setLoadingPrices] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch("/api/prices");
        const data = await response.json();
        if (data.success) {
          setPrices(data.prices);
          const usdAmount = selectedPackage?.price.usd || 0;
          setCryptoAmounts({
            BTC: usdAmount / data.prices.bitcoin,
            ETH: usdAmount / data.prices.ethereum,
            SOL: usdAmount / data.prices.solana,
            BNB: usdAmount / data.prices.binancecoin,
            USDT: usdAmount,
          });
        }
      } catch (error) {
        console.error("Failed to fetch prices:", error);
      } finally {
        setLoadingPrices(false);
      }
    };
    
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [selectedPackage]);

  if (!selectedPackage) {
    return <div className="min-h-screen flex items-center justify-center">Invalid package</div>;
  }

  const chain = detectChain(ca);
  const currentMethod = PAYMENT_NETWORKS[selectedMethod as keyof typeof PAYMENT_NETWORKS];
  const paymentAddress = PAYMENT_ADDRESSES[selectedMethod as keyof typeof PAYMENT_ADDRESSES];
  const currentCryptoAmount = cryptoAmounts[selectedMethod === "USDT_TRC20" ? "USDT" : selectedMethod] || selectedPackage.price.usd;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSubmit = async () => {
    if (!txHash.trim()) {
      setError("Please enter your transaction hash");
      return;
    }
    if (!userEmail.trim()) {
      setError("Please enter your email to track your campaign");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      let userId = localStorage.getItem("boostera_user_id");
      if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem("boostera_user_id", userId);
      }
      
      const response = await fetch("/api/submit-promotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ca,
          chain,
          packageId: selectedPackage.id,
          packageName: selectedPackage.name,
          amount: selectedPackage.price.usd,
          paymentMethod: selectedMethod,
          txHash,
          userEmail: userEmail.trim(),
          userId,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }
      
      localStorage.setItem("boostera_user_email", userEmail.trim());
      setSubmitted(true);
      setTimeout(() => {
        router.push(`/my-campaigns`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentMethods = [
    { id: "BTC", name: "Bitcoin", network: "Bitcoin Network", icon: "₿" },
    { id: "USDT_TRC20", name: "USDT", network: "TRC20 (Tron)", icon: "₮" },
    { id: "USDT_ERC20", name: "USDT", network: "ERC20 (Ethereum)", icon: "₮" },
    { id: "USDT_BEP20", name: "USDT", network: "BEP20 (BNB Chain)", icon: "₮" },
    { id: "BNB", name: "BNB", network: "BEP20 (BNB Chain)", icon: "🔶" },
    { id: "ETH", name: "Ethereum", network: "ERC20", icon: "⟠" },
    { id: "SOL", name: "Solana", network: "Solana", icon: "◎" },
  ];

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <button onClick={() => router.back()} className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition">
          <ArrowLeft className="h-4 w-4" /> Back to packages
        </button>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sticky top-24">
              <h3 className="mb-4 text-lg font-semibold text-white/90">Order Summary</h3>
              <div className="space-y-3 border-b border-white/10 pb-4">
                <div className="flex justify-between text-sm"><span className="text-white/50">Package</span><span className="text-white/80">{selectedPackage.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/50">Duration</span><span className="text-white/80">{selectedPackage.duration}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/50">Chain</span><span className="text-white/80">{chain}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/50">Token CA</span><span className="font-mono text-xs text-white/60">{ca.slice(0, 8)}...{ca.slice(-6)}</span></div>
              </div>
              <div className="mt-4 flex justify-between text-lg font-bold"><span>Total</span><span className="text-blue-400">${selectedPackage.price.usd} USD</span></div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {!submitted ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <h3 className="mb-4 text-lg font-semibold text-white/90">Select Payment Method</h3>
                
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`rounded-xl border p-3 text-center transition ${
                        selectedMethod === method.id
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="text-2xl">{method.icon}</div>
                      <div className="mt-1 text-sm font-semibold">{method.name}</div>
                      <div className="text-xs text-white/40">{method.network}</div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-white/50">Amount to send:</p>
                    {loadingPrices && <Loader2 className="h-4 w-4 animate-spin text-white/40" />}
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">
                      {loadingPrices ? "Loading..." : `${currentCryptoAmount.toFixed(currentMethod?.decimals || 2)} ${selectedMethod === "USDT_TRC20" ? "USDT" : selectedMethod}`}
                    </p>
                    <p className="text-sm text-white/40 mt-1">≈ ${selectedPackage.price.usd} USD</p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4">
                  <p className="mb-2 text-sm text-white/50">Send to this address:</p>
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-white/5 p-3 font-mono text-sm">
                    <span className="break-all text-white/80">{paymentAddress}</span>
                    <button onClick={() => handleCopy(paymentAddress)} className="flex-shrink-0 rounded-lg bg-white/10 p-2 hover:bg-white/20 transition">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-white/40">
                    Network: {currentMethod?.network} - Send only {currentMethod?.name} to this address
                  </p>
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-sm text-white/50">Your Email <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-blue-500/50"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-sm text-white/50">Transaction Hash / Payment Proof <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="Paste your transaction hash here..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-blue-500/50"
                  />
                  <p className="mt-2 text-xs text-white/40">After sending payment, paste your transaction hash here. Our team will verify within 24 hours.</p>
                </div>

                {error && (
                  <div className="mt-4 rounded-xl bg-red-500/20 p-3 text-center text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!txHash.trim() || !userEmail.trim() || isSubmitting}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 py-4 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-50"
                >
                  {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Submitting...</> : <>I Have Paid →</>}
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center backdrop-blur-xl">
                <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-400" />
                <h3 className="text-xl font-bold text-white/90">Payment Submitted!</h3>
                <p className="mt-2 text-white/60">Your promotion request has been received. We'll send updates to {userEmail}</p>
                <p className="mt-4 text-sm text-white/40">Transaction ID: {txHash.slice(0, 20)}...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
