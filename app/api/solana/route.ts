import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { PLANS, type PlanId } from "../../lib/plans";
import { savePayment } from "../../lib/paymentsStore";

type Body = {
  signature: string;
  payer: string;
  plan: PlanId;
  ca: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    const rpc = process.env.SOLANA_RPC_URL;
    const merchant = process.env.MERCHANT_WALLET;

    if (!rpc)
      return new NextResponse("Missing SOLANA_RPC_URL", { status: 500 });
    if (!merchant)
      return new NextResponse("Missing MERCHANT_WALLET", { status: 500 });

    const config = PLANS[body.plan];
    if (!config) return new NextResponse("Unknown plan", { status: 400 });

    const connection = new Connection(rpc, "confirmed");

    const sig = body.signature?.trim();
    if (!sig) return new NextResponse("Missing signature", { status: 400 });

    const tx = await connection.getParsedTransaction(sig, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    });

    if (!tx)
      return new NextResponse("Transaction not found/confirmed yet", {
        status: 400,
      });

    const merchantPk = new PublicKey(merchant).toBase58();
    const payerPk = new PublicKey(body.payer).toBase58();

    const requiredLamports = Math.round(config.lamports);
    let paidLamports = 0;

    const ixs = tx.transaction.message.instructions;
    for (const ix of ixs) {
      const anyIx = ix as unknown as {
        program?: string;
        parsed?: {
          type?: string;
          info?: { source?: string; destination?: string; lamports?: number };
        };
      };

      if (
        anyIx.program === "system" &&
        anyIx.parsed?.type === "transfer" &&
        anyIx.parsed.info?.destination === merchantPk &&
        anyIx.parsed.info?.source === payerPk
      ) {
        paidLamports += Number(anyIx.parsed.info.lamports ?? 0);
      }
    }

    // Allow 2% tolerance for SOL price movement between tx creation and confirmation
    const tolerance = Math.round(requiredLamports * 0.98);
    if (paidLamports < tolerance) {
      return new NextResponse(
        `Underpaid. Paid ${paidLamports}, need at least ${tolerance}`,
        { status: 400 }
      );
    }

    // ── Save payment record ───────────────────────────────────────────────────
    const paidAt = new Date();
    const expiresAt = new Date(paidAt);
    // Duration scales with plan — max 14 days
    expiresAt.setDate(expiresAt.getDate() + (config.durationDays ?? 1));

    savePayment({
      id: `${sig.slice(0, 8)}-${Date.now()}`,
      wallet: payerPk,
      ca: body.ca?.trim() ?? "",
      plan: body.plan,
      planLabel: config.label,
      usd: config.usd,
      lamports: paidLamports,
      signature: sig,
      paidAt: paidAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    });

    return NextResponse.json({
      ok: true,
      paidLamports,
      requiredLamports,
      signature: sig,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return new NextResponse(msg, { status: 500 });
  }
}
