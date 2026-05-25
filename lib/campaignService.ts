import { getCampaignsCollection, Campaign } from "./mongodb";

// Create a new campaign
export async function createCampaign(campaign: Omit<Campaign, "_id">): Promise<Campaign> {
  const collection = await getCampaignsCollection();
  const result = await collection.insertOne(campaign);
  return { ...campaign, _id: result.insertedId.toString() };
}

// Get all campaigns
export async function getAllCampaigns(): Promise<Campaign[]> {
  const collection = await getCampaignsCollection();
  const campaigns = await collection.find({}).sort({ submittedAt: -1 }).toArray();
  return campaigns.map(c => ({ ...c, _id: c._id.toString() })) as Campaign[];
}

// Get campaign by ID
export async function getCampaignById(id: string): Promise<Campaign | null> {
  const collection = await getCampaignsCollection();
  const campaign = await collection.findOne({ id });
  if (!campaign) return null;
  return { ...campaign, _id: campaign._id.toString() } as Campaign;
}

// Get campaigns by CA (token address)
export async function getCampaignsByCa(ca: string): Promise<Campaign[]> {
  const collection = await getCampaignsCollection();
  const campaigns = await collection.find({ ca }).sort({ submittedAt: -1 }).toArray();
  return campaigns.map(c => ({ ...c, _id: c._id.toString() })) as Campaign[];
}

// Update campaign status
export async function updateCampaignStatus(
  id: string, 
  status: Campaign["status"]
): Promise<boolean> {
  const collection = await getCampaignsCollection();
  const updateData: any = { status };
  if (status === "verified") updateData.verifiedAt = new Date();
  if (status === "active") updateData.activatedAt = new Date();
  
  const result = await collection.updateOne({ id }, { $set: updateData });
  return result.modifiedCount > 0;
}

// Verify payment
export async function verifyPayment(campaignId: string): Promise<boolean> {
  return updateCampaignStatus(campaignId, "verified");
}

// Activate campaign
export async function activateCampaign(campaignId: string, durationDays: number): Promise<boolean> {
  const collection = await getCampaignsCollection();
  const activatedAt = new Date();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);
  
  const result = await collection.updateOne(
    { id: campaignId },
    { 
      $set: { 
        status: "active",
        activatedAt,
        expiresAt,
        daysLeft: durationDays
      } 
    }
  );
  return result.modifiedCount > 0;
}
