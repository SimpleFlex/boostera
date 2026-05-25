"use client";

import { motion } from "framer-motion";
import { Rocket, CreditCard, CheckCircle2, Clock, Gift, Users } from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Rocket,
      title: "1. Submit Your Token",
      description: "Enter your token contract address and select a promotion package that fits your goals.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: CreditCard,
      title: "2. Make Payment",
      description: "Send the payment to our wallet address and submit your transaction hash for verification.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Clock,
      title: "3. Wait for Verification",
      description: "Our team verifies your payment within 24 hours. You'll receive email confirmation.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: CheckCircle2,
      title: "4. Campaign Goes Live",
      description: "Once verified, your campaign is activated and the countdown begins!",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Users,
      title: "5. Track Performance",
      description: "Monitor your campaign's performance and see real-time engagement metrics.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Gift,
      title: "6. Get Rewards",
      description: "Earn referral commissions and unlock promo codes for future campaigns.",
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How <span className="text-gradient">BoostEra</span> Works
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Get your token promoted across top crypto platforms in 6 simple steps
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl hover:border-white/20 transition-all"
            >
              <div className={`inline-flex rounded-xl bg-gradient-to-r ${step.color} p-3 mb-4`}>
                <step.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-white/50">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/promote"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white transition hover:scale-105"
          >
            Start Your Campaign →
          </Link>
        </div>
      </div>
    </div>
  );
}
