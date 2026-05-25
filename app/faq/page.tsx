"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, HelpCircle, Search } from "lucide-react";

const faqs = [
  {
    question: "How do I promote my token?",
    answer: "Simply paste your token contract address on the homepage, select a package, make payment, and submit your transaction hash. Our team will verify and activate your campaign within 24 hours.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept BTC, USDT (TRC20, ERC20, BEP20), BNB, ETH, and SOL. Each network has its own dedicated wallet address shown during checkout.",
  },
  {
    question: "How long does the promotion last?",
    answer: "Each package has different durations: Growth (2 days), Viral Push (3 days), Premium Boost (Full Support), Ultimate (Premium Support), Institutional Alpha (Executive Support).",
  },
  {
    question: "Do I need to connect my wallet?",
    answer: "No! Unlike traditional dApps, we don't require wallet connection. You simply send payment manually to our addresses and submit your transaction hash.",
  },
  {
    question: "How do I track my campaign?",
    answer: "Enter your email during checkout. Then go to 'My Campaigns' page, enter the same email, and you'll see all your campaigns with real-time status updates.",
  },
  {
    question: "How long does admin verification take?",
    answer: "Our team verifies payments within 24 hours. You'll receive email updates when your payment is verified and when your campaign becomes active.",
  },
  {
    question: "What happens after payment?",
    answer: "After submitting your transaction hash, your campaign status shows 'Pending'. Once admin verifies, it changes to 'Verified', then 'Active' when activated.",
  },
  {
    question: "Can I upgrade my package later?",
    answer: "Yes! You can purchase additional packages at any time. Each campaign is tracked separately.",
  },
  {
    question: "What's the refund policy?",
    answer: "All payments are final and non-refundable. Please ensure you've read the package details before purchasing.",
  },
  {
    question: "How do I contact support?",
    answer: "You can use the live chat button on the bottom right, email us at support@boostera.com, or use our contact form on the Support page.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 mb-6">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Got <span className="text-gradient">Questions?</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Find answers to common questions about promoting your token, payments, and campaign management.
          </p>
        </div>

        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-blue-500/50"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left transition hover:bg-white/5"
              >
                <span className="font-semibold text-white/90 pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-white/50 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white/50 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5">
                  <p className="text-white/60 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-2">Still have questions?</h3>
            <p className="text-white/50 text-sm mb-4">
              Can't find the answer you're looking for? Please contact our support team.
            </p>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 text-sm font-semibold text-white transition hover:scale-105"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
