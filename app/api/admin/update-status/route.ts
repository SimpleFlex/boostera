import { NextResponse } from "next/server";
import { getCampaignsCollection } from "../../../../lib/mongodb";

export async function POST(req: Request) {
  try {
    const { id, action, durationDays } = await req.json();
    const collection = await getCampaignsCollection();

    let updateData = {};

    switch (action) {
      case "verify":
        updateData = {
          status: "verified",
          verifiedAt: new Date(),
        };
        break;
      case "activate":
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (durationDays || 30));
        updateData = {
          status: "active",
          activatedAt: new Date(),
          expiresAt,
          daysLeft: durationDays || 30,
        };
        break;
      case "reject":
        updateData = { status: "rejected" };
        break;
      case "complete":
        updateData = { status: "completed" };
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const result = await collection.updateOne({ id }, { $set: updateData });

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json(
      { error: "Failed to update campaign" },
      { status: 500 }
    );
  }
}
