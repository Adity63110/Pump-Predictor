import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const markets = pgTable("markets", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  ca: text("ca").notNull().unique(),
  imageUrl: text("image_url").default(""),
  marketCap: integer("market_cap").notNull().default(0),
  launchTime: text("launch_time").notNull(),
  devWalletPct: text("dev_wallet_pct").notNull().default("0"),
  isFrozen: boolean("is_frozen").notNull().default(false),
  rugScale: integer("rug_scale").notNull().default(0),
  wVotes: integer("w_votes").notNull().default(0),
  trashVotes: integer("trash_votes").notNull().default(0),
  chartData: jsonb("chart_data").notNull().default([]),
});

export const votes = pgTable("votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  marketId: varchar("market_id").notNull().references(() => markets.id),
  voterWallet: text("voter_wallet").notNull(),
  type: text("type").notNull(), // 'W' or 'TRASH'
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  marketId: varchar("market_id").notNull().references(() => markets.id),
  voterWallet: text("voter_wallet").notNull(),
  messageText: text("message_text").notNull(),
  type: text("type").notNull().default("default"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMarketSchema = createInsertSchema(markets);
export const insertVoteSchema = createInsertSchema(votes);
export const insertMessageSchema = createInsertSchema(messages);

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Market = typeof markets.$inferSelect;
export type InsertMarket = z.infer<typeof insertMarketSchema>;
export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
