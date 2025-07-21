import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    parentId: v.optional(v.id("categories")),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("categories", args);
  },
});

export const getPostsByCategory = query({
  args: { 
    categoryId: v.id("categories"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .filter((q) => q.eq(q.field("status"), "published"))
      .order("desc")
      .take(args.limit || 10);

    return Promise.all(posts.map(async (post) => {
      const author = await ctx.db.get(post.authorId);
      const featuredImageUrl = post.featuredImage 
        ? await ctx.storage.getUrl(post.featuredImage) 
        : null;

      return {
        ...post,
        author: author ? { name: author.name, email: author.email } : null,
        featuredImageUrl,
      };
    }));
  },
});
