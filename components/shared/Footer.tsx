"use client";

import Link from "next/link";
import { Twitter, MessageCircle, Github, Zap, Bell } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden">
                <img
                  src="/images/boostlogo.png"
                  alt="BoostEra Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Boost
                  </span>
                  <span className="text-white">Era</span>
                </span>
                <span className="text-[10px] font-semibold text-white/40 tracking-wider">
                  CRYPTO MARKETING
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/50 mb-4 max-w-xs">
              The premier crypto marketing platform helping tokens get the
              visibility they deserve.
            </p>
            <div className="flex gap-3">
              <a
                href="https://t.me/CryptoDiver8"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/10 bg-white/5 p-2 rounded-lg hover:bg-white/10 transition group"
              >
                <MessageCircle className="w-4 h-4 text-white/70 group-hover:text-emerald-400 transition" />
              </a>
              <a
                href="https://t.me/boostera_fun"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/10 bg-white/5 p-2 rounded-lg hover:bg-white/10 transition group"
              >
                <Bell className="w-4 h-4 text-white/70 group-hover:text-blue-400 transition" />
              </a>
              {/* <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="border border-white/10 bg-white/5 p-2 rounded-lg hover:bg-white/10 transition">
                <Twitter className="w-4 h-4 text-white/70" />
              </a> */}
              {/* <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="border border-white/10 bg-white/5 p-2 rounded-lg hover:bg-white/10 transition">
                <Github className="w-4 h-4 text-white/70" />
              </a> */}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#features"
                  className="text-sm text-white/50 hover:text-white transition"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-sm text-white/50 hover:text-white transition"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-white/50 hover:text-white transition"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-white/50 hover:text-white transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-white/50 hover:text-white transition"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-white/50 hover:text-white transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-white/50 hover:text-white transition"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-white/50 hover:text-white transition"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-sm text-white/50 hover:text-white transition"
                >
                  Refund
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-4">
              Community
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://t.me/CryptoDiver8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 hover:text-white transition flex items-center gap-2"
                >
                  💬 Support Chat
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/boostera_fun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 hover:text-white transition flex items-center gap-2"
                >
                  📢 Announcements
                </a>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-white/50 hover:text-white transition"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-sm text-white/50 hover:text-white transition"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/40">
          <p>
            &copy; {new Date().getFullYear()} BoostEra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
