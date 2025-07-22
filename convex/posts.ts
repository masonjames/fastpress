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

// Get post by ID for editing
export const getById = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create new post
export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("private")),
    tags: v.optional(v.array(v.string())),
    categories: v.optional(v.array(v.id("categories"))),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    focusKeyword: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("posts", {
      title: args.title,
      slug: args.slug,
      content: args.content,
      excerpt: args.excerpt,
      status: args.status,
      authors: [userId],
      categories: args.categories || [],
      tags: args.tags || [],
      relatedPosts: [],
      metaTitle: args.metaTitle,
      metaDescription: args.metaDescription,
      focusKeyword: args.focusKeyword,
      publishedAt: args.status === "published" ? Date.now() : undefined,
    });
  },
});

// Update existing post
export const update = mutation({
  args: {
    id: v.id("posts"),
    title: v.string(),
    slug: v.string(),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("private")),
    tags: v.optional(v.array(v.string())),
    categories: v.optional(v.array(v.id("categories"))),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    focusKeyword: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Post not found");

    // Check if user is author or has permission to edit
    if (!existing.authors?.includes(userId)) {
      throw new Error("Not authorized to edit this post");
    }

    const updates: any = {
      title: args.title,
      slug: args.slug,
      content: args.content,
      excerpt: args.excerpt,
      status: args.status,
      tags: args.tags || [],
      categories: args.categories || [],
      metaTitle: args.metaTitle,
      metaDescription: args.metaDescription,
      focusKeyword: args.focusKeyword,
    };

    // Update publishedAt if status changes to published
    if (args.status === "published" && existing.status !== "published") {
      updates.publishedAt = Date.now();
    }

    return await ctx.db.patch(args.id, updates);
  },
});

// Delete post
export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Post not found");

    // Check if user is author or has permission to delete
    if (!existing.authors?.includes(userId)) {
      throw new Error("Not authorized to delete this post");
    }

    return await ctx.db.delete(args.id);
  },
});