import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// List posts with comprehensive filtering and pagination
export const list = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("private"))),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const offset = args.offset || 0;

    let postsQuery = ctx.db.query("posts");
    
    if (args.status) {
      postsQuery = postsQuery.withIndex("by_status", (q) => q.eq("status", args.status!));
    }

    const posts = await postsQuery
      .order("desc")
      .take(limit + offset + 1);

    const paginatedPosts = posts.slice(offset, offset + limit);
    const hasMore = posts.length > offset + limit;

    return {
      items: paginatedPosts,
      hasMore,
    };
  },
});

// Get post by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!post) return null;

    return post;
  },
});

// Create new post
export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("private")),
    categories: v.array(v.id("categories")),
    tags: v.array(v.id("tags")),
    designVersion: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Calculate read time if content provided
    const wordCount = args.content ? args.content.split(/\s+/).length : 0;
    const readTime = Math.ceil(wordCount / 200); // Average reading speed

    return await ctx.db.insert("posts", {
      ...args,
      authors: [userId],
      relatedPosts: [],
      publishedAt: args.status === "published" ? Date.now() : undefined,
      readTime,
      wordCount,
    });
  },
});

// Update existing post
export const update = mutation({
  args: {
    id: v.id("posts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    content: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("private"))),
    categories: v.optional(v.array(v.id("categories"))),
    tags: v.optional(v.array(v.id("tags"))),
    designVersion: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { id, ...updates } = args;
    const post = await ctx.db.get(id);
    
    if (!post) throw new Error("Post not found");

    // Update word count and reading time if content changed
    const updateData: any = { ...updates };
    if (updates.content) {
      const wordCount = updates.content.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200);
      updateData.wordCount = wordCount;
      updateData.readTime = readTime;
    }

    // Set published date if status changed to published
    if (updates.status === "published" && post.status !== "published") {
      updateData.publishedAt = Date.now();
    }

    await ctx.db.patch(id, updateData);
  },
});

// Delete post
export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const post = await ctx.db.get(args.id);
    if (!post) throw new Error("Post not found");

    await ctx.db.delete(args.id);
  },
});

// Search posts
export const search = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("posts")
      .withSearchIndex("search_posts", (q) => 
        q.search("content", args.query)
         .eq("status", "published")
      )
      .take(args.limit || 20);

    return results;
  },
});