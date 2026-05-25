"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MessageCircle, Clock, Headphones, Send, CheckCircle2, Users, Bell } from "lucide-react";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Telegram Support",
      description: "Fastest response! Message our support team",
      contact: "@CryptoDiver8",
      action: "https://t.me/CryptoDiver8",
      buttonText: "Message Support →",
    },
    {
      icon: Bell,
      title: "Telegram Channel",
      description: "Stay updated with announcements",
      contact: "@boostera_fun",
      action: "https://t.me/boostera_fun",
      buttonText: "Join Channel →",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Get response within 24 hours",
      contact: "support@boostera.com",
      action: "mailto:support@boostera.com",
      buttonText: "Send Email →",
    },
  ];

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 mb-6">
            <Headphones className="w-4 h-4" />
            Customer Support
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            How Can We <span className="text-gradient">Help You?</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            We're here to assist you with any questions about promoting your token,
            payment issues, or campaign tracking.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {supportOptions.map((option, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl hover:border-white/20 transition-all text-center">
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 mb-4">
                <option.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{option.title}</h3>
              <p className="text-sm text-white/50 mb-3">{option.description}</p>
              <p className="text-sm text-white/70 font-mono mb-3">{option.contact}</p>
              {option.action && (
                <a
                  href={option.action}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition"
                >
                  {option.buttonText}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Telegram Support CTA Banner */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6 mb-12 text-center">
          <MessageCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Need Immediate Help?</h3>
          <p className="text-white/60 mb-4">
            Message our support team directly on Telegram for the fastest response
          </p>
          <a
            href="https://t.me/CryptoDiver8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 font-semibold text-white transition hover:scale-105"
          >
            <MessageCircle className="w-4 h-4" />
            Message @CryptoDiver8 →
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white/90 mb-6 text-center">Send Us a Message</h2>
          
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white/90">Message Sent!</h3>
              <p className="text-white/50 mt-2">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-blue-500/50"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-blue-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Message</label>
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-blue-500/50 resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-3 font-semibold text-white transition hover:scale-105"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm">
            Have quick questions? Check our <Link href="/faq" className="text-blue-400 hover:underline">FAQ page</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
