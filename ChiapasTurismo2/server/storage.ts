import { users, subscriptions, itineraries, type User, type InsertUser, type Subscription, type InsertSubscription, type Itinerary, type InsertItinerary } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface con métodos CRUD para todas las entidades
export interface IStorage {
  // Métodos para usuarios
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Métodos para suscripciones
  getSubscription(id: number): Promise<Subscription | undefined>;
  getSubscriptionByEmail(email: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  
  // Métodos para itinerarios
  getItinerary(id: number): Promise<Itinerary | undefined>;
  getItinerariesByUserId(userId: number): Promise<Itinerary[]>;
  createItinerary(itinerary: InsertItinerary): Promise<Itinerary>;
}

export class DatabaseStorage implements IStorage {
  // Métodos para usuarios
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Métodos para suscripciones
  async getSubscription(id: number): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return subscription || undefined;
  }

  async getSubscriptionByEmail(email: string): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.email, email));
    return subscription || undefined;
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db
      .insert(subscriptions)
      .values(insertSubscription)
      .returning();
    return subscription;
  }

  // Métodos para itinerarios
  async getItinerary(id: number): Promise<Itinerary | undefined> {
    const [itinerary] = await db.select().from(itineraries).where(eq(itineraries.id, id));
    return itinerary || undefined;
  }

  async getItinerariesByUserId(userId: number): Promise<Itinerary[]> {
    return await db.select().from(itineraries).where(eq(itineraries.userId, userId));
  }

  async createItinerary(insertItinerary: InsertItinerary): Promise<Itinerary> {
    const [itinerary] = await db
      .insert(itineraries)
      .values(insertItinerary)
      .returning();
    return itinerary;
  }
}

export const storage = new DatabaseStorage();
