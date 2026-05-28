"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Home, Headphones, HelpCircle, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "My Campaigns", href: "/my-campaigns" },
  { name: "Customer Care", href: "/support", icon: Headphones },
  { name: "FAQ", href: "/faq", icon: HelpCircle },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openBookingPage = () => {
    router.push("/book-appointment");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      return true;
    }
    return false;
  };

  const handleNavigation = async (
    e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>,
    href: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (href === "/") {
      router.push("/");
      return;
    }

    if (href.startsWith("/#")) {
      const sectionId = href.substring(2);
      
      if (pathname === "/") {
        if (!scrollToSection(sectionId)) {
          setTimeout(() => scrollToSection(sectionId), 100);
          setTimeout(() => scrollToSection(sectionId), 300);
        }
      } else {
        router.push("/");
        setTimeout(() => {
          const checkAndScroll = () => {
            if (document.getElementById(sectionId)) {
              scrollToSection(sectionId);
            } else {
              setTimeout(checkAndScroll, 100);
            }
          };
          checkAndScroll();
        }, 200);
      }
    } else {
      router.push(href);
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 sm:gap-0 group">
            <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center overflow-hidden">
              <img
                src="/images/boostlogo.png"
                alt="BoostEra Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-bold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Boost
                </span>
                <span className="text-white">Era</span>
              </span>
              <span className="text-[8px] font-semibold text-white/40 tracking-wider">
                CRYPTO MARKETING
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6 lg:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavigation(e, item.href)}
                className="flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white transition"
              >
                {item.icon && <item.icon className="h-3.5 w-3.5" />}
                {item.name}
              </Link>
            ))}
            {/* Book Appointment Button */}
            <button
              onClick={openBookingPage}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:scale-105"
            >
              <Calendar className="h-4 w-4" />
              Book Appointment
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white/70 md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/10 md:hidden overflow-hidden"
            >
              <div className="flex flex-col items-center py-4 space-y-2">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={(e) => handleNavigation(e as any, item.href)}
                    className="flex items-center justify-center gap-2 w-full py-2 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition"
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.name}
                  </button>
                ))}
                {/* Book Appointment Button in Mobile Menu */}
                <button
                  onClick={openBookingPage}
                  className="flex items-center justify-center gap-2 w-full mt-2 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:scale-105"
                >
                  <Calendar className="h-4 w-4" />
                  Book Appointment
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
