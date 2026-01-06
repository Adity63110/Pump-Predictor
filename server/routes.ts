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
      // 1. Data Gathering & Feature Building
      const dexResponse = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${ca}`);
      const dexData = await dexResponse.json();
      const dexPair = dexData.pairs?.[0];

      if (!dexPair) {
        return res.status(404).json({ message: "Token not found on chain" });
      }

      const market = await storage.getMarketByCA(ca);
      const messages = market ? await storage.getMessages(market.id) : [];
      
      // On-chain Signals (Simulated/Calculated)
      const tokenAgeMin = Math.floor((Date.now() - new Date(dexPair.pairCreatedAt || Date.now()).getTime()) / 60000);
      const isMintFrozen = Math.random() > 0.9; // Mock signal
      const lpBurned = Math.random() > 0.2; // Mock signal
      const devWalletPct = Math.random() * 15; // Mock signal
      const earlyBuyerCluster = Math.random(); // Mock signal 0-1
      
      // Crowd Signals
      const wVotes = market?.wVotes || 0;
      const trashVotes = market?.trashVotes || 0;
      const totalVotes = wVotes + trashVotes;
      const wRatio = totalVotes > 0 ? wVotes / totalVotes : 0.5;
      
      const chatWarningDensity = messages.length > 0 
        ? messages.filter(m => m.messageText.toLowerCase().includes("rug") || m.messageText.toLowerCase().includes("scam")).length / messages.length 
        : 0;

      // Behavioral (Mocked based on patterns)
      const devPastRugs = Math.random() > 0.8 ? 1 : 0;

      const features = {
        token_age_minutes: tokenAgeMin,
        mint_frozen: isMintFrozen,
        lp_burned: lpBurned,
        dev_supply_percent: devWalletPct.toFixed(2),
        early_buyer_clustering: earlyBuyerCluster.toFixed(2),
        w_ratio: wRatio.toFixed(2),
        chat_warning_density: chatWarningDensity.toFixed(2),
        dev_past_rugs: devPastRugs
      };

      // 2. Rule-Based Pre-Scoring
      const redFlags = [];
      let ruleRiskScore = 0;

      if (!lpBurned) {
        ruleRiskScore += 40;
        redFlags.push("Liquidity not burned/locked");
      }
      if (devWalletPct > 10) {
        ruleRiskScore += 30;
        redFlags.push(`High Dev Holding: ${devWalletPct.toFixed(2)}%`);
      }
      if (devPastRugs > 0) {
        ruleRiskScore += 50;
        redFlags.push("Developer associated with previous rugs");
      }

      // 3. AI Crypto Risk Analyst Layer
      const prompt = `ACT AS A SENIOR CRYPTO RISK ANALYST.
      Your task is to provide a surgical audit of a Solana token.
      
      INPUT DATA (Structured Signals):
      ${JSON.stringify(features, null, 2)}

      EVALUATION GUIDELINES:
      - 1️⃣ On-chain Signals: Focus on supply concentration and LP status.
      - 2️⃣ Crowd Signals: Analyze market sentiment (W/Trash ratio) and chat warnings.
      - 3️⃣ Behavioral History: Weigh developer reputation heavily.
      
      OUTPUT REQUIREMENTS:
      - RISK LEVEL: Low / Medium / High
      - CONFIDENCE: Weak / Moderate / Strong
      - REASONS: Top 3-4 specific technical reasons for the verdict.
      - DO NOT use words like "Safe", "Profitable", or "Guaranteed".
      
      Respond EXCLUSIVELY with a JSON object:
      {
        "risk_level": "string",
        "confidence": "string",
        "reasons": ["string", "string", ...],
        "verdict": "W" | "L"
      }`;

      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const analysis = JSON.parse(aiResponse.choices[0].message.content || "{}");
      
      // Persistence
      let updatedMarket = market;
      if (!updatedMarket) {
        updatedMarket = await storage.createMarket({
          id: ca,
          name: dexPair.baseToken.name,
          symbol: dexPair.baseToken.symbol,
          ca: ca,
          imageUrl: dexPair.info?.imageUrl || "",
          marketCap: Math.floor(dexPair.fdv || 0),
          launchTime: new Date(dexPair.pairCreatedAt || Date.now()).toISOString(),
          devWalletPct: devWalletPct.toFixed(2),
          rugScale: Math.min(ruleRiskScore + (analysis.risk_level === "High" ? 30 : 10), 100),
        });
      } else {
        // Update rug scale based on new analysis
        // In a real app we'd have a more robust update mechanism
      }

      res.json({
        ca,
        name: dexPair.baseToken.name,
        symbol: dexPair.baseToken.symbol,
        riskLevel: analysis.risk_level,
        confidence: analysis.confidence,
        reasons: analysis.reasons,
        verdict: analysis.verdict,
        features,
        redFlags: redFlags.length > 0 ? redFlags : analysis.reasons.filter((r: string) => r.toLowerCase().includes("risk") || r.toLowerCase().includes("detected")),
        roomId: updatedMarket.id
      });

    } catch (error: any) {
      console.error("AI Analysis error:", error);
      res.status(500).json({ message: "AI analysis failed" });
    }
  });

  return httpServer;
}
