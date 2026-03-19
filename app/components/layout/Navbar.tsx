"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitProvider,
  useDisconnect,
} from "@reown/appkit/react";
import type { Provider } from "@reown/appkit-adapter-solana/react";
import bs58 from "bs58";

function shortAddr(addr?: string | null) {
  if (!addr) return "";
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

function buildSignMessage(address: string) {
  return [
    "BoostEra Authentication",
    "------------------------",
    "Sign this message to verify you own this wallet.",
    "This will NOT create a transaction or cost any fees.",
    "",
    `Address: ${address}`,
    `Nonce:   ${crypto.randomUUID()}`,
    `Issued:  ${new Date().toISOString()}`,
  ].join("\n");
}

type SignStatus = "idle" | "pending" | "signed" | "rejected";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [signStatus, setSignStatus] = useState<SignStatus>("idle");
  const [signError, setSignError] = useState<string | null>(null);
  const hasSignedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount({ namespace: "solana" });
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const { disconnect } = useDisconnect();

  // ── Sign after connect ─────────────────────────────────────────────────────
  const signMessage = useCallback(async () => {
    if (hasSignedRef.current || !walletProvider || !address) return;
    hasSignedRef.current = true;
    setSignStatus("pending");

    try {
      const message = buildSignMessage(address);
      const encoded = new TextEncoder().encode(message);

      // walletProvider.signMessage() is the correct AppKit 1.x API
      // This directly triggers the Phantom/Solflare signing popup
      const signature = await walletProvider.signMessage(encoded);
      const encoded58 = bs58.encode(
        signature instanceof Uint8Array
          ? signature
          : new Uint8Array(Object.values(signature as object))
      );

      console.log("✅ Signed:", encoded58);
      setSignStatus("signed");
    } catch (err) {
      console.error("❌ Sign rejected:", err);
      hasSignedRef.current = false;
      setSignStatus("rejected");
      setSignError(
        "You rejected the signature. Please connect and sign to use BoostEra."
      );
      await disconnect({ namespace: "solana" });
    }
  }, [walletProvider, address, disconnect]);

  // ── Trigger sign as soon as wallet is connected ────────────────────────────
  useEffect(() => {
    if (!isConnected || !address) {
      hasSignedRef.current = false;
      setSignStatus("idle");
      setSignError(null);
      return;
    }

    if (hasSignedRef.current || signStatus === "signed") return;

    // walletProvider takes a tick to be injected after isConnected fires
    if (walletProvider) {
      signMessage();
    }
  }, [isConnected, address, walletProvider, signMessage, signStatus]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleConnect = async () => {
    try {
      if (isConnected) {
        await open({ view: "Account" });
      } else {
        setSignError(null);
        await open({ view: "Connect", namespace: "solana" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect({ namespace: "solana" });
    } catch (err) {
      console.error(err);
    }
  };

  const isVerified = isConnected && signStatus === "signed";
  const isPending = isConnected && signStatus === "pending";

  const btnLabel = () => {
    if (!isConnected) return "Connect Wallet";
    if (isPending) return "Awaiting signature...";
    if (isVerified) return `✓ ${shortAddr(address)}`;
    return "Connect Wallet";
  };

  const fallback = (
    <button
      disabled
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white opacity-70 cursor-not-allowed"
    >
      Connect Wallet
    </button>
  );

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-3">
          {/* Error banner */}
          {signError && (
            <div className="mb-2 flex items-center justify-between rounded-lg bg-red-500/20 border border-red-500/40 px-4 py-2">
              <p className="text-sm text-red-300">⚠️ {signError}</p>
              <button
                onClick={() => setSignError(null)}
                className="ml-4 text-red-400 hover:text-red-200 text-xl cursor-pointer"
              >
                ×
              </button>
            </div>
          )}

          {/* MOBILE */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center cursor-pointer">
                <span className="text-2xl font-extrabold tracking-tight">
                  <span className="bg-linear-to-r from-fuchsia-300 via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
                    Boost
                  </span>
                  <span className="text-white/90">Era</span>
                </span>
              </Link>
              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/85 backdrop-blur-xl transition hover:bg-white/10"
              >
                🏆 Leaderboard
              </Link>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <Link
                href="/memedrop"
                className="inline-flex items-center gap-2 text-base font-semibold text-amber-300"
              >
                <span aria-hidden>🎁</span> MemeDrop
              </Link>
              {mounted ? (
                <button
                  onClick={handleConnect}
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-wait px-4 py-2 text-sm font-semibold text-white transition"
                >
                  {btnLabel()}
                </button>
              ) : (
                fallback
              )}
            </div>
          </div>

          {/* DESKTOP */}
          <div className="hidden h-16 items-center justify-between sm:flex">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center cursor-pointer">
                <span className="text-xl font-extrabold tracking-tight">
                  <span className="bg-linear-to-r from-fuchsia-300 via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
                    Boost
                  </span>{" "}
                  <span className="text-white/90">Era</span>
                </span>
              </Link>
              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/85 backdrop-blur-xl transition hover:bg-white/10"
              >
                🏆 Leaderboard
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/memedrop"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-300 hover:text-amber-200 transition"
              >
                <span aria-hidden>🎁</span> MemeDrop
              </Link>
              <div className="flex items-center gap-2">
                {mounted ? (
                  <>
                    <button
                      onClick={handleConnect}
                      disabled={isPending}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-wait px-4 py-2 text-sm font-semibold text-white transition"
                    >
                      {btnLabel()}
                    </button>
                    {isVerified && (
                      <button
                        onClick={handleDisconnect}
                        className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
                      >
                        Disconnect
                      </button>
                    )}
                  </>
                ) : (
                  fallback
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
