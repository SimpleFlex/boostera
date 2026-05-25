import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  
  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }
  
  // Simple chain detection
  let chain = "unknown";
  if (address.startsWith("0x") && address.length === 42) chain = "ethereum";
  if (address.length === 44 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(address)) chain = "solana";
  
  return NextResponse.json({
    address,
    chain,
    isValid: chain !== "unknown",
  });
}
