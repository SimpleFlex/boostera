import { NextResponse } from "next/server";
import { createPromoCode } from "../../../../lib/promoService";

export async function POST(req: Request) {
  try {
    const { code, discountPercent, maxUses, daysValid } = await req.json();
    await createPromoCode(code, discountPercent, maxUses, daysValid);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create promo code" },
      { status: 500 }
    );
  }
}
