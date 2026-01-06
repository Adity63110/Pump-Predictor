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
      // 1. Fetch from our API first
      const response = await fetch(`/api/markets/${caOrId}`);
      let market = null;
      if (response.ok) {
        market = await response.json();
      }
      
      // 2. Always try to get fresh data from DexScreener for the chart
      const dexResponse = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${caOrId}`);
      const dexData = await dexResponse.json();
      
      let dexPair = dexData.pairs?.[0];
      
      // If we have a market in our DB, update it with fresh DexScreener data if found
      if (market) {
        const token: Token = {
          id: market.id,
          name: market.name,
          symbol: market.symbol,
          ca: market.ca,
          imageUrl: dexPair?.info?.imageUrl || market.imageUrl || "",
          marketCap: dexPair?.fdv || dexPair?.marketCap || market.marketCap,
          launchTime: market.launchTime,
          devWalletPct: parseFloat(market.devWalletPct),
          isFrozen: market.isFrozen,
          votes: { w: market.wVotes, trash: market.trashVotes },
          rugScale: market.rugScale,
          chartData: generateChartData() // We'll still generate mock points but base them on real price
        };
        
        if (dexPair?.priceUsd) {
          const currentPrice = parseFloat(dexPair.priceUsd);
          token.chartData = token.chartData.map(d => ({ 
            ...d, 
            price: currentPrice * (0.98 + Math.random() * 0.04) 
          }));
        }
        return token;
      }
      
      // 3. If not in DB but found on DexScreener, create it
      if (dexPair) {
        const ca = dexPair.baseToken.address;
        const newMarket = {
          id: ca,
          name: dexPair.baseToken.name,
          symbol: dexPair.baseToken.symbol,
          ca: ca,
          imageUrl: dexPair.info?.imageUrl || "",
          marketCap: Math.floor(dexPair.fdv || dexPair.marketCap || 0),
          launchTime: new Date().toISOString(),
          devWalletPct: "5.0",
          isFrozen: false,
          rugScale: Math.floor(Math.random() * 100),
          wVotes: 0,
          trashVotes: 0,
          chartData: []
        };
        
        await fetch('/api/markets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMarket)
        });
        
        const currentPrice = parseFloat(dexPair.priceUsd || "0");
        return {
          ...newMarket,
          devWalletPct: 5.0,
          votes: { w: 0, trash: 0 },
          chartData: generateChartData().map(d => ({ 
            ...d, 
            price: currentPrice * (0.98 + Math.random() * 0.04) 
          }))
        } as Token;
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
      
      // Enhance trending results with fresh DexScreener data
      return await Promise.all(markets.map(async (market: any) => {
        try {
          const dexRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${market.ca}`);
          const dexData = await dexRes.json();
          const dexPair = dexData.pairs?.[0];
          
          const currentPrice = parseFloat(dexPair?.priceUsd || "0");
          return {
            id: market.id,
            name: market.name,
            symbol: market.symbol,
            ca: market.ca,
            imageUrl: dexPair?.info?.imageUrl || market.imageUrl || "",
            marketCap: dexPair?.fdv || dexPair?.marketCap || market.marketCap,
            launchTime: market.launchTime,
            devWalletPct: parseFloat(market.devWalletPct),
            isFrozen: market.isFrozen,
            votes: { w: market.wVotes, trash: market.trashVotes },
            rugScale: market.rugScale,
            chartData: generateChartData().map(d => ({ 
              ...d, 
              price: currentPrice > 0 ? currentPrice * (0.98 + Math.random() * 0.04) : 0 
            }))
          };
        } catch {
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
            chartData: []
          };
        }
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
