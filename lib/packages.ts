export type PackageId = "growth" | "viral" | "premium" | "ultimate" | "institutional";

export interface PromotionPackage {
  id: PackageId;
  name: string;
  price: { usd: number };
  features: string[];
  popular?: boolean;
  badge?: string;
  duration: string;
  impressions: string;
}

export const PACKAGES: PromotionPackage[] = [
  { 
    id: "growth", 
    name: "Growth Package", 
    price: { usd: 299 }, 
    features: [
      "Community growth & onboarding",
      "Organic holder growth campaign",
      "Twitter/X promotion & engagement",
      "Volume boost exposure",
      "Market cap awareness push"
    ], 
    duration: "2 days (Intensive)", 
    impressions: "100K+", 
    popular: true 
  },
  { 
    id: "viral", 
    name: "Viral Push", 
    price: { usd: 599 }, 
    features: [
      "Influencer repost & viral marketing",
      "Aggressive holder acquisition",
      "Trading volume acceleration",
      "Multi-community raid campaigns",
      "Market cap growth strategy"
    ], 
    duration: "3 days (Viral Sprint)", 
    impressions: "250K+", 
    badge: "Best Value" 
  },
  { 
    id: "premium", 
    name: "Premium Boost", 
    price: { usd: 999 }, 
    features: [
      "Premium custom project website",
      "KOL partnerships & promotions",
      "CoinMarketCap visibility boost",
      "Advanced volume growth campaign",
      "Investor attraction & holder expansion",
      "Full support throughout campaign"
    ], 
    duration: "Full Campaign Support", 
    impressions: "500K+" 
  },
  { 
    id: "ultimate", 
    name: "Ultimate Campaign", 
    price: { usd: 2499 }, 
    features: [
      "Full multi-platform domination campaign",
      "Massive holder & community growth",
      "Large-scale market cap expansion",
      "Dedicated campaign manager support",
      "Long-term hype & ecosystem growth",
      "Priority 24/7 support"
    ], 
    duration: "Premium Full Support", 
    impressions: "1M+", 
    badge: "Elite" 
  },
  { 
    id: "institutional", 
    name: "Institutional Alpha", 
    price: { usd: 3499 }, 
    features: [
      "Venture Capital & institutional investor pipeline",
      "Tier-1 KOL & exclusive alpha group partnerships",
      "Top-Tier CEX listing strategy & preparation",
      "Advanced market making & liquidity depth consulting",
      "Strategic ecosystem integrations & utility expansion",
      "24/7 dedicated executive advisory & full team support"
    ], 
    duration: "Executive Support", 
    impressions: "2.5M+", 
    badge: "Institutional" 
  },
];

// REAL PAYMENT ADDRESSES
export const PAYMENT_ADDRESSES = {
  // Bitcoin
  BTC: "bc1qujkzequ4he2va2a0d3vrajaja0flp3vfqf9g9y",
  
  // USDT on TRC20 (Tron network)
  USDT_TRC20: "TNMXiCcjBgEx8QVxYLYfonZg5pCePEfem5",
  
  // USDT on BEP20 (BNB Chain)
  USDT_BEP20: "0x078b8e8cf1b0e77c8859f68e09961c252149432d",
  
  // BNB (BNB Chain)
  BNB: "0x078b8e8cf1b0e77c8859f68e09961c252149432d",
  
  // Ethereum (ERC20)
  ETH: "0x078b8e8cf1b0e77c8859f68e09961c252149432d",
  
  // Solana
  SOL: "4x5KjDaamzqDWMV5sB39cC13ZyqgfTNgUGZGcQKgADYC",
};

// Network information for display
export const PAYMENT_NETWORKS = {
  BTC: { name: "Bitcoin", network: "Bitcoin Network", icon: "₿", decimals: 8, warning: "Send only BTC to this address" },
  USDT_TRC20: { name: "USDT", network: "TRC20 (Tron)", icon: "₮", decimals: 2, warning: "Send only USDT on TRC20 network" },
  USDT_BEP20: { name: "USDT", network: "BEP20 (BNB Chain)", icon: "₮", decimals: 2, warning: "Send only USDT on BEP20 network" },
  BNB: { name: "BNB", network: "BEP20 (BNB Chain)", icon: "🔶", decimals: 4, warning: "Send only BNB on BEP20 network" },
  ETH: { name: "Ethereum", network: "ERC20", icon: "⟠", decimals: 4, warning: "Send only ETH on ERC20 network" },
  SOL: { name: "Solana", network: "Solana", icon: "◎", decimals: 4, warning: "Send only SOL on Solana network" },
};
