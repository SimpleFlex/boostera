import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://boostera:primolax@boostera.2vxbrpu.mongodb.net/boostera";
const dbName = process.env.MONGODB_DB_NAME || "boostera";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getCampaignsCollection() {
  const { db } = await connectToDatabase();
  const collection = db.collection("campaigns");
  
  await collection.createIndex({ ca: 1 });
  await collection.createIndex({ status: 1 });
  await collection.createIndex({ submittedAt: -1 });
  await collection.createIndex({ expiresAt: 1 });
  
  return collection;
}

export interface Campaign {
  _id?: string;
  id: string;
  ca: string;
  chain: string | null;
  packageId: string;
  packageName: string;
  amount: number;
  discountAmount?: number;
  promoCode?: string;
  paymentMethod: string | null;
  txHash: string;
  customerEmail?: string;
  customerTwitter?: string;
  referralCode?: string;
  status: "pending" | "verified" | "active" | "completed" | "rejected" | "expired";
  submittedAt: Date;
  verifiedAt: Date | null;
  activatedAt: Date | null;
  expiresAt: Date | null;
  daysLeft?: number;
  notes: string | null;
}
