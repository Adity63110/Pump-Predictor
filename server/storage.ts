import { 
  type User, type InsertUser, 
  type Market, type InsertMarket, 
  type Vote, type InsertVote,
  type Message, type InsertMessage,
  users, markets, votes, messages
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getMarket(id: string): Promise<Market | undefined>;
  getMarketByCA(ca: string): Promise<Market | undefined>;
  getTrendingMarkets(): Promise<Market[]>;
  createMarket(market: InsertMarket): Promise<Market>;
  updateMarketVotes(id: string, type: 'W' | 'TRASH'): Promise<void>;
  
  getVote(marketId: string, voterWallet: string): Promise<Vote | undefined>;
  addVote(vote: InsertVote): Promise<Vote>;
  
  getMessages(marketId: string): Promise<Message[]>;
  addMessage(message: InsertMessage): Promise<Message>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getMarket(id: string): Promise<Market | undefined> {
    const [market] = await db.select().from(markets).where(
      sql`LOWER(${markets.id}) = LOWER(${id}) OR LOWER(${markets.ca}) = LOWER(${id})`
    );
    return market;
  }

  async getMarketByCA(ca: string): Promise<Market | undefined> {
    const [market] = await db.select().from(markets).where(
      sql`LOWER(${markets.ca}) = LOWER(${ca})`
    );
    return market;
  }

  async getTrendingMarkets(): Promise<Market[]> {
    return await db.select().from(markets)
      .orderBy(desc(sql`${markets.wVotes} + ${markets.trashVotes}`))
      .limit(10);
  }

  async createMarket(insertMarket: InsertMarket): Promise<Market> {
    const [market] = await db.insert(markets).values(insertMarket).returning();
    return market;
  }

  async updateMarketVotes(id: string, type: 'W' | 'TRASH'): Promise<void> {
    if (type === 'W') {
      await db.update(markets).set({ wVotes: sql`${markets.wVotes} + 1` }).where(eq(markets.id, id));
    } else {
      await db.update(markets).set({ trashVotes: sql`${markets.trashVotes} + 1` }).where(eq(markets.id, id));
    }
  }

  async getVote(marketId: string, voterWallet: string): Promise<Vote | undefined> {
    const [vote] = await db.select().from(votes).where(
      and(eq(votes.marketId, marketId), eq(votes.voterWallet, voterWallet))
    );
    return vote;
  }

  async addVote(insertVote: InsertVote): Promise<Vote> {
    const existingVote = await this.getVote(insertVote.marketId, insertVote.voterWallet);
    if (existingVote) {
      if (existingVote.type === insertVote.type) {
        return existingVote;
      }
      // Update existing vote
      const [updatedVote] = await db.update(votes)
        .set({ type: insertVote.type })
        .where(eq(votes.id, existingVote.id))
        .returning();
      
      // Update market counts
      if (insertVote.type === 'W') {
        await db.update(markets).set({ 
          wVotes: sql`${markets.wVotes} + 1`,
          trashVotes: sql`CASE WHEN ${markets.trashVotes} > 0 THEN ${markets.trashVotes} - 1 ELSE 0 END`
        }).where(eq(markets.id, insertVote.marketId));
      } else {
        await db.update(markets).set({ 
          trashVotes: sql`${markets.trashVotes} + 1`,
          wVotes: sql`CASE WHEN ${markets.wVotes} > 0 THEN ${markets.wVotes} - 1 ELSE 0 END`
        }).where(eq(markets.id, insertVote.marketId));
      }
      return updatedVote;
    }

    const [vote] = await db.insert(votes).values(insertVote).returning();
    await this.updateMarketVotes(vote.marketId, vote.type as 'W' | 'TRASH');
    return vote;
  }

  async getMessages(marketId: string): Promise<Message[]> {
    return await db.select().from(messages)
      .where(eq(messages.marketId, marketId))
      .orderBy(desc(messages.createdAt))
      .limit(50);
  }

  async addMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }
}

export const storage = new DatabaseStorage();
