import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import {
  createInquiry,
  createProperty,
  getAdminInquiries,
  getApprovedProperty,
  getMarketplaceStats,
  getSavedProperties,
  getSavedPropertyIds,
  getUserInquiries,
  getUserProperties,
  listApprovedProperties,
  listPendingProperties,
  moderateProperty,
  toggleSavedProperty,
  updateUserAccountType,
} from "./db";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";

const listingMode = z.enum(["sale", "rent"]);
const propertyType = z.enum(["house", "apartment", "land", "commercial"]);
const accountType = z.enum(["buyer", "owner", "agent"]);

const filtersSchema = z.object({
  location: z.string().trim().max(180).optional(),
  listingMode: listingMode.optional(),
  propertyType: propertyType.optional(),
  minPrice: z.number().int().min(0).optional(),
  maxPrice: z.number().int().min(0).optional(),
  minBedrooms: z.number().int().min(0).max(30).optional(),
  sort: z.enum(["recommended", "newest", "price-low", "price-high"]).optional(),
}).optional();

const propertyIdInput = z.object({ id: z.number().int().positive() });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie("webdev_app_session", { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  profile: router({
    updateAccountType: protectedProcedure
      .input(z.object({ accountType }))
      .mutation(async ({ ctx, input }) => updateUserAccountType(ctx.user.id, input.accountType)),
  }),

  listings: router({
    list: publicProcedure.input(filtersSchema).query(async ({ ctx, input }) => {
      const properties = await listApprovedProperties(input ?? {});
      const savedIds = ctx.user ? await getSavedPropertyIds(ctx.user.id) : [];
      return { properties, savedIds };
    }),
    byId: publicProcedure.input(propertyIdInput).query(async ({ ctx, input }) => {
      const property = await getApprovedProperty(input.id);
      if (!property) throw new TRPCError({ code: "NOT_FOUND", message: "Property not found" });
      const savedIds = ctx.user ? await getSavedPropertyIds(ctx.user.id) : [];
      return { property, saved: savedIds.includes(input.id) };
    }),
    mine: protectedProcedure.query(({ ctx }) => getUserProperties(ctx.user.id)),
    create: protectedProcedure
      .input(z.object({
        title: z.string().trim().min(5).max(180),
        description: z.string().trim().min(30).max(5000),
        location: z.string().trim().min(2).max(180),
        listingMode,
        propertyType,
        price: z.number().int().positive().max(100000000000),
        bedrooms: z.number().int().min(0).max(50),
        bathrooms: z.number().int().min(0).max(50),
        area: z.string().trim().min(2).max(80),
        imageUrls: z.array(z.string().url().max(1000)).min(1).max(8),
      }))
      .mutation(({ ctx, input }) => createProperty({ ownerId: ctx.user.id, ...input })),
    reviewQueue: adminProcedure.query(() => listPendingProperties()),
    moderate: adminProcedure
      .input(z.object({
        id: z.number().int().positive(),
        status: z.enum(["approved", "rejected"]),
        moderationNote: z.string().trim().max(1000).optional(),
      }))
      .mutation(({ ctx, input }) => {
        if (input.status === "rejected" && !input.moderationNote) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "A moderation note is required when rejecting a listing." });
        }
        return moderateProperty(input.id, ctx.user.id, input.status, input.moderationNote);
      }),
    stats: adminProcedure.query(() => getMarketplaceStats()),
  }),

  favorites: router({
    list: protectedProcedure.query(({ ctx }) => getSavedProperties(ctx.user.id)),
    toggle: protectedProcedure
      .input(propertyIdInput)
      .mutation(({ ctx, input }) => toggleSavedProperty(ctx.user.id, input.id)),
  }),

  inquiries: router({
    create: publicProcedure
      .input(z.object({
        propertyId: z.number().int().positive(),
        name: z.string().trim().min(2).max(160),
        email: z.string().email().max(320),
        phone: z.string().trim().max(50).optional(),
        message: z.string().trim().min(10).max(3000),
      }))
      .mutation(({ ctx, input }) => createInquiry({ ...input, userId: ctx.user?.id })),
    mine: protectedProcedure.query(({ ctx }) => getUserInquiries(ctx.user.id)),
    all: adminProcedure.query(() => getAdminInquiries()),
  }),
});

export type AppRouter = typeof appRouter;
