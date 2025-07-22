import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// List posts with filtering
export const list = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("private"))),
    categoryId: v.optional(v.id("categories")),
    tag: v.optional(v.string()),
    sortBy: v.optional(v.union(v.literal("date"), v.literal("title"))),
    dateFrom: v.optional(v.number()),
    dateTo: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let posts;

    // Filter by status if provided
    if (args.status) {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(args.limit || 50);
    } else {
      posts = await ctx.db
        .query("posts")
        .order("desc")
        .take(args.limit || 50);
    }

    // Apply client-side filters
    let filteredPosts = posts;

    // Filter by category
    if (args.categoryId) {
      filteredPosts = filteredPosts.filter(post => 
        post.categoryId === args.categoryId || 
        (post.categories && post.categories.includes(args.categoryId!))
      );
    }

    // Filter by tag
    if (args.tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags && post.tags.some(tag => 
          typeof tag === 'string' && tag.toLowerCase().includes(args.tag!.toLowerCase())
        )
      );
    }

    // Filter by date range
    if (args.dateFrom || args.dateTo) {
      filteredPosts = filteredPosts.filter(post => {
        const postDate = post.publishedAt || post._creationTime;
        if (args.dateFrom && postDate < args.dateFrom) return false;
        if (args.dateTo && postDate > args.dateTo) return false;
        return true;
      });
    }

    // Apply sorting
    if (args.sortBy === "title") {
      filteredPosts = filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default to date sorting (newest first)
      filteredPosts = filteredPosts.sort((a, b) => 
        (b.publishedAt || b._creationTime) - (a.publishedAt || a._creationTime)
      );
    }

    return filteredPosts.slice(0, args.limit || 20);
  },
});

// Get all unique tags from published posts
export const getAllTags = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    
    const tagSet = new Set<string>();
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => {
          if (typeof tag === 'string') {
            tagSet.add(tag);
          }
        });
      }
    });
    
    return Array.from(tagSet).sort();
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

// Search posts using full-text search
export const search = query({
  args: {
    query: v.string(),
    categoryId: v.optional(v.id("categories")),
    limit: v.optional(v.number()),
    sortBy: v.optional(v.union(v.literal("relevance"), v.literal("date"), v.literal("title"))),
  },
  handler: async (ctx, args) => {
    // Use full-text search index for better performance and relevance
    let searchResults = await ctx.db
      .query("posts")
      .withSearchIndex("search_posts", (q) => 
        q.search("content", args.query).eq("status", "published")
      )
      .take(args.limit || 50);

    // Filter by category if provided
    if (args.categoryId) {
      searchResults = searchResults.filter(post => 
        post.categoryId === args.categoryId || 
        (post.categories && post.categories.includes(args.categoryId!))
      );
    }

    // Apply sorting
    if (args.sortBy === "date") {
      searchResults = searchResults.sort((a, b) => 
        (b.publishedAt || b._creationTime) - (a.publishedAt || a._creationTime)
      );
    } else if (args.sortBy === "title") {
      searchResults = searchResults.sort((a, b) => 
        a.title.localeCompare(b.title)
      );
    }
    // Default is "relevance" which is already provided by search index

    return searchResults.slice(0, args.limit || 20);
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
    featuredImageId: v.optional(v.id("media")),
    commentsEnabled: v.optional(v.boolean()),
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
      bannerImage: args.featuredImageId,
      commentsEnabled: args.commentsEnabled,
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
    featuredImageId: v.optional(v.id("media")),
    commentsEnabled: v.optional(v.boolean()),
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
      bannerImage: args.featuredImageId,
      commentsEnabled: args.commentsEnabled,
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