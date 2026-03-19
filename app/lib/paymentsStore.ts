// lib/paymentsStore.ts
// Simple file-based storage for payments
// In production replace with a real database (Postgres, MongoDB, etc.)

import fs from "fs";
import path from "path";

export type PaymentRecord = {
  id: string;
  wallet: string;
  ca: string;
  plan: string;
  planLabel: string;
  usd: number;
  lamports: number;
  signature: string;
  paidAt: string; // ISO string
  expiresAt: string; // ISO string — 30 days after paidAt
};

const FILE = path.join(process.cwd(), ".payments.json");

function readAll(): PaymentRecord[] {
  try {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, "utf8")) as PaymentRecord[];
  } catch {
    return [];
  }
}

function writeAll(records: PaymentRecord[]) {
  fs.writeFileSync(FILE, JSON.stringify(records, null, 2), "utf8");
}

export function savePayment(record: PaymentRecord) {
  const all = readAll();
  // Prevent duplicate signatures
  if (all.find((r) => r.signature === record.signature)) return;
  all.unshift(record);
  writeAll(all);
}

export function getPaymentsByWallet(wallet: string): PaymentRecord[] {
  return readAll().filter(
    (r) => r.wallet.toLowerCase() === wallet.toLowerCase()
  );
}

export function getActivePlan(
  wallet: string,
  ca: string
): PaymentRecord | null {
  const now = new Date();
  return (
    readAll().find(
      (r) =>
        r.wallet.toLowerCase() === wallet.toLowerCase() &&
        r.ca.toLowerCase() === ca.toLowerCase() &&
        new Date(r.expiresAt) > now
    ) ?? null
  );
}

export function getPaymentsByPlan(plan: string): PaymentRecord[] {
  return readAll().filter((r) => r.plan === plan);
}
