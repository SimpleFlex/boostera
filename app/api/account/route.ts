import { NextResponse } from "next/server";
import { getAccount, listAccounts } from "@/app/lib/accountStore";

function isBase58SolanaAddress(v: string) {
  const s = v.trim();
  if (s.length < 32 || s.length > 44) return false;
  return /^[1-9A-HJ-NP-Za-km-z]+$/.test(s);
}

// GET /api/account?ca=...&wallet=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ca = (searchParams.get("ca") ?? "").trim();
  const wallet = (searchParams.get("wallet") ?? "").trim();

  if (!ca || !wallet) {
    return NextResponse.json(
      { error: "Missing ca or wallet" },
      { status: 400 }
    );
  }
  if (!isBase58SolanaAddress(ca)) {
    return NextResponse.json({ error: "Invalid CA address" }, { status: 400 });
  }
  if (!isBase58SolanaAddress(wallet)) {
    return NextResponse.json(
      { error: "Invalid wallet address" },
      { status: 400 }
    );
  }

  const account = getAccount(ca, wallet);

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  return NextResponse.json(account);
}

// GET /api/account/all  — for admin panel
export async function POST() {
  const accounts = listAccounts();
  return NextResponse.json({ accounts });
}
