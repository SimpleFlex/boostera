import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://boostera:primolax@boostera.2vxbrpu.mongodb.net/boostera";

export async function GET() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db("boostera");
    const campaignsCollection = db.collection("campaigns");
    
    const totalCampaigns = await campaignsCollection.countDocuments();
    const activeCampaigns = await campaignsCollection.countDocuments({ status: "active" });
    const pendingVerification = await campaignsCollection.countDocuments({ status: "pending" });
    
    const revenueResult = await campaignsCollection.aggregate([
      { $match: { status: { $in: ["active", "completed"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]).toArray();
    
    const totalRevenue = revenueResult[0]?.total || 0;
    
    await client.close();
    
    return NextResponse.json({
      connected: true,
      message: "Successfully connected to MongoDB Atlas",
      stats: {
        totalCampaigns,
        activeCampaigns,
        pendingVerification,
        totalRevenue,
      },
    });
  } catch (error: any) {
    console.error("Database connection error:", error);
    return NextResponse.json({
      connected: false,
      message: error.message || "Failed to connect to MongoDB",
    }, { status: 500 });
  }
}
