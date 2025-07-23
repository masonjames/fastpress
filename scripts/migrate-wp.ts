#!/usr/bin/env ts-node
"use node";

import fs from "fs/promises";
import path from "path";
import { parseStringPromise } from "xml2js";
import fetch from "node-fetch";
import { program } from "commander";

interface WordPressExport {
  rss: {
    channel: Array<{
      item?: Array<any>;
      "wp:category"?: Array<any>;
      "wp:tag"?: Array<any>;
      "wp:author"?: Array<any>;
    }>;
  };
}

/**
 * Parse WordPress XML export file and convert to FastPress-compatible JSON
 */
async function parseWordPressXML(filePath: string) {
  console.log(`📖 Reading WordPress XML export: ${filePath}`);
  const xmlContent = await fs.readFile(filePath, "utf8");
  
  console.log("🔄 Parsing XML...");
  const parsed: WordPressExport = await parseStringPromise(xmlContent);
  
  if (!parsed.rss?.channel?.[0]) {
    throw new Error("Invalid WordPress export format");
  }
  
  const channel = parsed.rss.channel[0];
  const items = channel.item || [];
  const categories = channel["wp:category"] || [];
  const tags = channel["wp:tag"] || [];
  const authors = channel["wp:author"] || [];
  
  console.log(`📊 Found: ${items.length} items, ${categories.length} categories, ${tags.length} tags, ${authors.length} authors`);
  
  const data = {
    users: authors.map((author: any, index: number) => ({
      wp_id: parseInt(author["wp:author_id"]?.[0] || index + 1),
      email: author["wp:author_email"]?.[0] || `user${index + 1}@example.com`,
      display_name: author["wp:author_display_name"]?.[0] || author["wp:author_login"]?.[0] || `User ${index + 1}`,
      login: author["wp:author_login"]?.[0] || `user${index + 1}`,
    })),
    
    categories: categories.map((cat: any) => ({
      wp_id: parseInt(cat["wp:term_id"]?.[0] || "0"),
      name: cat["wp:cat_name"]?.[0] || "Uncategorized",
      slug: cat["wp:category_nicename"]?.[0] || "uncategorized",
      parent: parseInt(cat["wp:category_parent"]?.[0] || "0"),
    })),
    
    tags: tags.map((tag: any) => ({
      wp_id: parseInt(tag["wp:term_id"]?.[0] || "0"),
      name: tag["wp:tag_name"]?.[0] || "Untagged",
      slug: tag["wp:tag_slug"]?.[0] || "untagged",
    })),
    
    posts: [] as any[],
    pages: [] as any[],
    comments: [] as any[],
    media: [] as any[],
  };
  
  // Process items (posts, pages, attachments)
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
      publishedAt: item["wp:post_date"]?.[0] ? new Date(item["wp:post_date"][0]).getTime() : Date.now(),
      categories: (item.category || [])
        .filter((cat: any) => cat.$?.domain === "category")
        .map((cat: any) => cat.$.nicename),
      tags: (item.category || [])
        .filter((cat: any) => cat.$?.domain === "post_tag")
        .map((cat: any) => cat.$.nicename),
    };
    
    if (postType === "post") {
      data.posts.push(baseItem);
    } else if (postType === "page") {
      data.pages.push(baseItem);
    } else if (postType === "attachment") {
      data.media.push({
        wp_id: postId,
        filename: item["wp:post_name"]?.[0] || `attachment-${postId}`,
        mimeType: item["wp:post_mime_type"]?.[0] || "application/octet-stream",
        url: item["wp:attachment_url"]?.[0] || "",
        filesize: 0, // Not available in XML export
      });
    }
    
    // Extract comments
    const comments = item["wp:comment"] || [];
    comments.forEach((comment: any) => {
      data.comments.push({
        wp_id: parseInt(comment["wp:comment_id"]?.[0] || "0"),
        post: postId,
        author: comment["wp:comment_author"]?.[0] || "Anonymous",
        email: comment["wp:comment_author_email"]?.[0] || "",
        content: comment["wp:comment_content"]?.[0] || "",
        parent: parseInt(comment["wp:comment_parent"]?.[0] || "0") || null,
        createdAt: comment["wp:comment_date"]?.[0] ? new Date(comment["wp:comment_date"][0]).getTime() : Date.now(),
        status: comment["wp:comment_approved"]?.[0] === "1" ? "approved" : "pending",
      });
    });
  });
  
  console.log(`✅ Parsed: ${data.posts.length} posts, ${data.pages.length} pages, ${data.comments.length} comments, ${data.media.length} media`);
  return data;
}

async function uploadToFastPress(data: any, endpoint: string) {
  console.log("⬆️  Uploading to FastPress...");
  
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed (${response.status}): ${errorText}`);
  }
  
  return await response.json();
}

async function main() {
  program
    .name("migrate-wp")
    .description("WordPress XML Export → FastPress migration tool")
    .argument("<xml-file>", "Path to WordPress XML export file")
    .option("--endpoint <url>", "FastPress migration endpoint", "http://localhost:3001/migrate/wp")
    .option("--dry-run", "Parse XML but don't upload to FastPress")
    .option("--output <file>", "Save parsed JSON to file")
    .action(async (xmlFile, options) => {
      try {
        const data = await parseWordPressXML(xmlFile);
        
        if (options.output) {
          await fs.writeFile(options.output, JSON.stringify(data, null, 2));
          console.log(`💾 Saved parsed data to ${options.output}`);
        }
        
        if (!options.dryRun) {
          const result = await uploadToFastPress(data, options.endpoint);
          console.log("✅ Import completed!");
          console.table(result.summary);
        } else {
          console.log("🔍 Dry run completed - no data uploaded");
          console.table({
            users: data.users.length,
            categories: data.categories.length,
            tags: data.tags.length,
            posts: data.posts.length,
            pages: data.pages.length,
            comments: data.comments.length,
            media: data.media.length,
          });
        }
      } catch (error) {
        console.error("❌ Migration failed:", error.message);
        process.exit(1);
      }
    });
  
  await program.parseAsync();
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { parseWordPressXML, uploadToFastPress };