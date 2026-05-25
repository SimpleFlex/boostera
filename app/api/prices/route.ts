import { NextResponse } from "next/server";
import { getLivePrices } from "../../../lib/priceService";

export async function GET() {
  try {
    const prices = await getLivePrices();
    return NextResponse.json({ success: true, prices });
  } catch (error) {
    console.error("Price API error:", error);
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}
