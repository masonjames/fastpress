import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// List posts with filtering
export const list = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("private"))),
    categoryId: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    let posts;

    // Filter by status if provided
    if (args.status) {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(args.limit || 20);
    } else {
      posts = await ctx.db
        .query("posts")
        .order("desc")
        .take(args.limit || 20);
    }

    // Filter by category if provided (since we're using legacy field)
    if (args.categoryId) {
      return posts.filter(post => 
        post.categoryId === args.categoryId || 
        (post.categories && post.categories.includes(args.categoryId!))
      );
    }

    return posts;
  },
});

// Get post by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

// Search posts
export const search = query({
  args: {
    query: v.string(),
    categoryId: v.optional(v.id("categories")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Simple text search in title and content
    const allPosts = await ctx.db
      .query("posts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .take(args.limit || 50);

    // Filter by search query (case insensitive)
    const searchLower = args.query.toLowerCase();
    let filteredPosts = allPosts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      (post.content && post.content.toLowerCase().includes(searchLower)) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchLower))
    );

    // Filter by category if provided
    if (args.categoryId) {
      filteredPosts = filteredPosts.filter(post => 
        post.categoryId === args.categoryId || 
        (post.categories && post.categories.includes(args.categoryId!))
      );
    }

    return filteredPosts.slice(0, args.limit || 20);
  },
});

// Create new post
export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("private")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("posts", {
      ...args,
      authors: [userId],
      categories: [],
      tags: [],
      relatedPosts: [],
      publishedAt: args.status === "published" ? Date.now() : undefined,
    });
  },
});