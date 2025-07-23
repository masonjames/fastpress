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

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { parseStringPromise } from "xml2js";

/**
 * Import a raw WordPress XML export.
 *
 * This action:
 * 1. Parses the XML into JSON.
 * 2. Normalises it to the structure expected by bulkImport.
 * 3. Delegates the heavy DB work to internal.wpMigration.bulkImport.
 *
 * NOTE: actions can't touch ctx.db directly.
 */
export const xmlImport = internalAction({
  args: {
    xml: v.string(),
  },
  returns: v.any(),
  "use node": {},
  handler: async (ctx, { xml }) => {
    // Parse XML -> JS
    const parsed: any = await parseStringPromise(xml);
    if (!parsed?.rss?.channel?.[0]) {
      throw new Error("Invalid WordPress export format");
    }

    const channel = parsed.rss.channel[0];
    const items = channel.item || [];
    const categories = channel["wp:category"] || [];
    const tags = channel["wp:tag"] || [];
    const authors = channel["wp:author"] || [];

    const data: any = {
      users: authors.map((a: any, i: number) => ({
        wp_id: parseInt(a["wp:author_id"]?.[0] || (i + 1)),
        email: a["wp:author_email"]?.[0] || `user${i + 1}@example.com`,
        display_name:
          a["wp:author_display_name"]?.[0] ||
          a["wp:author_login"]?.[0] ||
          `User ${i + 1}`,
        login: a["wp:author_login"]?.[0] || `user${i + 1}`,
      })),
      categories: categories.map((c: any) => ({
        wp_id: parseInt(c["wp:term_id"]?.[0] || "0"),
        name: c["wp:cat_name"]?.[0] || "Uncategorized",
        slug: c["wp:category_nicename"]?.[0] || "uncategorized",
        parent: parseInt(c["wp:category_parent"]?.[0] || "0"),
      })),
      tags: tags.map((t: any) => ({
        wp_id: parseInt(t["wp:term_id"]?.[0] || "0"),
        name: t["wp:tag_name"]?.[0] || "Untagged",
        slug: t["wp:tag_slug"]?.[0] || "untagged",
      })),
      posts: [] as any[],
      pages: [] as any[],
      comments: [] as any[],
      media: [] as any[],
    };

    // Walk through all items
    items.forEach((item: any) => {
      const postType = item["wp:post_type"]?.[0];
      const postId = parseInt(item["wp:post_id"]?.[0] || "0");
      const authorId = parseInt(item["dc:creator"]?.[0] || "1");

      const baseItem = {
        wp_id: postId,
        title: item.title?.[0] || "Untitled",
        slug: item["wp:post_name"]?.[0] || `post-${postId}`,
        content: item["content:encoded"]?.[0] || "",
        excerpt: item["excerpt:encoded"]?.[0] || "",
        status: item["wp:status"]?.[0] || "publish",
        author: authorId,
        publishedAt: item["wp:post_date"]?.[0]
          ? new Date(item["wp:post_date"][0]).getTime()
          : Date.now(),
        categories: (item.category || [])
          .filter((c: any) => c.$?.domain === "category")
          .map((c: any) => c.$.nicename),
        tags: (item.category || [])
          .filter((c: any) => c.$?.domain === "post_tag")
          .map((c: any) => c.$.nicename),
      };

      if (postType === "post") data.posts.push(baseItem);
      else if (postType === "page") data.pages.push(baseItem);
      else if (postType === "attachment") {
        data.media.push({
          wp_id: postId,
          filename: item["wp:post_name"]?.[0] || `attachment-${postId}`,
          mimeType: item["wp:post_mime_type"]?.[0] || "application/octet-stream",
          url: item["wp:attachment_url"]?.[0] || "",
          filesize: 0,
        });
      }

      (item["wp:comment"] || []).forEach((c: any) => {
        data.comments.push({
          wp_id: parseInt(c["wp:comment_id"]?.[0] || "0"),
          post: postId,
          author: c["wp:comment_author"]?.[0] || "Anonymous",
          email: c["wp:comment_author_email"]?.[0] || "",
          content: c["wp:comment_content"]?.[0] || "",
          parent: parseInt(c["wp:comment_parent"]?.[0] || "0") || null,
          createdAt: c["wp:comment_date"]?.[0]
            ? new Date(c["wp:comment_date"][0]).getTime()
            : Date.now(),
          status: c["wp:comment_approved"]?.[0] === "1" ? "approved" : "pending",
        });
      });
    });

    // Delegate to mutation
    const summary = await ctx.runMutation(
      internal.wpMigration.bulkImport,
      { data }
    );
    return summary;
  },
});