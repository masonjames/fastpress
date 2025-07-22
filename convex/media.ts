import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

// List media files with pagination and filtering
export const list = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    mimeType: v.optional(v.string()), // Filter by type (image/, video/, etc.)
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const offset = args.offset || 0;

    let mediaQuery = ctx.db.query("media");
    
    if (args.mimeType) {
      mediaQuery = mediaQuery.filter((q) => q.eq(q.field("mimeType"), args.mimeType));
    }

    const media = await mediaQuery
      .order("desc")
      .take(limit + offset + 1);

    const paginatedMedia = media.slice(offset, offset + limit);
    const hasMore = media.length > offset + limit;

    // Generate URLs for files
    const mediaWithUrls = await Promise.all(
      paginatedMedia.map(async (file) => {
        let url = file.url;
        
        // Generate URL from storage if stored in Convex
        if (file.storageId && !url) {
          try {
            url = await ctx.storage.getUrl(file.storageId) || undefined;
          } catch (error) {
            console.error("Failed to get storage URL:", error);
          }
        }

        return {
          ...file,
          url,
        };
      })
    );

    return {
      items: mediaWithUrls,
      hasMore,
    };
  },
});

// Get media by ID with URL
export const getById = query({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.id);
    if (!file) return null;

    let url = file.url;
    
    // Generate URL from storage if needed
    if (file.storageId && !url) {
      try {
        url = await ctx.storage.getUrl(file.storageId) || undefined;
      } catch (error) {
        console.error("Failed to get storage URL:", error);
      }
    }

    return {
      ...file,
      url,
    };
  },
});

// Get media by filename
export const getByFilename = query({
  args: { filename: v.string() },
  handler: async (ctx, args) => {
    const file = await ctx.db
      .query("media")
      .withIndex("by_filename", (q) => q.eq("filename", args.filename))
      .unique();

    if (!file) return null;

    let url = file.url;
    
    if (file.storageId && !url) {
      try {
        url = await ctx.storage.getUrl(file.storageId) || undefined;
      } catch (error) {
        console.error("Failed to get storage URL:", error);
      }
    }

    return {
      ...file,
      url,
    };
  },
});

// Create media record (after file upload)
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
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("media", args);
  },
});

// Update media metadata
export const update = mutation({
  args: {
    id: v.id("media"),
    alt: v.optional(v.string()),
    focalX: v.optional(v.number()),
    focalY: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Delete media file
export const remove = mutation({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const file = await ctx.db.get(args.id);
    if (!file) throw new Error("Media not found");

    // Delete from Convex storage if stored there
    if (file.storageId) {
      try {
        await ctx.storage.delete(file.storageId);
      } catch (error) {
        console.error("Failed to delete from storage:", error);
      }
    }

    await ctx.db.delete(args.id);
  },
});

// Generate upload URL for file upload
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.storage.generateUploadUrl();
  },
});

// Process uploaded file and create media record
export const processUpload = action({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    filesize: v.number(),
    alt: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<string> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Extract image dimensions if it's an image
    let width, height;
    if (args.mimeType.startsWith("image/")) {
      // In a real implementation, you'd extract dimensions from the file
      // For now, we'll leave them undefined
      width = undefined;
      height = undefined;
    }

    // Create media record
    const mediaId: any = await ctx.runMutation(api.media.create, {
      filename: args.filename,
      mimeType: args.mimeType,
      filesize: args.filesize,
      width,
      height,
      alt: args.alt,
      storageId: args.storageId,
    });

    return mediaId;
  },
});

// Get media usage (which posts/pages use this media)
export const getUsage = query({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    // Find posts using this media as banner image
    const postsWithBanner = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("bannerImage"), args.id))
      .collect();

    // Find posts using this media as meta image
    const postsWithMeta = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("metaImage"), args.id))
      .collect();

    // Find pages using this media as meta image
    const pagesWithMeta = await ctx.db
      .query("pages")
      .filter((q) => q.eq(q.field("metaImage"), args.id))
      .collect();

    return {
      posts: {
        banner: postsWithBanner,
        meta: postsWithMeta,
      },
      pages: {
        meta: pagesWithMeta,
      },
      totalUsage: postsWithBanner.length + postsWithMeta.length + pagesWithMeta.length,
    };
  },
});

// Get media stats
export const getStats = query({
  handler: async (ctx) => {
    const allMedia = await ctx.db.query("media").collect();
    
    const totalSize = allMedia.reduce((sum, file) => sum + file.filesize, 0);
    const imageCount = allMedia.filter(file => file.mimeType.startsWith("image/")).length;
    const videoCount = allMedia.filter(file => file.mimeType.startsWith("video/")).length;
    const documentCount = allMedia.filter(file => 
      !file.mimeType.startsWith("image/") && !file.mimeType.startsWith("video/")
    ).length;

    return {
      total: allMedia.length,
      totalSize,
      images: imageCount,
      videos: videoCount,
      documents: documentCount,
    };
  },
});