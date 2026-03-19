import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import background from "./public/boost.png";

import ContextProvider from "./components/context";
import AnimatedBackground from "./components/layout/AnimatedBackground";
import Footer from "./components/layout/Footer";
import { LenisProvider } from "./components/providers/LenisProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AppKit Example App",
  description: "Powered by Reown",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LenisProvider>
          {/* ❌ removed overflow-hidden — it breaks sticky positioning */}
          <div className="relative min-h-screen text-white">
            {/* Background image — fixed so it stays while scrolling */}
            <div
              className="pointer-events-none fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${background.src})` }}
            />

            {/* Dark overlay — fixed too */}
            <div className="pointer-events-none fixed inset-0 -z-10 bg-black/60" />

            {/* Main content */}
            <div className="relative min-h-screen bg-white/5 backdrop-blur-xl flex flex-col">
              <AnimatedBackground />
              <ContextProvider>
                <div className="flex-1">{children}</div>
                <Footer />
              </ContextProvider>
            </div>
          </div>
        </LenisProvider>
      </body>
    </html>
  );
}
