import { and, asc, count, desc, eq, gte, like, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  inquiries,
  InsertUser,
  properties,
  propertyImages,
  savedProperties,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function updateUserAccountType(userId: number, accountType: "buyer" | "owner" | "agent") {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(users).set({ accountType }).where(eq(users.id, userId));
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result[0];
}

export type MarketplaceFilters = {
  location?: string;
  listingMode?: "sale" | "rent";
  propertyType?: "house" | "apartment" | "land" | "commercial";
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  sort?: "recommended" | "newest" | "price-low" | "price-high";
};

async function attachImages<T extends { id: number }>(rows: T[]) {
  const db = await getDb();
  if (!db) return rows.map(row => ({ ...row, images: [] as string[] }));
  return Promise.all(rows.map(async row => {
    const imageRows = await db.select({ url: propertyImages.url })
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, row.id))
      .orderBy(asc(propertyImages.sortOrder));
    return { ...row, images: imageRows.map(image => image.url) };
  }));
}

export async function listApprovedProperties(filters: MarketplaceFilters = {}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(properties.status, "approved")];
  if (filters.location) conditions.push(like(properties.location, `%${filters.location}%`));
  if (filters.listingMode) conditions.push(eq(properties.listingMode, filters.listingMode));
  if (filters.propertyType) conditions.push(eq(properties.propertyType, filters.propertyType));
  if (filters.minPrice !== undefined) conditions.push(gte(properties.price, filters.minPrice));
  if (filters.maxPrice !== undefined) conditions.push(lte(properties.price, filters.maxPrice));
  if (filters.minBedrooms !== undefined) conditions.push(gte(properties.bedrooms, filters.minBedrooms));

  const sort = filters.sort ?? "recommended";
  const query = db.select().from(properties).where(and(...conditions));
  const rows = sort === "price-low"
    ? await query.orderBy(asc(properties.price))
    : sort === "price-high"
      ? await query.orderBy(desc(properties.price))
      : sort === "newest"
        ? await query.orderBy(desc(properties.createdAt))
        : await query.orderBy(desc(properties.featured), desc(properties.createdAt));
  return attachImages(rows);
}

export async function getApprovedProperty(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(properties)
    .where(and(eq(properties.id, id), eq(properties.status, "approved")))
    .limit(1);
  const attached = await attachImages(rows);
  return attached[0];
}

export async function getPropertyForOwner(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(properties)
    .where(and(eq(properties.id, id), eq(properties.ownerId, userId)))
    .limit(1);
  const attached = await attachImages(rows);
  return attached[0];
}

export async function getUserProperties(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(properties)
    .where(eq(properties.ownerId, userId))
    .orderBy(desc(properties.createdAt));
  return attachImages(rows);
}

export async function createProperty(input: {
  ownerId: number;
  title: string;
  description: string;
  location: string;
  listingMode: "sale" | "rent";
  propertyType: "house" | "apartment" | "land" | "commercial";
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: string;
  imageUrls: string[];
}) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const inserted = await db.insert(properties).values({
    ownerId: input.ownerId,
    title: input.title,
    description: input.description,
    location: input.location,
    listingMode: input.listingMode,
    propertyType: input.propertyType,
    price: input.price,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    area: input.area,
    status: "pending",
  });
  const propertyId = Number(inserted[0].insertId);
  if (input.imageUrls.length > 0) {
    await db.insert(propertyImages).values(input.imageUrls.map((url, index) => ({
      propertyId,
      url,
      sortOrder: index,
    })));
  }
  return getPropertyForOwner(propertyId, input.ownerId);
}

export async function getSavedPropertyIds(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({ propertyId: savedProperties.propertyId })
    .from(savedProperties)
    .innerJoin(properties, eq(savedProperties.propertyId, properties.id))
    .where(and(eq(savedProperties.userId, userId), eq(properties.status, "approved")));
  return rows.map(row => row.propertyId);
}

export async function getSavedProperties(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({ property: properties })
    .from(savedProperties)
    .innerJoin(properties, eq(savedProperties.propertyId, properties.id))
    .where(and(eq(savedProperties.userId, userId), eq(properties.status, "approved")))
    .orderBy(desc(savedProperties.createdAt));
  return attachImages(rows.map(row => row.property));
}

export async function toggleSavedProperty(userId: number, propertyId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const property = await db.select({ id: properties.id }).from(properties).where(and(
    eq(properties.id, propertyId),
    eq(properties.status, "approved"),
  )).limit(1);
  if (property.length === 0) throw new Error("Only approved properties can be saved");
  const existing = await db.select().from(savedProperties).where(and(
    eq(savedProperties.userId, userId),
    eq(savedProperties.propertyId, propertyId),
  )).limit(1);
  if (existing.length > 0) {
    await db.delete(savedProperties).where(and(
      eq(savedProperties.userId, userId),
      eq(savedProperties.propertyId, propertyId),
    ));
    return { saved: false };
  }
  await db.insert(savedProperties).values({ userId, propertyId });
  return { saved: true };
}

export async function createInquiry(input: {
  propertyId: number;
  userId?: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const property = await db.select({ id: properties.id }).from(properties)
    .where(and(eq(properties.id, input.propertyId), eq(properties.status, "approved"))).limit(1);
  if (property.length === 0) throw new Error("Property is not available");
  const result = await db.insert(inquiries).values(input);
  const inquiryId = Number(result[0].insertId);
  const rows = await db.select().from(inquiries).where(eq(inquiries.id, inquiryId)).limit(1);
  return rows[0];
}

export async function getUserInquiries(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ inquiry: inquiries, propertyTitle: properties.title })
    .from(inquiries)
    .innerJoin(properties, eq(inquiries.propertyId, properties.id))
    .where(eq(inquiries.userId, userId))
    .orderBy(desc(inquiries.createdAt));
}

export async function getAdminInquiries() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ inquiry: inquiries, propertyTitle: properties.title })
    .from(inquiries)
    .innerJoin(properties, eq(inquiries.propertyId, properties.id))
    .orderBy(desc(inquiries.createdAt))
    .limit(50);
}

export async function listPendingProperties() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({ property: properties, ownerName: users.name, ownerEmail: users.email })
    .from(properties)
    .innerJoin(users, eq(properties.ownerId, users.id))
    .where(eq(properties.status, "pending"))
    .orderBy(desc(properties.createdAt));
  const attached = await attachImages(rows.map(row => row.property));
  return attached.map((property, index) => ({
    ...property,
    ownerName: rows[index]?.ownerName ?? "A&O marketplace member",
    ownerEmail: rows[index]?.ownerEmail ?? null,
  }));
}

export async function moderateProperty(id: number, reviewerId: number, status: "approved" | "rejected", moderationNote?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(properties).set({
    status,
    moderationNote: moderationNote || null,
    reviewedBy: reviewerId,
    reviewedAt: new Date(),
  }).where(eq(properties.id, id));
  const rows = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
  return rows[0];
}

export async function getMarketplaceStats() {
  const db = await getDb();
  if (!db) return { total: 0, approved: 0, pending: 0, inquiries: 0 };
  const [total, approved, pending, inquiryCount] = await Promise.all([
    db.select({ value: count() }).from(properties),
    db.select({ value: count() }).from(properties).where(eq(properties.status, "approved")),
    db.select({ value: count() }).from(properties).where(eq(properties.status, "pending")),
    db.select({ value: count() }).from(inquiries),
  ]);
  return {
    total: Number(total[0]?.value ?? 0),
    approved: Number(approved[0]?.value ?? 0),
    pending: Number(pending[0]?.value ?? 0),
    inquiries: Number(inquiryCount[0]?.value ?? 0),
  };
}

export async function ensureMarketplaceSeed() {
  const db = await getDb();
  if (!db) return;
  const current = await db.select({ value: count() }).from(properties);
  if (Number(current[0]?.value ?? 0) > 0) return;

  let seedUser = (await db.select().from(users).where(eq(users.openId, "seed-aorealty-team")).limit(1))[0];
  if (!seedUser) {
    await db.insert(users).values({
      openId: "seed-aorealty-team",
      name: "A&O Verified Team",
      email: "info@aorealty.ug",
      loginMethod: "seed",
      accountType: "agent",
    });
    seedUser = (await db.select().from(users).where(eq(users.openId, "seed-aorealty-team")).limit(1))[0];
  }
  if (!seedUser) return;

  const seed = [
    {
      title: "Sunset Villa with Garden — Kololo",
      description: "A refined family residence in a secure, established Kampala neighbourhood with generous entertaining spaces and a mature garden.",
      location: "Kololo, Kampala",
      listingMode: "sale" as const,
      propertyType: "house" as const,
      price: 850000000,
      bedrooms: 4,
      bathrooms: 4,
      area: "3,500 sq ft",
      featured: true,
      image: "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1200&q=88",
    },
    {
      title: "50 Acres of Productive Agricultural Land",
      description: "Expansive agricultural land with road access and investment potential in a growing Mukono corridor.",
      location: "Mukono",
      listingMode: "sale" as const,
      propertyType: "land" as const,
      price: 120000000,
      bedrooms: 0,
      bathrooms: 0,
      area: "50 acres",
      featured: true,
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=88",
    },
    {
      title: "Modern 2 Bedroom Apartment — Kisaasi",
      description: "Bright apartment with secure parking, reliable utilities, and quick access to Kampala's northern suburbs.",
      location: "Kisaasi, Kampala",
      listingMode: "rent" as const,
      propertyType: "apartment" as const,
      price: 1200000,
      bedrooms: 2,
      bathrooms: 2,
      area: "1,200 sq ft",
      featured: true,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=88",
    },
    {
      title: "Contemporary Commercial Building — Ntinda",
      description: "Flexible commercial building for offices, clinics, retail, or an investment portfolio in a high-visibility location.",
      location: "Ntinda, Kampala",
      listingMode: "sale" as const,
      propertyType: "commercial" as const,
      price: 2500000000,
      bedrooms: 0,
      bathrooms: 6,
      area: "5,000 sq ft",
      featured: true,
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=88",
    },
    {
      title: "Family Home with Pool — Bwebajja",
      description: "A spacious three-bedroom home with a calm residential setting and room for a growing family.",
      location: "Bwebajja, Wakiso",
      listingMode: "rent" as const,
      propertyType: "house" as const,
      price: 2000000,
      bedrooms: 3,
      bathrooms: 3,
      area: "2,500 sq ft",
      featured: false,
      image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=88",
    },
  ];

  for (const item of seed) {
    const result = await db.insert(properties).values({
      ownerId: seedUser.id,
      title: item.title,
      description: item.description,
      location: item.location,
      listingMode: item.listingMode,
      propertyType: item.propertyType,
      price: item.price,
      bedrooms: item.bedrooms,
      bathrooms: item.bathrooms,
      area: item.area,
      featured: item.featured,
      status: "approved",
    });
    await db.insert(propertyImages).values({ propertyId: Number(result[0].insertId), url: item.image, sortOrder: 0 });
  }
}
