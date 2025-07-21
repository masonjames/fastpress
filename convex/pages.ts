import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// List pages with hierarchy support
export const list = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("private"))),
    parent: v.optional(v.id("pages")),
  },
  handler: async (ctx, args) => {
    let pagesQuery = ctx.db.query("pages");
    
    if (args.status) {
      pagesQuery = pagesQuery.withIndex("by_status", (q) => q.eq("status", args.status!));
    } else if (args.parent !== undefined) {
      pagesQuery = pagesQuery.withIndex("by_parent", (q) => q.eq("parent", args.parent));
    }

    const pages = await pagesQuery.order("desc").take(50);

    return Promise.all(pages.map(async (page) => {
      const authors = await Promise.all(page.authors.map(id => ctx.db.get(id)));
      const parentPage = page.parent ? await ctx.db.get(page.parent) : null;

      return {
        ...page,
        authors: authors.filter(Boolean),
        parent: parentPage,
      };
    }));
  },
});

// Get page by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!page) return null;

    const [authors, parentPage, metaImage] = await Promise.all([
      Promise.all(page.authors.map(id => ctx.db.get(id))),
      page.parent ? ctx.db.get(page.parent) : null,
      page.metaImage ? ctx.db.get(page.metaImage) : null,
    ]);

    return {
      ...page,
      authors: authors.filter(Boolean),
      parent: parentPage,
      metaImage,
    };
  },
});

// Create new page
export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("private")),
    hero: v.optional(v.any()),
    layout: v.array(v.any()),
    parent: v.optional(v.id("pages")),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("pages", {
      ...args,
      authors: [userId],
    });
  },
});

// Update page
export const update = mutation({
  args: {
    id: v.id("pages"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    content: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("private"))),
    hero: v.optional(v.any()),
    layout: v.optional(v.array(v.any())),
    parent: v.optional(v.id("pages")),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { id, ...updates } = args;
    const page = await ctx.db.get(id);
    
    if (!page) throw new Error("Page not found");

    await ctx.db.patch(id, updates);
  },
});

// Delete page
export const remove = mutation({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const page = await ctx.db.get(args.id);
    if (!page) throw new Error("Page not found");

    await ctx.db.delete(args.id);
  },
});