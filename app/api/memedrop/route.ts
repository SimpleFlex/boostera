import { NextResponse } from "next/server";
import { getPaymentsByPlan } from "../../lib/paymentsStore";

export async function GET() {
  try {
    // Get all discovery plan payments (these are the MemeDrop entries)
    const entries = getPaymentsByPlan("discovery");

    // Get current week's entries (since last Sunday 9PM UTC)
    const now = new Date();
    const day = now.getUTCDay();
    const lastSunday = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - (day === 0 ? 0 : day),
        21,
        0,
        0,
        0
      )
    );
    // If today is Sunday but before 9PM, go back another week
    if (day === 0 && now.getUTCHours() < 21) {
      lastSunday.setUTCDate(lastSunday.getUTCDate() - 7);
    }

    const thisWeekEntries = entries.filter(
      (e) => new Date(e.paidAt) >= lastSunday
    );

    // Mock winners for now — replace with real DB query later
    const winners = [
      {
        addr: "9WzDXw...K7pQm",
        week: "Week 1",
        sol: "1 SOL",
        date: "2026-03-02",
      },
      {
        addr: "7VbGHs...N2xRt",
        week: "Week 2",
        sol: "1 SOL",
        date: "2026-03-09",
      },
      {
        addr: "4KcMnP...J8wVk",
        week: "Week 3",
        sol: "1 SOL",
        date: "2026-03-16",
      },
    ];

    return NextResponse.json({
      totalEntries: entries.length,
      thisWeekEntries: thisWeekEntries.length,
      winners,
    });
  } catch {
    return NextResponse.json({
      totalEntries: 0,
      thisWeekEntries: 0,
      winners: [],
    });
  }
}
