"use client";

import React, { type ReactNode } from "react";
import { createAppKit } from "@reown/appkit/react";
import { solana, solanaDevnet, solanaTestnet } from "@reown/appkit/networks";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { validProjectId, metadata } from "@/config";

// Do NOT pass wallets array — let AppKit auto-detect
// injected extensions like Phantom and Solflare
const solanaAdapter = new SolanaAdapter();

const defaultNetwork =
  process.env.NODE_ENV === "development" ? solanaDevnet : solana;

createAppKit({
  adapters: [solanaAdapter],
  projectId: validProjectId,
  networks: [solana, solanaTestnet, solanaDevnet],
  defaultNetwork,
  metadata,
  features: {
    analytics: false,
    email: false,
    socials: false,
  },
  enableReconnect: false,
});

type ContextProviderProps = { children: ReactNode };

function ContextProvider({ children }: ContextProviderProps) {
  return <>{children}</>;
}

export default ContextProvider;
