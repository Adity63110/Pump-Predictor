import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMarketSchema, insertVoteSchema } from "@shared/schema";

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

  return httpServer;
}
