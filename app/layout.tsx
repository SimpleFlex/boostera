import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import AnimatedBackground from "../components/layout/AnimatedBackground";
import ChatBot from "../components/shared/ChatBot";
import { LoadingProvider } from "../components/providers/LoadingProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BoostEra - Crypto Marketing Platform",
  description: "Get your token seen by thousands across crypto communities. Launch your marketing campaign in minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <LoadingProvider>
          <AnimatedBackground />
          <ChatBot />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </LoadingProvider>
      </body>
    </html>
  );
}
