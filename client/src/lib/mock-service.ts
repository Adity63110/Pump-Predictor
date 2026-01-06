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

// Service Simulation
export const mockService = {
  getToken: async (caOrId: string): Promise<Token | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    MOCK_TOKENS = getPersistedTokens();
    return MOCK_TOKENS.find((t) => t.id === caOrId || t.ca === caOrId || t.symbol === caOrId);
  },
  
  getTrending: async (): Promise<Token[]> => {
    MOCK_TOKENS = getPersistedTokens();
    return MOCK_TOKENS;
  },

  getMessages: async (): Promise<ChatMessage[]> => {
    return MOCK_MESSAGES;
  },
  
  vote: async (tokenId: string, type: 'w' | 'trash') => {
    MOCK_TOKENS = getPersistedTokens();
    const index = MOCK_TOKENS.findIndex(t => t.id === tokenId);
    if (index !== -1) {
      MOCK_TOKENS[index].votes[type]++;
      localStorage.setItem('token_votes', JSON.stringify(MOCK_TOKENS));
    }
    return true;
  }
};
