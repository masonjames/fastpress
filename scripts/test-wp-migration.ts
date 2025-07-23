#!/usr/bin/env ts-node
"use node";

import fs from "fs/promises";
import path from "path";
import { parseStringPromise } from "xml2js";

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

interface TestResult {
  name: string;
  success: boolean;
  error?: string;
  stats?: {
    users: number;
    categories: number;
    tags: number;
    posts: number;
    pages: number;
    comments: number;
    media: number;
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

/**
 * Test WordPress XML import with sample files
 */
async function testWordPressImport(xmlFiles: string[]): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  console.log("🧪 Starting WordPress XML import tests...\n");
  
  for (const xmlFile of xmlFiles) {
    const testName = path.basename(xmlFile);
    console.log(`📝 Testing: ${testName}`);
    
    try {
      // Check if file exists
      await fs.access(xmlFile);
      
      // Parse the XML
      const data = await parseWordPressXML(xmlFile);
      
      // Validate required structure
      if (!data.users || !data.categories || !data.posts || !data.pages) {
        throw new Error("Parsed data missing required structure");
      }
      
      const stats = {
        users: data.users.length,
        categories: data.categories.length,
        tags: data.tags.length,
        posts: data.posts.length,
        pages: data.pages.length,
        comments: data.comments.length,
        media: data.media.length,
      };
      
      // Basic validation rules
      const validations = [
        { name: "Has content", check: stats.posts > 0 || stats.pages > 0 },
        { name: "Valid categories", check: stats.categories >= 0 },
        { name: "Posts have titles", check: data.posts.every((p: any) => p.title) },
        { name: "Pages have titles", check: data.pages.every((p: any) => p.title) },
        { name: "Users have emails", check: data.users.every((u: any) => u.email) },
      ];
      
      const failedValidations = validations.filter(v => !v.check);
      
      if (failedValidations.length > 0) {
        throw new Error(`Validation failed: ${failedValidations.map(v => v.name).join(", ")}`);
      }
      
      results.push({
        name: testName,
        success: true,
        stats,
      });
      
      console.log(`✅ ${testName}: PASS`);
      console.log(`   📊 ${stats.posts} posts, ${stats.pages} pages, ${stats.comments} comments\n`);
      
    } catch (error) {
      results.push({
        name: testName,
        success: false,
        error: error.message,
      });
      
      console.log(`❌ ${testName}: FAIL - ${error.message}\n`);
    }
  }
  
  return results;
}

/**
 * Generate test report
 */
function generateTestReport(results: TestResult[]): void {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log("=".repeat(60));
  console.log("📋 WORDPRESS XML IMPORT TEST REPORT");
  console.log("=".repeat(60));
  console.log(`Total tests: ${results.length}`);
  console.log(`✅ Passed: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log(`📈 Success rate: ${((successful.length / results.length) * 100).toFixed(1)}%\n`);
  
  if (successful.length > 0) {
    console.log("✅ SUCCESSFUL IMPORTS:");
    successful.forEach(result => {
      if (result.stats) {
        console.log(`   ${result.name}: ${result.stats.posts}p ${result.stats.pages}pg ${result.stats.comments}c`);
      }
    });
    console.log();
  }
  
  if (failed.length > 0) {
    console.log("❌ FAILED IMPORTS:");
    failed.forEach(result => {
      console.log(`   ${result.name}: ${result.error}`);
    });
    console.log();
  }
  
  // Overall assessment
  if (successful.length === results.length) {
    console.log("🎉 ALL TESTS PASSED! WordPress import is ready for production.");
  } else if (successful.length > 0) {
    console.log("⚠️  PARTIAL SUCCESS: Some imports work, others need investigation.");
  } else {
    console.log("🚨 ALL TESTS FAILED: WordPress import needs significant work.");
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  let xmlFiles: string[] = [];
  
  // If specific files provided as arguments
  if (args.length > 0 && !args[0].startsWith("--")) {
    xmlFiles = args;
  } else {
    // Search for XML files in Downloads
    const downloadsPath = "/Users/masonjames/Downloads";
    try {
      const files = await fs.readdir(downloadsPath);
      xmlFiles = files
        .filter(file => file.endsWith(".xml"))
        .map(file => path.join(downloadsPath, file));
    } catch (error) {
      console.log("❌ Could not read Downloads directory");
    }
  }
  
  if (xmlFiles.length === 0) {
    console.log("❌ No XML files found for testing.");
    console.log("💡 Usage options:");
    console.log("   npm run test:wp-migration file1.xml file2.xml");
    process.exit(1);
  }
  
  console.log(`🔍 Found ${xmlFiles.length} XML file(s) to test:`);
  xmlFiles.forEach(file => console.log(`   - ${file}`));
  console.log();
  
  const results = await testWordPressImport(xmlFiles);
  generateTestReport(results);
  
  // Exit with error code if any tests failed
  const hasFailures = results.some(r => !r.success);
  process.exit(hasFailures ? 1 : 0);
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}