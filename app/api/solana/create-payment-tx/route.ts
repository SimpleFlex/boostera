import { NextResponse } from "next/server";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { PLANS, type PlanId } from "@/app/lib/plans";

type Body = {
  payer: string;
  plan: PlanId;
  ca: string;
};

function isBase58SolanaAddress(v: string) {
  const s = v.trim();
  if (s.length < 32 || s.length > 44) return false;
  return /^[1-9A-HJ-NP-Za-km-z]+$/.test(s);
}

// Fetch live SOL price from CoinGecko
async function getLiveSolPrice(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      { next: { revalidate: 30 } } // cache for 30s
    );
    const json = (await res.json()) as { solana: { usd: number } };
    return json.solana.usd;
  } catch {
    // Fallback to a safe conservative price if CoinGecko is down
    return 150;
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Body>;

    const payer = (body.payer ?? "").trim();
    const plan = body.plan as PlanId;
    const ca = (body.ca ?? "").trim();

    const rpc =
      process.env.SOLANA_RPC_URL ??
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL ??
      "https://api.mainnet-beta.solana.com";
    const merchant = process.env.MERCHANT_WALLET;

    if (!merchant)
      return new NextResponse("Missing MERCHANT_WALLET", { status: 500 });
    if (!payer || !isBase58SolanaAddress(payer))
      return new NextResponse("Invalid payer", { status: 400 });
    if (!ca || !isBase58SolanaAddress(ca))
      return new NextResponse("Invalid token address (ca)", { status: 400 });

    const config = PLANS[plan];
    if (!config) return new NextResponse("Unknown plan", { status: 400 });

    // ── Calculate lamports from live SOL price ────────────────────────────────
    const solPrice = await getLiveSolPrice();
    const solAmount = config.usd / solPrice; // e.g. $15 / $150 = 0.1 SOL
    const lamports = Math.round(solAmount * 1_000_000_000);

    // ── Build transaction ─────────────────────────────────────────────────────
    const connection = new Connection(rpc, "confirmed");
    const { blockhash } = await connection.getLatestBlockhash("confirmed");

    const tx = new Transaction({
      feePayer: new PublicKey(payer),
      recentBlockhash: blockhash,
    });

    tx.add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(payer),
        toPubkey: new PublicKey(merchant),
        lamports,
      })
    );

    const b64 = tx
      .serialize({ requireAllSignatures: false })
      .toString("base64");

    return NextResponse.json({
      transactionBase64: b64,
      amountLamports: lamports,
      solAmount: solAmount.toFixed(6),
      solPrice,
      merchant,
      planLabel: config.label,
      ca,
      plan,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return new NextResponse(msg, { status: 500 });
  }
}
