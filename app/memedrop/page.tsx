import { Suspense } from "react";
import Link from "next/link";
import CountdownStrip from "../components/memedrops/CountdownStrip";
import MemeDropPanels from "./MemeDropPanels";
import Leaderboard from "./Leaderboard";

export default function MemeDropPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-white">
      {/* Top nav */}
      <div className="mb-10 flex justify-end">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-xl transition hover:bg-white/10 cursor-pointer"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Hero */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="text-orange-300">🎁</span>{" "}
          <span className="text-orange-300">Enter the MemeDrop</span>
        </h1>
        <p className="mt-2 text-white/80">
          Win <span className="font-extrabold text-yellow-300">1 SOL</span>{" "}
          Every Week!
        </p>

        {/* Live countdown — auto resets every Sunday 9PM UTC */}
        <CountdownStrip />
      </div>

      {/* Main panels — wrapped in Suspense because it uses useSearchParams */}
      <Suspense
        fallback={
          <div className="mt-10 h-40 rounded-3xl bg-white/5 animate-pulse" />
        }
      >
        <MemeDropPanels />
      </Suspense>

      {/* Leaderboard */}
      <Leaderboard />
    </main>
  );
}
