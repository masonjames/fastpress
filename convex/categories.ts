import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// List categories with hierarchy support
export const list = query({
  args: {
    parent: v.optional(v.id("categories")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let categoriesQuery = ctx.db.query("categories");
    
    if (args.parent !== undefined) {
      categoriesQuery = ctx.db.query("categories").withIndex("by_parent", (q) => q.eq("parent", args.parent));
    }

    const categories = await categoriesQuery
      .order("asc")
      .take(args.limit || 50);

    return categories;
  },
});

// Get category by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const category = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!category) return null;

    // Get parent category if exists
    const parentCategory = category.parent ? await ctx.db.get(category.parent) : null;
    
    // Get child categories
    const childCategories = await ctx.db
      .query("categories")
      .withIndex("by_parent", (q) => q.eq("parent", category._id))
      .collect();

    // Get posts in this category
    const posts = await ctx.db
      .query("posts")
      .filter((q) => 
        q.eq(q.field("categoryId"), category._id)
      )
      .take(10);

    return {
      ...category,
      parent: parentCategory,
      children: childCategories,
      posts,
    };
  },
});

// Get posts by category
export const getPosts = query({
  args: {
    categoryId: v.id("categories"),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const offset = args.offset || 0;

    // Query both legacy and new category fields
    const posts = await ctx.db
      .query("posts")
      .filter((q) => 
        q.eq(q.field("categoryId"), args.categoryId)
      )
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

// Create new category
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    parent: v.optional(v.id("categories")),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("categories", args);
  },
});

// Update category
export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    parent: v.optional(v.id("categories")),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Delete category
export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if category has children
    const children = await ctx.db
      .query("categories")
      .withIndex("by_parent", (q) => q.eq("parent", args.id))
      .collect();

    if (children.length > 0) {
      throw new Error("Cannot delete category with child categories");
    }

    await ctx.db.delete(args.id);
  },
});