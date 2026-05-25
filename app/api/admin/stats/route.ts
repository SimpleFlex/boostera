import { NextResponse } from "next/server";
import { getDetailedStats } from "../../../../lib/promoService";

export async function GET() {
  try {
    const stats = await getDetailedStats();
    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
