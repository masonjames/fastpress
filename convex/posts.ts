import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("private"))),
    categoryId: v.optional(v.id("categories")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let posts;
    
    if (args.status) {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(args.limit || 10);
    } else if (args.categoryId) {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
        .order("desc")
        .take(args.limit || 10);
    } else {
      posts = await ctx.db
        .query("posts")
        .order("desc")
        .take(args.limit || 10);
    }

    return Promise.all(posts.map(async (post) => {
      const author = await ctx.db.get(post.authorId);
      const category = post.categoryId ? await ctx.db.get(post.categoryId) : null;
      const featuredImageUrl = post.featuredImage 
        ? await ctx.storage.getUrl(post.featuredImage) 
        : null;

      return {
        ...post,
        author: author ? { name: author.name, email: author.email } : null,
        category: category ? { name: category.name, slug: category.slug } : null,
        featuredImageUrl,
      };
    }));
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!post) return null;

    const author = await ctx.db.get(post.authorId);
    const category = post.categoryId ? await ctx.db.get(post.categoryId) : null;
    const featuredImageUrl = post.featuredImage 
      ? await ctx.storage.getUrl(post.featuredImage) 
      : null;

    return {
      ...post,
      author: author ? { name: author.name, email: author.email } : null,
      category: category ? { name: category.name, slug: category.slug } : null,
      featuredImageUrl,
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("private")),
    categoryId: v.optional(v.id("categories")),
    tags: v.array(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    focusKeyword: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const wordCount = args.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed

    return await ctx.db.insert("posts", {
      ...args,
      authorId: userId,
      publishedAt: args.status === "published" ? Date.now() : undefined,
      wordCount,
      readingTime,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("posts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("private"))),
    categoryId: v.optional(v.id("categories")),
    tags: v.optional(v.array(v.string())),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    focusKeyword: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { id, ...updates } = args;
    const post = await ctx.db.get(id);
    
    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId) throw new Error("Not authorized");

    // Update word count and reading time if content changed
    const updateData: any = { ...updates };
    if (updates.content) {
      const wordCount = updates.content.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);
      updateData.wordCount = wordCount;
      updateData.readingTime = readingTime;
    }

    // Set published date if status changed to published
    if (updates.status === "published" && post.status !== "published") {
      updateData.publishedAt = Date.now();
    }

    await ctx.db.patch(id, updateData);
  },
});

export const search = query({
  args: {
    query: v.string(),
    categoryId: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("posts")
      .withSearchIndex("search_posts", (q) => {
        let search = q.search("content", args.query);
        if (args.categoryId) {
          search = search.eq("categoryId", args.categoryId);
        }
        return search.eq("status", "published");
      })
      .take(20);

    return Promise.all(results.map(async (post) => {
      const author = await ctx.db.get(post.authorId);
      const category = post.categoryId ? await ctx.db.get(post.categoryId) : null;
      
      return {
        ...post,
        author: author ? { name: author.name, email: author.email } : null,
        category: category ? { name: category.name, slug: category.slug } : null,
      };
    }));
  },
});
