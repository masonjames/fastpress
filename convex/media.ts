import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List media files
export const list = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const offset = args.offset || 0;

    const media = await ctx.db
      .query("media")
      .order("desc")
      .take(limit + offset + 1);

    const paginatedMedia = media.slice(offset, offset + limit);
    const hasMore = media.length > offset + limit;

    return {
      items: paginatedMedia,
      hasMore,
    };
  },
});

// Get media by ID
export const getById = query({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create media record
export const create = mutation({
  args: {
    filename: v.string(),
    mimeType: v.string(),
    filesize: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    alt: v.optional(v.string()),
    url: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("media", args);
  },
});

// Update media
export const update = mutation({
  args: {
    id: v.id("media"),
    alt: v.optional(v.string()),
    focalX: v.optional(v.number()),
    focalY: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Delete media
export const remove = mutation({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    const media = await ctx.db.get(args.id);
    if (!media) throw new Error("Media not found");

    // Delete the file from storage if it exists
    if (media.storageId) {
      await ctx.storage.delete(media.storageId);
    }

    await ctx.db.delete(args.id);
  },
});