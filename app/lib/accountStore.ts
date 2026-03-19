// ─────────────────────────────────────────────────────────────────────────────

import type { PlanId } from "./plans";
import { PLANS } from "./plans";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PromotionStatus = "pending" | "live" | "completed" | "expired";

export type Transaction = {
  id: string;
  planId: PlanId;
  signature: string;
  timestamp: string; // ISO string
  amountSol: number;
  status: PromotionStatus;
};

export type AccountRecord = {
  ca: string;
  walletAddress: string;
  activePlan: PlanId | null;
  planStartedAt: string | null; // ISO string
  planExpiresAt: string | null; // ISO string
  promotionStatus: PromotionStatus | null;
  transactions: Transaction[];
};

// ─── Duration per plan (days) ─────────────────────────────────────────────────

const PLAN_DURATION_DAYS: Record<PlanId, number> = {
  discovery: 7,
  starter: 14,
  growth: 14,
  authority: 30,
  authority_plus: 30,
};

// ─── Singleton store ──────────────────────────────────────────────────────────
// Key = `${ca.toLowerCase()}::${wallet.toLowerCase()}`

const g = globalThis as unknown as {
  __accountStore?: Map<string, AccountRecord>;
};
if (!g.__accountStore) g.__accountStore = new Map<string, AccountRecord>();
const store: Map<string, AccountRecord> = g.__accountStore;

function makeKey(ca: string, wallet: string) {
  return `${ca.toLowerCase()}::${wallet.toLowerCase()}`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Look up an account. Returns null if not found. */
export function getAccount(ca: string, wallet: string): AccountRecord | null {
  const record = store.get(makeKey(ca, wallet)) ?? null;
  if (!record) return null;

  // Auto-expire if past expiry date
  if (
    record.planExpiresAt &&
    new Date(record.planExpiresAt).getTime() < Date.now()
  ) {
    record.promotionStatus = "expired";
    record.transactions = record.transactions.map((tx) =>
      tx.status === "live" ? { ...tx, status: "expired" } : tx
    );
    store.set(makeKey(ca, wallet), record);
  }

  return record;
}

/**
 * Upsert an account after a confirmed payment.
 * Called by /api/solana/verify-payment once the tx is confirmed on-chain.
 */
export function upsertAccount(params: {
  ca: string;
  walletAddress: string;
  planId: PlanId;
  signature: string;
  amountSol: number;
}): AccountRecord {
  const key = makeKey(params.ca, params.walletAddress);
  const existing = store.get(key);

  const now = new Date();
  const durationDays = PLAN_DURATION_DAYS[params.planId] ?? 14;
  const expiresAt = new Date(
    now.getTime() + durationDays * 24 * 60 * 60 * 1000
  );

  const newTx: Transaction = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    planId: params.planId,
    signature: params.signature,
    timestamp: now.toISOString(),
    amountSol: params.amountSol,
    status: "live",
  };

  const record: AccountRecord = {
    ca: params.ca,
    walletAddress: params.walletAddress,
    activePlan: params.planId,
    planStartedAt: now.toISOString(),
    planExpiresAt: expiresAt.toISOString(),
    promotionStatus: "live",
    transactions: [newTx, ...(existing?.transactions ?? [])],
  };

  store.set(key, record);
  return record;
}

/** List all accounts (for admin panel). */
export function listAccounts(): AccountRecord[] {
  return Array.from(store.values());
}
