"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Zap, TrendingUp, Users, Rocket, Shield, Star } from "lucide-react";
import { PACKAGES } from "../lib/packages";
import PartnersSection from "../components/sections/PartnersSection";

export default function HomePage() {
  const router = useRouter();
  const [ca, setCa] = useState("");

  const handlePromote = () => {
    if (!ca.trim()) return;
    router.push(`/promote?ca=${encodeURIComponent(ca.trim())}`);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Mobile Optimized with Larger Input */}
      <section className="relative pt-20 sm:pt-32 pb-12 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/20 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/20 rounded-full blur-[100px] animate-float delay-1000" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-white/70 mb-4 sm:mb-6 backdrop-blur-sm">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
              Trusted by 500+ Projects
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight px-2">
              Get Your Token Seen By{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block sm:inline">
                Thousands Across Crypto Communities
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-white/60 max-w-2xl mx-auto px-4">
              Launch your marketing campaign in minutes. No technical skills required.
              Just paste your token address and choose a package.
            </p>

            {/* Mobile Optimized Input Section - LARGER HEIGHT */}
            <div className="mt-8 sm:mt-10 max-w-2xl mx-auto px-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={ca}
                    onChange={(e) => setCa(e.target.value)}
                    placeholder="Paste your token contract address..."
                    className="w-full h-14 sm:h-14 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-5 sm:px-6 text-base sm:text-base text-white placeholder:text-white/40 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                </div>
                <button
                  onClick={handlePromote}
                  disabled={!ca.trim()}
                  className="group h-14 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-base"
                >
                  Launch Promotion
                  <ArrowRight className="inline ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/50">
                <span>Supported chains:</span>
                {["Ethereum", "Solana", "BNB Chain", "Base", "Arbitrum", "Polygon"].map((chain) => (
                  <span key={chain} className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-full border border-white/10 text-xs">
                    {chain}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10 sm:mt-12 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/40 px-4">
              <div className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />No wallet connection</div>
              <div className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />Manual payment</div>
              <div className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />24/7 support</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 border-y border-white/10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { label: "Projects Promoted", value: "500+", icon: Rocket },
              { label: "Communities Reached", value: "2M+", icon: Users },
              { label: "Success Rate", value: "94%", icon: TrendingUp },
              { label: "Trust Score", value: "4.9/5", icon: Star },
            ].map((stat, i) => (
              <div key={i} className="space-y-1 sm:space-y-2">
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-blue-400" />
                <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs sm:text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION - Mobile Optimized Grid */}
      <section id="pricing" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Simple, <span className="text-gradient">Transparent Pricing</span></h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-white/60 max-w-2xl mx-auto px-4">
              Choose the perfect package for your token. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col rounded-xl sm:rounded-2xl border p-5 sm:p-6 backdrop-blur-xl transition-all hover:scale-105 ${
                  pkg.popular 
                    ? "border-purple-500/50 bg-gradient-to-b from-purple-500/10 to-transparent shadow-lg shadow-purple-500/20" 
                    : pkg.badge === "Institutional"
                    ? "border-amber-500/50 bg-gradient-to-b from-amber-500/10 to-transparent shadow-lg shadow-amber-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-white whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}
                {pkg.badge === "Institutional" && (
                  <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-white whitespace-nowrap">
                      🏛️ Institutional
                    </span>
                  </div>
                )}
                {pkg.badge === "Best Value" && (
                  <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-white whitespace-nowrap">
                      ⭐ Best Value
                    </span>
                  </div>
                )}
                {pkg.badge === "Elite" && (
                  <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-white whitespace-nowrap">
                      👑 Elite
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-xl font-bold text-white/90">{pkg.name}</h3>
                  <div className="mt-2 sm:mt-3">
                    <span className="text-2xl sm:text-3xl font-bold text-white">${pkg.price.usd}</span>
                    <span className="text-xs sm:text-sm text-white/40"> USD</span>
                  </div>
                </div>

                <div className="flex-grow space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                  {pkg.features.slice(0, 4).map((feature) => (
                    <div key={feature} className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/60">
                      <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2 text-left">{feature}</span>
                    </div>
                  ))}
                  {pkg.features.length > 4 && (
                    <div className="text-[10px] sm:text-xs text-white/40 text-center pt-1 sm:pt-2">
                      +{pkg.features.length - 4} more features
                    </div>
                  )}
                </div>

                <div className="text-center text-[10px] sm:text-sm text-white/40 mb-3 sm:mb-4">
                  ⏱️ {pkg.duration} • 👁️ {pkg.impressions}
                </div>

                <button
                  onClick={() => router.push(ca ? `/promote?ca=${ca}&package=${pkg.id}` : "/promote")}
                  className="w-full rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-2.5 sm:py-2.5 text-sm sm:text-sm font-semibold text-white transition hover:scale-105 mt-auto"
                >
                  Select Plan →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <PartnersSection />

      {/* Features Section - Mobile Optimized */}
      <section id="features" className="py-16 sm:py-24 bg-white/5">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Why Choose <span className="text-gradient">BoostEra</span>?</h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-white/60 max-w-2xl mx-auto px-4">
              We provide everything you need to launch a successful token marketing campaign
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {[
              { title: "Multi-Platform Promotion", description: "Get your token featured on Twitter, Telegram, Discord, and major crypto communities.", icon: Zap },
              { title: "Influencer Network", description: "Access to 100+ verified crypto influencers and KOLs across all platforms.", icon: Users },
              { title: "Analytics Dashboard", description: "Track your campaign performance with real-time metrics and insights.", icon: TrendingUp },
              { title: "DEX Integration", description: "Featured placement on DexScreener, DexTools, and Birdeye.", icon: Rocket },
              { title: "24/7 Support", description: "Dedicated account manager and priority support for all campaigns.", icon: Shield },
              { title: "Guaranteed Results", description: "We guarantee minimum impressions and engagement for every campaign.", icon: Star },
            ].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 hover:border-white/20 transition-all">
                <feature.icon className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400 mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-white/50">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 sm:p-12 backdrop-blur-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ready to Launch?</h2>
            <p className="text-sm sm:text-base text-white/60 mb-6 sm:mb-8 px-4">
              Join hundreds of successful projects that trusted BoostEra for their marketing
            </p>
            <button
              onClick={() => router.push("/promote")}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:scale-105 text-sm sm:text-base"
            >
              Start Your Campaign <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

