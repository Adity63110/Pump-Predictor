import { useState, useEffect } from "react";

// Types
export interface Token {
  id: string;
  name: string;
  symbol: string;
  ca: string;
  imageUrl: string;
  marketCap: number;
  launchTime: string;
  devWalletPct: number;
  isFrozen: boolean;
  votes: {
    w: number;
    trash: number;
  };
  rugScale: number; // 0-100
  chartData: { time: string; price: number }[];
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  type: "default" | "alert-whale" | "alert-dev" | "alert-lp";
  timestamp: string;
}

// Mock Data Generator
const generateChartData = () => {
  const data = [];
  let price = 100;
  for (let i = 0; i < 20; i++) {
    price = price * (1 + (Math.random() * 0.4 - 0.2));
    data.push({
      time: `${i}m`,
      price: Math.max(0.1, price),
    });
  }
  return data;
};

// Use localStorage to persist votes in the prototype
const getPersistedTokens = (): Token[] => {
  const saved = localStorage.getItem('token_votes');
  if (saved) return JSON.parse(saved);
  
  const initial: Token[] = [
    {
      id: "pepe-the-frog",
      name: "Pepe",
      symbol: "PEPE",
      ca: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
      imageUrl: "https://cryptologos.cc/logos/pepe-pepe-logo.png",
      marketCap: 420000000,
      launchTime: "2023-04-14T00:00:00Z",
      devWalletPct: 1.2,
      isFrozen: false,
      votes: { w: 8540, trash: 1230 },
      rugScale: 12,
      chartData: generateChartData(),
    },
    {
      id: "rug-pull-inu",
      name: "RugPull Inu",
      symbol: "RUG",
      ca: "8h4k3j2l1m4n5o6p7q8r9s0t1u2v3w4x5y6z",
      imageUrl: "",
      marketCap: 5000,
      launchTime: "2025-01-05T12:00:00Z",
      devWalletPct: 45.0,
      isFrozen: false,
      votes: { w: 12, trash: 980 },
      rugScale: 94,
      chartData: generateChartData(),
    },
    {
      id: "based-chad",
      name: "Based Chad",
      symbol: "CHAD",
      ca: "Hg7j8K9L0m1N2o3P4q5R6s7T8u9V0w1X2y3Z",
      imageUrl: "",
      marketCap: 150000,
      launchTime: "2025-01-06T08:30:00Z",
      devWalletPct: 4.5,
      isFrozen: true,
      votes: { w: 450, trash: 420 },
      rugScale: 45,
      chartData: generateChartData(),
    },
  ];
  localStorage.setItem('token_votes', JSON.stringify(initial));
  return initial;
};

export let MOCK_TOKENS = getPersistedTokens();

const MOCK_MESSAGES: ChatMessage[] = [
  { id: "1", user: "Anon592", text: "Dev sold 2%", type: "alert-dev", timestamp: "10:02" },
  { id: "2", user: "CryptoKing", text: "Chart looking bullish", type: "default", timestamp: "10:03" },
  { id: "3", user: "WhaleWatcher", text: "Whale bought 15 SOL", type: "alert-whale", timestamp: "10:05" },
  { id: "4", user: "DegenDave", text: "LFG!!!", type: "default", timestamp: "10:06" },
];

// Service Simulation - Now calling real API
export const mockService = {
  getToken: async (caOrId: string): Promise<Token | undefined> => {
    try {
      const response = await fetch(`/api/markets/${caOrId}`);
      if (response.ok) {
        const market = await response.json();
        return {
          id: market.id,
          name: market.name,
          symbol: market.symbol,
          ca: market.ca,
          imageUrl: market.imageUrl || "",
          marketCap: market.marketCap,
          launchTime: market.launchTime,
          devWalletPct: parseFloat(market.devWalletPct),
          isFrozen: market.isFrozen,
          votes: { w: market.wVotes, trash: market.trashVotes },
          rugScale: market.rugScale,
          chartData: (market.chartData as any[]) || generateChartData()
        };
      }
      
      // If not found, try DexScreener and create
      if (caOrId.length > 30) {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${caOrId}`);
        const data = await response.json();
        if (data.pairs && data.pairs.length > 0) {
          const pair = data.pairs[0];
          const newMarket = {
            id: caOrId,
            name: pair.baseToken.name,
            symbol: pair.baseToken.symbol,
            ca: caOrId,
            imageUrl: pair.info?.imageUrl || "",
            marketCap: Math.floor(pair.fdv || pair.marketCap || 0),
            launchTime: new Date().toISOString(),
            devWalletPct: "5.0",
            isFrozen: false,
            rugScale: Math.floor(Math.random() * 100),
            wVotes: 0,
            trashVotes: 0,
            chartData: generateChartData()
          };
          
          await fetch('/api/markets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMarket)
          });
          
          return {
            ...newMarket,
            devWalletPct: 5.0,
            votes: { w: 0, trash: 0 }
          } as Token;
        }
      }
    } catch (e) {
      console.error("API error", e);
    }
    return undefined;
  },
  
  getTrending: async (): Promise<Token[]> => {
    try {
      const response = await fetch('/api/markets/trending');
      const markets = await response.json();
      return markets.map((market: any) => ({
        id: market.id,
        name: market.name,
        symbol: market.symbol,
        ca: market.ca,
        imageUrl: market.imageUrl || "",
        marketCap: market.marketCap,
        launchTime: market.launchTime,
        devWalletPct: parseFloat(market.devWalletPct),
        isFrozen: market.isFrozen,
        votes: { w: market.wVotes, trash: market.trashVotes },
        rugScale: market.rugScale,
        chartData: market.chartData || []
      }));
    } catch (e) {
      console.error("API error", e);
      return [];
    }
  },

  getMessages: async (): Promise<ChatMessage[]> => {
    return MOCK_MESSAGES;
  },
  
  vote: async (tokenId: string, type: 'w' | 'trash') => {
    try {
      await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketId: tokenId, type })
      });
      return true;
    } catch (e) {
      console.error("API error", e);
      return false;
    }
  }
};
