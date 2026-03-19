import { NextResponse } from "next/server";
import { getPaymentsByWallet, getActivePlan } from "../../../lib/paymentsStore";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet")?.trim();
  const ca = searchParams.get("ca")?.trim();

  if (!wallet) return new NextResponse("Missing wallet", { status: 400 });

  const history = getPaymentsByWallet(wallet);
  const activePlan = ca ? getActivePlan(wallet, ca) : null;

  return NextResponse.json({ activePlan, history });
}
