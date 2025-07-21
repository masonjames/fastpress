import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const payBlocksTables = {
  // Core CMS Collections
  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.optional(v.string()), // Rich text content
    excerpt: v.optional(v.string()), // Legacy field
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("private")),
    publishedAt: v.optional(v.number()),
    
    // Authors and relationships (compatible with old schema)
    authors: v.optional(v.array(v.id("users"))),
    authorId: v.optional(v.id("users")), // Legacy field for migration
    categories: v.optional(v.array(v.id("categories"))),
    tags: v.optional(v.array(v.union(v.string(), v.id("tags")))), // Legacy: strings or IDs
    categoryId: v.optional(v.id("categories")), // Legacy field
    relatedPosts: v.optional(v.array(v.id("posts"))),
    
    // Media and design
    bannerImage: v.optional(v.id("media")),
    designVersion: v.optional(v.string()),
    
    // SEO fields
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    metaImage: v.optional(v.id("media")),
    canonicalUrl: v.optional(v.string()),
    noIndex: v.optional(v.boolean()),
    noFollow: v.optional(v.boolean()),
    focusKeyword: v.optional(v.string()),
    seoScore: v.optional(v.number()),
    readabilityScore: v.optional(v.number()),
    
    // Performance metrics
    readTime: v.optional(v.number()),
    readingTime: v.optional(v.number()), // Legacy field
    wordCount: v.optional(v.number()),
    
    // WordPress migration fields
    wp_post_id: v.optional(v.number()),
    wp_post_name: v.optional(v.string()),
    wp_post_type: v.optional(v.string()),
    wp_post_status: v.optional(v.string()),
    wp_post_parent: v.optional(v.number()),
    wp_guid: v.optional(v.string()),
    wp_menu_order: v.optional(v.number()),
    wp_post_excerpt: v.optional(v.string()),
    wp_comment_status: v.optional(v.string()),
    wp_ping_status: v.optional(v.string()),
    wp_post_password: v.optional(v.string()),
    wp_post_date: v.optional(v.number()),
    wp_post_modified: v.optional(v.number()),
    wp_post_meta: v.optional(v.any()),
    
    // Nested docs support
    breadcrumbs: v.optional(v.array(v.object({
      id: v.string(),
      label: v.string(),
      url: v.optional(v.string()),
    }))),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_published_date", ["publishedAt"])
    .index("by_wp_post_id", ["wp_post_id"])
    .searchIndex("search_posts", {
      searchField: "content",
      filterFields: ["status"]
    }),

  pages: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("private")),
    
    // Page-specific fields
    hero: v.optional(v.any()), // Hero configuration
    layout: v.array(v.any()), // Block layout
    
    // Authors and relationships
    authors: v.array(v.id("users")),
    
    // SEO fields
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    metaImage: v.optional(v.id("media")),
    canonicalUrl: v.optional(v.string()),
    noIndex: v.optional(v.boolean()),
    noFollow: v.optional(v.boolean()),
    
    // Nested docs support
    parent: v.optional(v.id("pages")),
    breadcrumbs: v.optional(v.array(v.object({
      id: v.string(),
      label: v.string(),
      url: v.optional(v.string()),
    }))),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_parent", ["parent"]),

  media: defineTable({
    filename: v.string(),
    mimeType: v.string(),
    filesize: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    focalX: v.optional(v.number()),
    focalY: v.optional(v.number()),
    alt: v.optional(v.string()),
    url: v.optional(v.string()),
    thumbnailURL: v.optional(v.string()),
    
    // Storage reference
    storageId: v.optional(v.id("_storage")),
  })
    .index("by_filename", ["filename"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    parent: v.optional(v.id("categories")),
    
    // SEO fields
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    
    // Nested docs support
    breadcrumbs: v.optional(v.array(v.object({
      id: v.string(),
      label: v.string(),
      url: v.optional(v.string()),
    }))),
  })
    .index("by_slug", ["slug"])
    .index("by_parent", ["parent"]),

  tags: defineTable({
    name: v.string(),
    slug: v.string(),
  })
    .index("by_slug", ["slug"]),

  // Educational Collections
  students: defineTable({
    name: v.string(),
    email: v.string(),
    studentId: v.string(),
    phone: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    address: v.optional(v.string()),
    emergencyContact: v.optional(v.object({
      name: v.string(),
      phone: v.string(),
      relationship: v.string(),
    })),
    enrollmentDate: v.optional(v.number()),
    graduationDate: v.optional(v.number()),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("graduated")),
    semester: v.optional(v.id("semesters")),
    notes: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_student_id", ["studentId"])
    .index("by_status", ["status"]),

  staff: defineTable({
    name: v.string(),
    email: v.string(),
    employeeId: v.string(),
    title: v.string(),
    department: v.optional(v.string()),
    phone: v.optional(v.string()),
    bio: v.optional(v.string()),
    image: v.optional(v.id("media")),
    startDate: v.optional(v.number()),
    status: v.union(v.literal("active"), v.literal("inactive")),
  })
    .index("by_email", ["email"])
    .index("by_employee_id", ["employeeId"]),

  semesters: defineTable({
    name: v.string(),
    slug: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    isActive: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_active", ["isActive"]),

  locations: defineTable({
    name: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    description: v.optional(v.string()),
  }),

  events: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    location: v.optional(v.id("locations")),
    image: v.optional(v.id("media")),
    registrationRequired: v.boolean(),
    maxAttendees: v.optional(v.number()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("cancelled")),
  })
    .index("by_slug", ["slug"])
    .index("by_start_date", ["startDate"])
    .index("by_status", ["status"]),

  // Form System
  forms: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    fields: v.array(v.any()), // Form field configuration
    submitAction: v.string(),
    confirmationMessage: v.optional(v.string()),
    emails: v.optional(v.array(v.object({
      emailTo: v.optional(v.string()),
      emailFrom: v.optional(v.string()),
      subject: v.string(),
      message: v.optional(v.string()),
    }))),
    status: v.union(v.literal("draft"), v.literal("published")),
  })
    .index("by_slug", ["slug"]),

  formSubmissions: defineTable({
    form: v.id("forms"),
    submissionData: v.any(), // Form submission data
    submittedAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  })
    .index("by_form", ["form"])
    .index("by_submitted_at", ["submittedAt"]),

  submissions: defineTable({
    form: v.id("forms"),
    student: v.optional(v.id("students")),
    data: v.any(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    submittedAt: v.number(),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.id("users")),
    notes: v.optional(v.string()),
    
    // Enhanced workflow fields
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    assignedTo: v.optional(v.id("users")),
    tags: v.array(v.string()),
    
    // Automatic linking
    autoLinked: v.boolean(),
    linkingConfidence: v.optional(v.number()),
  })
    .index("by_form", ["form"])
    .index("by_student", ["student"])
    .index("by_status", ["status"])
    .index("by_priority", ["priority"]),

  // Gravity Forms Integration
  gfEntries: defineTable({
    formId: v.number(),
    entryId: v.number(),
    dateCreated: v.number(),
    isStarred: v.boolean(),
    isRead: v.boolean(),
    ip: v.string(),
    sourceUrl: v.string(),
    userAgent: v.string(),
    status: v.string(),
    fields: v.any(), // Raw form fields data
    
    // Enhanced processing
    studentLinked: v.optional(v.id("students")),
    linkingStatus: v.union(v.literal("pending"), v.literal("linked"), v.literal("failed")),
    processedAt: v.optional(v.number()),
    
    // Template detection
    detectedTemplate: v.optional(v.string()),
    templateConfidence: v.optional(v.number()),
  })
    .index("by_form_id", ["formId"])
    .index("by_entry_id", ["entryId"])
    .index("by_student", ["studentLinked"])
    .index("by_status", ["status"]),

  comments: defineTable({
    post: v.optional(v.id("posts")),
    parent: v.optional(v.id("comments")),
    author: v.string(),
    email: v.string(),
    content: v.string(),
    status: v.union(v.literal("approved"), v.literal("pending"), v.literal("spam")),
    createdAt: v.number(),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  })
    .index("by_post", ["post"])
    .index("by_parent", ["parent"])
    .index("by_status", ["status"]),

  // User Roles
  roles: defineTable({
    name: v.string(),
    slug: v.string(),
    permissions: v.array(v.string()),
    description: v.optional(v.string()),
  })
    .index("by_slug", ["slug"]),

  // FAQ Categories
  faqCategories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
  })
    .index("by_slug", ["slug"]),

  // Global Configuration
  globals: defineTable({
    globalType: v.string(),
    slug: v.string(),
    data: v.any(), // Global configuration data
  })
    .index("by_type", ["globalType"])
    .index("by_slug", ["slug"]),

  // Redirects
  redirects: defineTable({
    from: v.string(),
    to: v.object({
      type: v.union(v.literal("reference"), v.literal("custom")),
      url: v.optional(v.string()),
      reference: v.optional(v.object({
        relationTo: v.string(),
        value: v.string(),
      })),
    }),
    type: v.union(v.literal("301"), v.literal("302")),
  })
    .index("by_from", ["from"]),

  // Search functionality
  search: defineTable({
    title: v.string(),
    excerpt: v.optional(v.string()),
    meta: v.optional(v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      image: v.optional(v.id("media")),
    })),
    slug: v.string(),
    doc: v.object({
      relationTo: v.string(),
      value: v.string(),
    }),
    priority: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .searchIndex("search_content", {
      searchField: "excerpt",
      filterFields: ["doc.relationTo"]
    }),

  // Site Settings
  siteSettings: defineTable({
    key: v.string(),
    value: v.string(),
    type: v.union(v.literal("string"), v.literal("number"), v.literal("boolean"), v.literal("json")),
  })
    .index("by_key", ["key"]),

  // SEO Analysis
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

  // MCP Connections
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
  ...payBlocksTables,
});
