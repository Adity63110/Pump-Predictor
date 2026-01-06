import { type User, type InsertUser, type Market, type InsertMarket, type Vote, type InsertVote } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getMarket(id: string): Promise<Market | undefined>;
  getMarketByCA(ca: string): Promise<Market | undefined>;
  getTrendingMarkets(): Promise<Market[]>;
  createMarket(market: InsertMarket): Promise<Market>;
  updateMarketVotes(id: string, type: 'w' | 'trash'): Promise<void>;
  addVote(vote: InsertVote): Promise<Vote>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private markets: Map<string, Market>;
  private votes: Map<string, Vote>;

  constructor() {
    this.users = new Map();
    this.markets = new Map();
    this.votes = new Map();
    this.seed();
  }

  private seed() {
    const initialMarkets: InsertMarket[] = [
      {
        id: "pepe-the-frog",
        name: "Pepe",
        symbol: "PEPE",
        ca: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
        imageUrl: "https://cryptologos.cc/logos/pepe-pepe-logo.png",
        marketCap: 420000000,
        launchTime: "2023-04-14T00:00:00Z",
        devWalletPct: "1.2",
        isFrozen: false,
        rugScale: 12,
        wVotes: 8540,
        trashVotes: 1230,
        chartData: [],
      },
      {
        id: "rug-pull-inu",
        name: "RugPull Inu",
        symbol: "RUG",
        ca: "8h4k3j2l1m4n5o6p7q8r9s0t1u2v3w4x5y6z",
        imageUrl: "",
        marketCap: 5000,
        launchTime: "2025-01-05T12:00:00Z",
        devWalletPct: "45.0",
        isFrozen: false,
        rugScale: 94,
        wVotes: 12,
        trashVotes: 980,
        chartData: [],
      }
    ];

    initialMarkets.forEach(m => {
      const market: Market = {
        ...m,
        id: m.id || randomUUID(),
        imageUrl: m.imageUrl ?? "",
        marketCap: m.marketCap ?? 0,
        devWalletPct: m.devWalletPct ?? "0",
        isFrozen: m.isFrozen ?? false,
        rugScale: m.rugScale ?? 0,
        wVotes: m.wVotes ?? 0,
        trashVotes: m.trashVotes ?? 0,
        chartData: m.chartData ?? [],
      };
      this.markets.set(market.id, market);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getMarket(id: string): Promise<Market | undefined> {
    return this.markets.get(id);
  }

  async getMarketByCA(ca: string): Promise<Market | undefined> {
    return Array.from(this.markets.values()).find(m => m.ca === ca);
  }

  async getTrendingMarkets(): Promise<Market[]> {
    return Array.from(this.markets.values())
      .sort((a, b) => (b.wVotes + b.trashVotes) - (a.wVotes + a.trashVotes))
      .slice(0, 10);
  }

  async createMarket(insertMarket: InsertMarket): Promise<Market> {
    const id = insertMarket.id || randomUUID();
    const market: Market = {
      ...insertMarket,
      id,
      imageUrl: insertMarket.imageUrl ?? "",
      marketCap: insertMarket.marketCap ?? 0,
      devWalletPct: insertMarket.devWalletPct ?? "0",
      isFrozen: insertMarket.isFrozen ?? false,
      rugScale: insertMarket.rugScale ?? 0,
      wVotes: insertMarket.wVotes ?? 0,
      trashVotes: insertMarket.trashVotes ?? 0,
      chartData: insertMarket.chartData ?? [],
    };
    this.markets.set(id, market);
    return market;
  }

  async updateMarketVotes(id: string, type: 'w' | 'trash'): Promise<void> {
    const market = this.markets.get(id);
    if (market) {
      if (type === 'w') market.wVotes++;
      else market.trashVotes++;
      this.markets.set(id, market);
    }
  }

  async addVote(insertVote: InsertVote): Promise<Vote> {
    const id = randomUUID();
    const vote: Vote = {
      ...insertVote,
      id,
      ipAddress: insertVote.ipAddress ?? "",
      createdAt: new Date(),
    };
    this.votes.set(id, vote);
    await this.updateMarketVotes(vote.marketId, vote.type as 'w' | 'trash');
    return vote;
  }
}

export const storage = new MemStorage();
