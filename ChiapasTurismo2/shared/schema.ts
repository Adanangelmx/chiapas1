import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Newsletter subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  active: boolean("active").default(true).notNull()
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  email: true,
});

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// Trip itineraries table for saved AI-generated itineraries
export const itineraries = pgTable("itineraries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  experienceType: text("experience_type").notNull(),
  duration: text("duration").notNull(),
  budget: text("budget").notNull(),
  destinations: text("destinations"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertItinerarySchema = createInsertSchema(itineraries).pick({
  userId: true,
  title: true,
  content: true,
  experienceType: true,
  duration: true,
  budget: true,
  destinations: true,
});

export type InsertItinerary = z.infer<typeof insertItinerarySchema>;
export type Itinerary = typeof itineraries.$inferSelect;
