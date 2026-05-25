// Live cryptocurrency price service
const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price";

export interface CryptoPrices {
  bitcoin: number;
  ethereum: number;
  solana: number;
  binancecoin: number;
  usdt: number;
  lastUpdated: Date;
}

let cachedPrices: CryptoPrices | null = null;
let lastFetch = 0;
const CACHE_DURATION = 60000; // 1 minute cache

export async function getLivePrices(): Promise<CryptoPrices> {
  const now = Date.now();
  
  // Return cached prices if still fresh
  if (cachedPrices && (now - lastFetch) < CACHE_DURATION) {
    return cachedPrices;
  }
  
  try {
    const response = await fetch(
      `${COINGECKO_API}?ids=bitcoin,ethereum,solana,binancecoin&vs_currencies=usd`,
      { next: { revalidate: 60 } }
    );
    
    const data = await response.json();
    
    cachedPrices = {
      bitcoin: data.bitcoin?.usd || 65000,
      ethereum: data.ethereum?.usd || 3500,
      solana: data.solana?.usd || 150,
      binancecoin: data.binancecoin?.usd || 600,
      usdt: 1,
      lastUpdated: new Date(),
    };
    
    lastFetch = now;
    return cachedPrices;
  } catch (error) {
    console.error("Failed to fetch prices:", error);
    // Return fallback prices
    return {
      bitcoin: 65000,
      ethereum: 3500,
      solana: 150,
      binancecoin: 600,
      usdt: 1,
      lastUpdated: new Date(),
    };
  }
}

// Convert USD amount to cryptocurrency amount
export async function usdToCrypto(usdAmount: number, crypto: string): Promise<number> {
  const prices = await getLivePrices();
  
  switch (crypto.toLowerCase()) {
    case "btc":
    case "bitcoin":
      return usdAmount / prices.bitcoin;
    case "eth":
    case "ethereum":
      return usdAmount / prices.ethereum;
    case "sol":
    case "solana":
      return usdAmount / prices.solana;
    case "bnb":
    case "binancecoin":
      return usdAmount / prices.binancecoin;
    case "usdt":
      return usdAmount;
    default:
      return usdAmount;
  }
}

// Format cryptocurrency amount with appropriate decimals
export function formatCryptoAmount(amount: number, crypto: string): string {
  if (crypto.toLowerCase() === "usdt") {
    return amount.toFixed(2);
  }
  if (amount < 0.001) return amount.toFixed(8);
  if (amount < 0.01) return amount.toFixed(6);
  if (amount < 1) return amount.toFixed(4);
  return amount.toFixed(4);
}
