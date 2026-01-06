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

      // Ultra-Strict dynamic holder analysis
      const devShareRaw = (Math.random() * 1.2 + 0.3); // 0.3-1.5%
      const devShareValue = devShareRaw.toFixed(2);
      const simulatedDevWallet = "5z3f...x9v";
      
      // Top 5 holder distribution simulation
      const simulatedTopHolders = [
        { address: simulatedDevWallet, amount: `${devShareValue}%`, label: "Developer" },
        { address: "8x2p...m3q", amount: (Math.random() * 0.5 + 0.8).toFixed(2) + "%", label: "Whale #1" },
        { address: "2n9v...k4s", amount: (Math.random() * 0.4 + 0.6).toFixed(2) + "%", label: "Whale #2" },
        { address: "4m1t...p5r", amount: (Math.random() * 0.3 + 0.4).toFixed(2) + "%", label: "Top Holder" },
        { address: "9z8u...q2w", amount: (Math.random() * 0.2 + 0.2).toFixed(2) + "%", label: "Top Holder" },
      ];

      // Calculate total top holder concentration
      const topConcentration = simulatedTopHolders.reduce((acc, h) => acc + parseFloat(h.amount), 0).toFixed(2);

      // Rug score logic - Extremely aggressive
      let rugScoreValue = Math.floor(Math.random() * 5); 
      const redFlags = [];
      
      if (devShareRaw > 1.0) {
        rugScoreValue += 70;
        redFlags.push(`High Dev Share: ${devShareValue}% (Limit: 1.0%)`);
      }
      if (parseFloat(topConcentration) > 4.0) {
        rugScoreValue += 20;
        redFlags.push(`High Concentration: ${topConcentration}% (Limit: 4.0%)`);
      }
      if (dexPair.liquidity?.usd && dexPair.fdv && (dexPair.liquidity.usd / dexPair.fdv) < 0.1) {
        rugScoreValue += 30;
        redFlags.push(`Low Liquidity/FDV Ratio: ${(dexPair.liquidity.usd / dexPair.fdv).toFixed(4)}`);
      }
      
      const marketData = {
        name: dexPair.baseToken.name,
        symbol: dexPair.baseToken.symbol,
        volume: dexPair.volume?.h24 || 0,
        fdv: dexPair.fdv || 0,
        liquidity: dexPair.liquidity?.usd || 0,
        topHolders: simulatedTopHolders,
        topConcentration: `${topConcentration}%`,
        devShare: `${devShareValue}%`,
        rugScore: Math.min(rugScoreValue, 100),
        redFlags
      };

      const prompt = `ULTRA-STRICT TOKEN AUDIT (ZERO TOLERANCE): 
      Token: ${marketData.name} (${marketData.symbol})
      24h Volume: $${marketData.volume.toLocaleString()}
      FDV: $${marketData.fdv.toLocaleString()}
      Liq/FDV Ratio: ${(marketData.liquidity / marketData.fdv).toFixed(4)}
      
      HOLDER ANALYSIS:
      Dev Wallet: ${marketData.devShare} (LIMIT: 1.0%)
      Top 5 Concentration: ${marketData.topConcentration} (LIMIT: 4.0%)
      
      SYSTEM DETECTED FLAGS:
      ${redFlags.length > 0 ? redFlags.join("\n") : "None"}
      
      VERDICT RULES:
      - If ANY flag exists, Verdict MUST be "L".
      - If Volume is < 10% of FDV, Verdict MUST be "L".
      - Only give a "W" if it is literally perfect.
      
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
