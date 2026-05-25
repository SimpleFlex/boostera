"use client";

import { Suspense } from "react";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, HelpCircle, Search } from "lucide-react";

const faqs = [
  {
    question: "How do I promote my token?",
    answer: "Simply paste your token contract address on the homepage, select a package, make payment, and submit your transaction hash. Our team will verify and activate your campaign within 24 hours.",
  },
  // ... rest of FAQs
];

function FAQContent() {
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

export default function FAQPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-white/20 border-t-white rounded-full"></div></div>}>
      <FAQContent />
    </Suspense>
  );
}
