import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// List pages with hierarchy and filtering
export const list = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("private"))),
    parent: v.optional(v.id("pages")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let pages;
    
    if (args.status) {
      pages = await ctx.db
        .query("pages")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(args.limit || 50);
    } else if (args.parent !== undefined) {
      pages = await ctx.db
        .query("pages")
        .withIndex("by_parent", (q) => q.eq("parent", args.parent))
        .order("desc")
        .take(args.limit || 50);
    } else {
      pages = await ctx.db
        .query("pages")
        .order("desc")
        .take(args.limit || 50);
    }

    // Populate parent information
    return Promise.all(pages.map(async (page) => {
      const parentPage = page.parent ? await ctx.db.get(page.parent) : null;
      
      // Get child pages count
      const childCount = await ctx.db
        .query("pages")
        .withIndex("by_parent", (q) => q.eq("parent", page._id))
        .collect()
        .then(children => children.length);

      return {
        ...page,
        parent: parentPage,
        childCount,
      };
    }));
  },
});

// Get page by slug with full population
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!page) return null;

    // Populate relationships
    const [authors, parentPage, metaImage, childPages] = await Promise.all([
      page.authors ? Promise.all(page.authors.map(id => ctx.db.get(id))) : [],
      page.parent ? ctx.db.get(page.parent) : null,
      page.metaImage ? ctx.db.get(page.metaImage) : null,
      ctx.db
        .query("pages")
        .withIndex("by_parent", (q) => q.eq("parent", page._id))
        .collect(),
    ]);

    return {
      ...page,
      authors: authors.filter(Boolean),
      parent: parentPage,
      metaImage,
      childPages,
    };
  },
});

// Get page hierarchy (breadcrumbs)
export const getBreadcrumbs = query({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    const breadcrumbs = [];
    let currentPageId: string | undefined = args.pageId;

    while (currentPageId) {
      const page: any = await ctx.db.get(currentPageId as any);
      if (!page) break;

      breadcrumbs.unshift({
        id: page._id,
        title: page.title,
        slug: page.slug,
      });

      currentPageId = page.parent;
    }

    return breadcrumbs;
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
    layout: v.optional(v.array(v.any())),
    parent: v.optional(v.id("pages")),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    metaImage: v.optional(v.id("media")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const pageData = {
      ...args,
      authors: [userId],
      layout: args.layout || [],
    };

    return await ctx.db.insert("pages", pageData);
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
    metaImage: v.optional(v.id("media")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { id, ...updates } = args;
    const page = await ctx.db.get(id);
    
    if (!page) throw new Error("Page not found");

    // Prevent circular parent relationships - simplified check
    if (updates.parent && updates.parent === id) {
      throw new Error("Cannot set parent: would create circular reference");
    }

    await ctx.db.patch(id, updates);
  },
});

// Delete page
export const remove = mutation({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if page has children
    const children = await ctx.db
      .query("pages")
      .withIndex("by_parent", (q) => q.eq("parent", args.id))
      .collect();

    if (children.length > 0) {
      throw new Error("Cannot delete page with child pages");
    }

    await ctx.db.delete(args.id);
  },
});

// Duplicate page
export const duplicate = mutation({
  args: {
    id: v.id("pages"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const originalPage = await ctx.db.get(args.id);
    if (!originalPage) throw new Error("Page not found");

    const duplicatedPage = {
      title: args.title || `${originalPage.title} (Copy)`,
      slug: args.slug || `${originalPage.slug}-copy`,
      content: originalPage.content,
      status: "draft" as const,
      hero: originalPage.hero,
      layout: originalPage.layout,
      parent: originalPage.parent,
      metaTitle: originalPage.metaTitle,
      metaDescription: originalPage.metaDescription,
      metaImage: originalPage.metaImage,
      authors: [userId],
    };

    return await ctx.db.insert("pages", duplicatedPage);
  },
});

// Get page tree (for navigation)
export const getTree = query({
  args: {
    includeStatus: v.optional(v.array(v.union(v.literal("draft"), v.literal("published"), v.literal("private")))),
  },
  handler: async (ctx, args) => {
    // Get all pages
    let pagesQuery = ctx.db.query("pages");
    
    const allPages = await pagesQuery.collect();
    
    // Filter by status if specified
    const pages = args.includeStatus 
      ? allPages.filter(page => args.includeStatus!.includes(page.status))
      : allPages.filter(page => page.status === "published");

    // Build tree structure
    const pageMap = new Map(pages.map(page => [page._id, { ...page, children: [] as any[] }]));
    const rootPages: any[] = [];

    for (const page of pages) {
      const pageWithChildren = pageMap.get(page._id)!;
      
      if (page.parent && pageMap.has(page.parent)) {
        const parent = pageMap.get(page.parent)!;
        parent.children.push(pageWithChildren);
      } else {
        rootPages.push(pageWithChildren);
      }
    }

    return rootPages;
  },
});