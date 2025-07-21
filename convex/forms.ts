import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// List forms
export const list = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    let formsQuery = ctx.db.query("forms");
    
    if (args.status) {
      formsQuery = formsQuery.filter((q) => q.eq(q.field("status"), args.status!));
    }

    return await formsQuery.order("desc").collect();
  },
});

// Get form by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("forms")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

// Create form
export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    fields: v.array(v.any()),
    submitAction: v.string(),
    confirmationMessage: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("forms", args);
  },
});

// Update form
export const update = mutation({
  args: {
    id: v.id("forms"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    fields: v.optional(v.array(v.any())),
    submitAction: v.optional(v.string()),
    confirmationMessage: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Submit form data
export const submitForm = action({
  args: {
    formId: v.id("forms"),
    data: v.any(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const form = await ctx.runQuery("forms:getById", { id: args.formId });
    if (!form || form.status !== "published") {
      throw new Error("Form not found or not published");
    }

    // Create form submission
    const submissionId = await ctx.runMutation("forms:createSubmission", {
      form: args.formId,
      submissionData: args.data,
      submittedAt: Date.now(),
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
    });

    // Process submission workflow if needed
    if (form.submitAction === "enhanced") {
      await ctx.runMutation("submissions:processSubmission", {
        formId: args.formId,
        submissionData: args.data,
      });
    }

    return { success: true, submissionId };
  },
});

// Helper function to get form by ID
export const getById = query({
  args: { id: v.id("forms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create form submission
export const createSubmission = mutation({
  args: {
    form: v.id("forms"),
    submissionData: v.any(),
    submittedAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("formSubmissions", args);
  },
});

// Get form submissions
export const getSubmissions = query({
  args: {
    formId: v.id("forms"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("formSubmissions")
      .withIndex("by_form", (q) => q.eq("form", args.formId))
      .order("desc")
      .take(args.limit || 50);
  },
});