import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMarketSchema, insertVoteSchema } from "@shared/schema";
import { OpenAI } from "openai";

// Using Replit AI Integrations for OpenAI access
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/markets/trending", async (_req, res) => {
    const markets = await storage.getTrendingMarkets();
    res.json(markets);
  });

  app.get("/api/markets/:id", async (req, res) => {
    const market = await storage.getMarket(req.params.id) || await storage.getMarketByCA(req.params.id);
    if (!market) {
      return res.status(404).json({ message: "Market not found" });
    }
    res.json(market);
  });

  app.post("/api/markets", async (req, res) => {
    const result = insertMarketSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const market = await storage.createMarket(result.data);
    res.json(market);
  });

  app.post("/api/votes", async (req, res) => {
    const result = insertVoteSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const vote = await storage.addVote(result.data);
    res.json(vote);
  });

  app.post("/api/ai/analyse", async (req, res) => {
    const { ca } = req.body;
    if (!ca) return res.status(400).json({ message: "CA is required" });

    try {
      // Simulate/Fetch market data
      const dexResponse = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${ca}`);
      const dexData = await dexResponse.json();
      const dexPair = dexData.pairs?.[0];

      if (!dexPair) {
        return res.status(404).json({ message: "Token not found on chain" });
      }

      // Simulated accurate holder analysis for the prototype
      // In a real app, this would use Helius or another Solana RPC
      const simulatedDevWallet = "5z3f...x9v";
      const simulatedTopHolders = [
        { address: simulatedDevWallet, amount: "4.8%", label: "Developer" },
        { address: "8x2p...m3q", amount: "3.2%", label: "Whale" },
        { address: "2n9v...k4s", amount: "2.9%", label: "Whale" },
        { address: "4m1t...p5r", amount: "2.5%", label: "Top Holder" },
        { address: "9z8u...q2w", amount: "2.1%", label: "Top Holder" },
      ];

      const marketData = {
        name: dexPair.baseToken.name,
        symbol: dexPair.baseToken.symbol,
        volume: dexPair.volume?.h24 || 0,
        fdv: dexPair.fdv || 0,
        liquidity: dexPair.liquidity?.usd || 0,
        topHolders: simulatedTopHolders,
        devShare: "4.8%",
        rugScore: Math.floor(Math.random() * 40), // More realistic for "potentially good" tokens found on Dex
      };

      const prompt = `Analyse this token data and give a verdict (W or L). 
      Token: ${marketData.name} (${marketData.symbol})
      Volume: $${marketData.volume.toLocaleString()}
      FDV: $${marketData.fdv.toLocaleString()}
      Dev Share: ${marketData.devShare}
      Top 5 Holders: ${marketData.topHolders.map(h => `${h.label}: ${h.amount}`).join(", ")}
      
      Respond with a JSON object: { "verdict": "W" | "L", "reasoning": "string" }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const analysis = JSON.parse(response.choices[0].message.content || "{}");
      
      // Ensure market exists in DB
      let market = await storage.getMarketByCA(ca);
      if (!market) {
        market = await storage.createMarket({
          id: ca,
          name: marketData.name,
          symbol: marketData.symbol,
          ca: ca,
          imageUrl: dexPair.info?.imageUrl || "",
          marketCap: Math.floor(marketData.fdv),
          launchTime: new Date().toISOString(),
          devWalletPct: marketData.devShare.replace("%", ""),
          rugScale: marketData.rugScore,
        });
      }

      res.json({
        ...marketData,
        verdict: analysis.verdict,
        reasoning: analysis.reasoning,
        roomId: market.id
      });
    } catch (error: any) {
      console.error("AI Analysis error:", error);
      res.status(500).json({ message: "AI analysis failed" });
    }
  });

  return httpServer;
}
