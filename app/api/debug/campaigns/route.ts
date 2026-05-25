import { NextResponse } from "next/server";
import { getCampaignsCollection } from "../../../../lib/mongodb";

export async function GET() {
  try {
    const collection = await getCampaignsCollection();
    const campaigns = await collection.find({}).toArray();
    return NextResponse.json({
      total: campaigns.length,
      campaigns: campaigns.map((c) => ({
        id: c.id,
        email: c.userEmail,
        ca: c.ca,
        status: c.status,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
