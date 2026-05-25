import { NextResponse } from "next/server";
import { getCampaignsCollection } from "../../../lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ca, chain, packageId, packageName, amount, paymentMethod, txHash, userEmail, userId } = body;
    
    console.log("📝 Received submission:", { ca, userEmail, packageId });
    
    // Validate required fields
    if (!ca || !packageId || !txHash) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    if (!userEmail) {
      return NextResponse.json({ error: "Email is required to track your campaign" }, { status: 400 });
    }
    
    const collection = await getCampaignsCollection();
    
    // Create campaign with email
    const campaign = {
      id: crypto.randomUUID(),
      ca,
      chain: chain || "Unknown",
      packageId,
      packageName,
      amount,
      paymentMethod: paymentMethod || null,
      txHash,
      userEmail: userEmail.toLowerCase().trim(),
      userId: userId || crypto.randomUUID(),
      status: "pending",
      submittedAt: new Date(),
      verifiedAt: null,
      activatedAt: null,
      expiresAt: null,
      notes: null,
    };
    
    const result = await collection.insertOne(campaign);
    console.log("✅ Campaign saved with email:", campaign.userEmail);
    
    return NextResponse.json({ 
      success: true, 
      id: campaign.id, 
      email: campaign.userEmail,
      status: campaign.status 
    });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("email");
    
    console.log("🔍 Fetching campaigns for email:", userEmail);
    
    if (!userEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    const collection = await getCampaignsCollection();
    const campaigns = await collection
      .find({ userEmail: userEmail.toLowerCase().trim() })
      .sort({ submittedAt: -1 })
      .toArray();
    
    console.log(`📊 Found ${campaigns.length} campaigns for ${userEmail}`);
    
    return NextResponse.json({ success: true, campaigns, email: userEmail });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}
