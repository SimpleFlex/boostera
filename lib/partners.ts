export interface Partner {
  id: number;
  name: string;
  logo: string;
  color: string;
}

export const PARTNERS: Partner[] = [
  // Cosmos ecosystem (10)
  {
    id: 1,
    name: "Kujira",
    color: "#F15A24",
    logo: "https://raw.githubusercontent.com/cosmos/chain-registry/master/kujira/images/kuji.png",
  },
  {
    id: 2,
    name: "Neutron",
    color: "#7B61FF",
    logo: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/ntrn.png",
  },
  {
    id: 3,
    name: "Saga",
    color: "#E84142",
    logo: "https://raw.githubusercontent.com/cosmos/chain-registry/master/saga/images/saga.png",
  },
  {
    id: 4,
    name: "Stride",
    color: "#E50571",
    logo: "https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/strd.png",
  },
  {
    id: 5,
    name: "Sei",
    color: "#9D1C42",
    logo: "https://raw.githubusercontent.com/cosmos/chain-registry/master/sei/images/sei.png",
  },
  {
    id: 6,
    name: "Axelar",
    color: "#0D6EFD",
    logo: "https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/axl.png",
  },
  {
    id: 7,
    name: "Stargaze",
    color: "#DB2777",
    logo: "https://raw.githubusercontent.com/cosmos/chain-registry/master/stargaze/images/stars.png",
  },
  {
    id: 8,
    name: "Juno",
    color: "#F0827D",
    logo: "https://raw.githubusercontent.com/cosmos/chain-registry/master/juno/images/juno.png",
  },
  {
    id: 9,
    name: "Evmos",
    color: "#ED4E33",
    logo: "https://raw.githubusercontent.com/cosmos/chain-registry/master/evmos/images/evmos.png",
  },
  {
    id: 10,
    name: "Secret",
    color: "#6B7280",
    logo: "https://raw.githubusercontent.com/cosmos/chain-registry/master/secretnetwork/images/scrt.png",
  },

  // Exchanges (8)
  { id: 11, name: "MEXC", color: "#00B4E4", logo: "/images/mexc.png" },
  { id: 12, name: "KuCoin", color: "#23AF91", logo: "/images/kucoin.png" },
  { id: 13, name: "Bybit", color: "#F7A600", logo: "images/bybit.png" },
  { id: 14, name: "OKX", color: "#000000", logo: "/images/okx.png" },
  { id: 15, name: "Gate.io", color: "#2354E6", logo: "/images/gateio.png" },
  { id: 16, name: "Bitget", color: "#00C9C9", logo: "/images/bitget.png" },
  { id: 17, name: "HTX", color: "#347AF0", logo: "/images/htx.png" },
  { id: 18, name: "BingX", color: "#1DA2F2", logo: "/images/bingx.png" },
];
