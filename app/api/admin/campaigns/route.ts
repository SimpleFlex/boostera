import { NextResponse } from "next/server";
import { getCampaignsCollection } from "../../../../lib/mongodb";

export async function GET() {
  try {
    const collection = await getCampaignsCollection();
    const campaigns = await collection
      .find({})
      .sort({ submittedAt: -1 })
      .toArray();

    // Format campaigns for admin view
    const formattedCampaigns = campaigns.map((c) => ({
      id: c.id,
      userEmail: c.userEmail || "No email provided",
      ca: c.ca,
      packageName: c.packageName,
      amount: c.amount,
      txHash: c.txHash,
      status: c.status,
      submittedAt: c.submittedAt,
      daysLeft: c.daysLeft,
      expiresAt: c.expiresAt,
    }));

    return NextResponse.json({
      success: true,
      campaigns: formattedCampaigns,
      total: formattedCampaigns.length,
    });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}
