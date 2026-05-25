import { getCampaignsCollection } from "./mongodb";

export async function getDetailedStats() {
  const collection = await getCampaignsCollection();
  
  const totalCampaigns = await collection.countDocuments();
  const activeCampaigns = await collection.countDocuments({ status: "active" });
  const pendingVerification = await collection.countDocuments({ status: "pending" });
  
  const revenueResult = await collection.aggregate([
    { $match: { status: { $in: ["active", "completed"] } } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]).toArray();
  
  const totalRevenue = revenueResult[0]?.total || 0;
  
  const campaignsByPackage = await collection.aggregate([
    { $group: { _id: "$packageName", count: { $sum: 1 }, revenue: { $sum: "$amount" } } }
  ]).toArray();
  
  return {
    totalCampaigns,
    activeCampaigns,
    pendingVerification,
    totalRevenue,
    campaignsByPackage,
    totalDiscountGiven: 0,
  };
}

export async function createPromoCode(code: string, discountPercent: number, maxUses: number, daysValid: number) {
  console.log(`Creating promo code: ${code} (${discountPercent}% off, ${maxUses} uses, ${daysValid} days)`);
  return true;
}

export async function verifyPayment(campaignId: string) {
  const collection = await getCampaignsCollection();
  const result = await collection.updateOne(
    { id: campaignId },
    { $set: { status: "verified", verifiedAt: new Date() } }
  );
  return result.modifiedCount > 0;
}

export async function activateCampaign(campaignId: string, durationDays: number) {
  const collection = await getCampaignsCollection();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);
  
  const result = await collection.updateOne(
    { id: campaignId },
    { 
      $set: { 
        status: "active", 
        activatedAt: new Date(),
        expiresAt,
        daysLeft: durationDays
      } 
    }
  );
  return result.modifiedCount > 0;
}

export async function rejectCampaign(campaignId: string, reason: string) {
  const collection = await getCampaignsCollection();
  const result = await collection.updateOne(
    { id: campaignId },
    { $set: { status: "rejected", notes: reason } }
  );
  return result.modifiedCount > 0;
}

export async function completeCampaign(campaignId: string) {
  const collection = await getCampaignsCollection();
  const result = await collection.updateOne(
    { id: campaignId },
    { $set: { status: "completed" } }
  );
  return result.modifiedCount > 0;
}
