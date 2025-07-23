"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
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
  handler: async (ctx, { xml }): Promise<any> => {
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