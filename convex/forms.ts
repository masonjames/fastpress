import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

// List forms with status filtering
export const list = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let formsQuery = ctx.db.query("forms");
    
    if (args.status) {
      formsQuery = formsQuery.filter((q) => q.eq(q.field("status"), args.status!));
    }

    const forms = await formsQuery
      .order("desc")
      .take(args.limit || 50);

    // Get submission counts for each form
    return Promise.all(forms.map(async (form) => {
      const submissionCount = await ctx.db
        .query("formSubmissions")
        .withIndex("by_form", (q) => q.eq("form", form._id))
        .collect()
        .then(submissions => submissions.length);

      return {
        ...form,
        submissionCount,
      };
    }));
  },
});

// Get form by slug with submission data
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const form = await ctx.db
      .query("forms")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!form) return null;

    // Get recent submissions
    const recentSubmissions = await ctx.db
      .query("formSubmissions")
      .withIndex("by_form", (q) => q.eq("form", form._id))
      .order("desc")
      .take(5);

    return {
      ...form,
      recentSubmissions,
    };
  },
});

// Get form by ID
export const getById = query({
  args: { id: v.id("forms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create new form
export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    fields: v.array(v.any()),
    submitAction: v.string(),
    confirmationMessage: v.optional(v.string()),
    emails: v.optional(v.array(v.object({
      emailTo: v.optional(v.string()),
      emailFrom: v.optional(v.string()),
      subject: v.string(),
      message: v.optional(v.string()),
    }))),
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
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    fields: v.optional(v.array(v.any())),
    submitAction: v.optional(v.string()),
    confirmationMessage: v.optional(v.string()),
    emails: v.optional(v.array(v.object({
      emailTo: v.optional(v.string()),
      emailFrom: v.optional(v.string()),
      subject: v.string(),
      message: v.optional(v.string()),
    }))),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Delete form
export const remove = mutation({
  args: { id: v.id("forms") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Delete all form submissions first
    const submissions = await ctx.db
      .query("formSubmissions")
      .withIndex("by_form", (q) => q.eq("form", args.id))
      .collect();

    await Promise.all(submissions.map(submission => ctx.db.delete(submission._id)));
    
    await ctx.db.delete(args.id);
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

// Get form submissions with pagination
export const getSubmissions = query({
  args: {
    formId: v.id("forms"),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    const offset = args.offset || 0;

    const submissions = await ctx.db
      .query("formSubmissions")
      .withIndex("by_form", (q) => q.eq("form", args.formId))
      .order("desc")
      .take(limit + offset + 1);

    const paginatedSubmissions = submissions.slice(offset, offset + limit);
    const hasMore = submissions.length > offset + limit;

    return {
      items: paginatedSubmissions,
      hasMore,
    };
  },
});

// Submit form data (public action)
export const submitForm = action({
  args: {
    formSlug: v.string(),
    data: v.any(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<string> => {
    // Get form by slug
    const form: any = await ctx.runQuery(api.forms.getBySlug, { slug: args.formSlug });
    
    if (!form || form.status !== "published") {
      throw new Error("Form not found or not published");
    }

    // Create form submission
    const submissionId: any = await ctx.runMutation(api.forms.createSubmission, {
      form: form._id,
      submissionData: args.data,
      submittedAt: Date.now(),
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
    });

    // Process enhanced submission if configured
    if (form.submitAction === "enhanced" && args.data.email) {
      await ctx.runMutation(api.submissions.processSubmission, {
        formId: form._id,
        submissionData: args.data,
      });
    }

    return {
      success: true,
      submissionId,
      confirmationMessage: form.confirmationMessage || "Thank you for your submission!",
    };
  },
});

// Get submission statistics
export const getStats = query({
  args: { formId: v.id("forms") },
  handler: async (ctx, args) => {
    const submissions = await ctx.db
      .query("formSubmissions")
      .withIndex("by_form", (q) => q.eq("form", args.formId))
      .collect();

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const weekMs = 7 * dayMs;
    const monthMs = 30 * dayMs;

    const todaySubmissions = submissions.filter(s => s.submittedAt > now - dayMs).length;
    const weekSubmissions = submissions.filter(s => s.submittedAt > now - weekMs).length;
    const monthSubmissions = submissions.filter(s => s.submittedAt > now - monthMs).length;

    return {
      total: submissions.length,
      today: todaySubmissions,
      thisWeek: weekSubmissions,
      thisMonth: monthSubmissions,
    };
  },
});