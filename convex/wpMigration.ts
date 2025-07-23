import { internalMutation, mutation } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Bulk-import WordPress data that has already been normalised into JSON.
 * Large payloads should be sent in ≤1 MB chunks; however most hobby blogs fit.
 *
 * Args structure (all arrays, even if empty):
 * {
 *   users:      Array<{ wp_id:number, email:string, display_name:string }>
 *   categories: Array<{ wp_id:number, name:string, slug:string }>
 *   tags:       Array<{ wp_id:number, name:string, slug:string }>
 *   posts:      Array<{ wp_id:number, title:string, slug:string, content:string, status:string, author:number, categories:number[], tags:number[], publishedAt:number }>
 *   pages:      Array<{ ...same shape as posts... }>
 *   comments:   Array<{ wp_id:number, post:number, author:string, email:string, content:string, parent:number|null, createdAt:number, status:string }>
 *   media:      Array<{ wp_id:number, filename:string, mimeType:string, filesize:number, url:string }>
 * }
 */
// WordPress bulk import mutation for HTTP endpoint
export const bulkImport = internalMutation({
  args: {
    data: v.object({
      users: v.array(v.any()),
      categories: v.array(v.any()),
      tags: v.array(v.any()),
      posts: v.array(v.any()),
      pages: v.array(v.any()),
      comments: v.array(v.any()),
      media: v.array(v.any()),
    }),
  },
  handler: async (ctx, { data }) => {
    // Same bulk import logic as above but as internal mutation
    const userMap = new Map<number, Id<"users">>();
    const categoryMap = new Map<number, Id<"categories">>();
    const tagMap = new Map<number, Id<"tags">>();
    const postMap = new Map<number, Id<"posts">>();
    const pageMap = new Map<number, Id<"pages">>();
    const mediaMap = new Map<number, Id<"media">>();

    // Insert Users
    for (const u of data.users) {
      const userId = await ctx.db.insert("users", {
        name: u.display_name || u.email.split("@")[0],
        email: u.email,
      });
      userMap.set(u.wp_id, userId);
    }

    // Insert Categories
    for (const c of data.categories) {
      const catId = await ctx.db.insert("categories", {
        name: c.name,
        slug: c.slug,
      });
      categoryMap.set(c.wp_id, catId);
    }

    // Insert Tags
    for (const t of data.tags) {
      const tagId = await ctx.db.insert("tags", {
        name: t.name,
        slug: t.slug,
      });
      tagMap.set(t.wp_id, tagId);
    }

    // Insert Media
    for (const m of data.media) {
      const mediaId = await ctx.db.insert("media", {
        filename: m.filename,
        mimeType: m.mimeType,
        filesize: m.filesize,
        url: m.url,
      });
      mediaMap.set(m.wp_id, mediaId);
    }

    // Helper functions
    const mapCategories = (ids: number[]): Array<Id<"categories">> =>
      ids.map((legacy) => categoryMap.get(legacy)).filter(Boolean) as Array<Id<"categories">>;
    
    const mapUsers = (ids: number[]): Array<Id<"users">> =>
      ids.map((legacy) => userMap.get(legacy)).filter(Boolean) as Array<Id<"users">>;

    // Insert Posts
    for (const p of data.posts) {
      const postId = await ctx.db.insert("posts", {
        title: p.title,
        slug: p.slug,
        content: p.content,
        status: p.status === "publish" ? "published" : (p.status as any),
        authors: p.author ? mapUsers([p.author]) : undefined,
        categories: mapCategories(p.categories || []),
        tags: p.tags || [],
        publishedAt: p.publishedAt,
        wp_post_id: p.wp_id,
      });
      postMap.set(p.wp_id, postId);
    }

    // Insert Pages
    for (const pg of data.pages) {
      const pageId = await ctx.db.insert("pages", {
        title: pg.title,
        slug: pg.slug,
        content: pg.content,
        status: pg.status === "publish" ? "published" : (pg.status as any),
        authors: pg.author ? mapUsers([pg.author]) : [],
        layout: [],
      });
      pageMap.set(pg.wp_id, pageId);
    }

    // Insert Comments
    const commentMap = new Map<number, Id<"comments">>();
    for (const cm of data.comments) {
      const convexPostId = postMap.get(cm.post) || pageMap.get(cm.post);
      if (!convexPostId) continue;
      const commentId = await ctx.db.insert("comments", {
        post: convexPostId as Id<"posts">,
        parent: cm.parent ? commentMap.get(cm.parent) : undefined,
        author: cm.author,
        email: cm.email,
        content: cm.content,
        status: cm.status === "approved" ? "approved" : "pending",
        createdAt: cm.createdAt,
      });
      commentMap.set(cm.wp_id, commentId);
    }

    return {
      summary: {
        users: userMap.size,
        categories: categoryMap.size,
        tags: tagMap.size,
        posts: postMap.size,
        pages: pageMap.size,
        comments: data.comments.length,
        media: mediaMap.size,
      },
    };
  },
});

