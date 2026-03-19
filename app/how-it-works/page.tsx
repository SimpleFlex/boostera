"use client";

import Link from "next/link";
import {
  Wallet,
  FileSearch,
  CreditCard,
  Rocket,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Wallet,
    title: "Connect Your Wallet",
    description:
      "Connect your Solana wallet (Phantom or Solflare). No email or sign-up required. Your wallet is your identity.",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
    glow: "shadow-blue-500/20",
  },
  {
    number: "02",
    icon: FileSearch,
    title: "Enter Your Token Address",
    description:
      "Paste your Solana token contract address. We verify it on-chain instantly against DexScreener data.",
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
    glow: "shadow-purple-500/20",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Choose a Plan & Pay",
    description:
      "Select from 5 promotion tiers starting at $15. Pay directly from your wallet in SOL. Prices update live with the market.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
    glow: "shadow-yellow-500/20",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Your Promotion Goes Live",
    description:
      "Your token gets listed on DexScreener, DEXTools, and Birdeye banners. Promotion runs for 30 days from payment.",
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
    glow: "shadow-green-500/20",
  },
  {
    number: "05",
    icon: CheckCircle2,
    title: "Track & Verify",
    description:
      "Track your promotion status in your dashboard. All payments are verifiable on-chain via Solscan at any time.",
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/20",
    glow: "shadow-orange-500/20",
  },
];

const FAQS = [
  {
    q: "Is my payment refundable?",
    a: "No. All payments are final and non-refundable. Promotions begin immediately after payment confirmation on-chain.",
  },
  {
    q: "How long does promotion last?",
    a: "Every plan runs for 30 days from the date of payment. You can re-purchase at any time to extend.",
  },
  {
    q: "Can I verify my payment?",
    a: "Yes. Every payment generates a Solana transaction signature. You can verify it on Solscan at any time.",
  },
  {
    q: "What wallets are supported?",
    a: "Phantom and Solflare browser extensions are supported. Mobile wallets coming soon.",
  },
  {
    q: "What is MemeDrop?",
    a: "MemeDrop is a weekly raffle where every $15 Discovery plan purchase earns one entry. Winner receives 1 SOL every Sunday at 9PM UTC.",
  },
  {
    q: "How do I track my token on DexScreener?",
    a: "Visit /token/YOUR_CONTRACT_ADDRESS on our platform to see live price, volume, liquidity and trading pairs pulled directly from DexScreener.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen px-4 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/60 mb-6">
            Simple · Transparent · On-chain
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            How{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-green-400 to-cyan-400 bg-clip-text text-transparent">
              BoostEra
            </span>{" "}
            Works
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Promote your Solana meme coin in 5 simple steps. Everything is
            transparent and verifiable on-chain.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-16">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`relative rounded-2xl border ${step.bg} p-6 shadow-lg ${step.glow} flex gap-5 items-start`}
            >
              {/* Number */}
              <div
                className={`flex-shrink-0 text-4xl font-extrabold ${step.color} opacity-20 leading-none`}
              >
                {step.number}
              </div>

              {/* Icon + content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border ${step.bg}`}
                  >
                    <step.icon className={`h-4 w-4 ${step.color}`} />
                  </div>
                  <h3 className="font-bold text-white/90">{step.title}</h3>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div className="absolute -bottom-4 left-10 z-10">
                  <ArrowRight className="h-4 w-4 text-white/15 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-xl font-extrabold text-white/80 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-white/8 bg-white/4 px-5 py-4"
              >
                <p className="text-sm font-bold text-white/80 mb-1">{faq.q}</p>
                <p className="text-sm text-white/45 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
          <h3 className="text-2xl font-extrabold text-white/90 mb-2">
            Ready to promote?
          </h3>
          <p className="text-white/45 text-sm mb-6">
            Join hundreds of Solana projects getting visibility today.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-black hover:bg-yellow-300 transition cursor-pointer"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/memedrop"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white/80 hover:bg-white/10 transition cursor-pointer"
            >
              🎁 Enter MemeDrop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
