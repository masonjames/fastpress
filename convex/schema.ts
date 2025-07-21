import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("private")),
    authorId: v.id("users"),
    categoryId: v.optional(v.id("categories")),
    tags: v.array(v.string()),
    featuredImage: v.optional(v.id("_storage")),
    publishedAt: v.optional(v.number()),
    // SEO fields
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    focusKeyword: v.optional(v.string()),
    seoScore: v.optional(v.number()),
    readabilityScore: v.optional(v.number()),
    canonicalUrl: v.optional(v.string()),
    noIndex: v.optional(v.boolean()),
    noFollow: v.optional(v.boolean()),
    // Performance
    readingTime: v.optional(v.number()),
    wordCount: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_author", ["authorId"])
    .index("by_category", ["categoryId"])
    .index("by_published_date", ["publishedAt"])
    .searchIndex("search_posts", {
      searchField: "content",
      filterFields: ["status", "categoryId"]
    }),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    parentId: v.optional(v.id("categories")),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_parent", ["parentId"]),

  pages: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("private")),
    authorId: v.id("users"),
    parentId: v.optional(v.id("pages")),
    template: v.optional(v.string()),
    // SEO fields
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    noIndex: v.optional(v.boolean()),
    noFollow: v.optional(v.boolean()),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_parent", ["parentId"]),

  comments: defineTable({
    postId: v.id("posts"),
    authorName: v.string(),
    authorEmail: v.string(),
    authorUrl: v.optional(v.string()),
    content: v.string(),
    status: v.union(v.literal("approved"), v.literal("pending"), v.literal("spam")),
    parentId: v.optional(v.id("comments")),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  })
    .index("by_post", ["postId"])
    .index("by_status", ["status"])
    .index("by_parent", ["parentId"]),

  siteSettings: defineTable({
    key: v.string(),
    value: v.string(),
    type: v.union(v.literal("string"), v.literal("number"), v.literal("boolean"), v.literal("json")),
  })
    .index("by_key", ["key"]),

  seoAnalysis: defineTable({
    postId: v.optional(v.id("posts")),
    pageId: v.optional(v.id("pages")),
    focusKeyword: v.string(),
    keywordDensity: v.number(),
    titleScore: v.number(),
    metaDescriptionScore: v.number(),
    contentScore: v.number(),
    readabilityScore: v.number(),
    overallScore: v.number(),
    suggestions: v.array(v.string()),
    warnings: v.array(v.string()),
  })
    .index("by_post", ["postId"])
    .index("by_page", ["pageId"]),

  mcpConnections: defineTable({
    name: v.string(),
    endpoint: v.string(),
    apiKey: v.optional(v.string()),
    model: v.string(),
    isActive: v.boolean(),
    capabilities: v.array(v.string()),
    lastUsed: v.optional(v.number()),
  })
    .index("by_active", ["isActive"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
