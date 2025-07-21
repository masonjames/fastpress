import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// List submissions with filtering
export const list = query({
  args: {
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    formId: v.optional(v.id("forms")),
    studentId: v.optional(v.id("students")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let submissionsQuery = ctx.db.query("submissions");
    
    if (args.status) {
      submissionsQuery = submissionsQuery.withIndex("by_status", (q) => q.eq("status", args.status!));
    } else if (args.priority) {
      submissionsQuery = submissionsQuery.withIndex("by_priority", (q) => q.eq("priority", args.priority!));
    } else if (args.formId) {
      submissionsQuery = submissionsQuery.withIndex("by_form", (q) => q.eq("form", args.formId!));
    } else if (args.studentId) {
      submissionsQuery = submissionsQuery.withIndex("by_student", (q) => q.eq("student", args.studentId!));
    }

    const submissions = await submissionsQuery
      .order("desc")
      .take(args.limit || 50);

    // Populate relationships
    return Promise.all(submissions.map(async (submission) => {
      const [form, student, reviewer] = await Promise.all([
        ctx.db.get(submission.form),
        submission.student ? ctx.db.get(submission.student) : null,
        submission.reviewedBy ? ctx.db.get(submission.reviewedBy) : null,
      ]);

      return {
        ...submission,
        form,
        student,
        reviewer,
      };
    }));
  },
});

// Get submission by ID
export const getById = query({
  args: { id: v.id("submissions") },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.id);
    if (!submission) return null;

    const [form, student, reviewer] = await Promise.all([
      ctx.db.get(submission.form),
      submission.student ? ctx.db.get(submission.student) : null,
      submission.reviewedBy ? ctx.db.get(submission.reviewedBy) : null,
    ]);

    return {
      ...submission,
      form,
      student,
      reviewer,
    };
  },
});

// Process new submission
export const processSubmission = mutation({
  args: {
    formId: v.id("forms"),
    submissionData: v.any(),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
  },
  handler: async (ctx, args) => {
    // Try to auto-link to student
    let studentId: any = null;
    let autoLinked = false;
    let linkingConfidence = 0;

    // Simple email-based linking
    if (args.submissionData.email) {
      const student = await ctx.db
        .query("students")
        .withIndex("by_email", (q) => q.eq("email", args.submissionData.email))
        .unique();
      
      if (student) {
        studentId = student._id;
        autoLinked = true;
        linkingConfidence = 0.95; // High confidence for email match
      }
    }

    // Create submission
    return await ctx.db.insert("submissions", {
      form: args.formId,
      student: studentId,
      data: args.submissionData,
      status: "pending",
      submittedAt: Date.now(),
      priority: args.priority || "medium",
      tags: [],
      autoLinked,
      linkingConfidence,
    });
  },
});

// Update submission status
export const updateStatus = mutation({
  args: {
    id: v.id("submissions"),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(args.id, {
      status: args.status,
      reviewedAt: Date.now(),
      reviewedBy: userId,
      notes: args.notes,
    });
  },
});

// Link submission to student
export const linkToStudent = mutation({
  args: {
    id: v.id("submissions"),
    studentId: v.id("students"),
    confidence: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(args.id, {
      student: args.studentId,
      autoLinked: false, // Manual linking
      linkingConfidence: args.confidence || 1.0,
    });
  },
});

// Bulk update submissions
export const bulkUpdate = mutation({
  args: {
    ids: v.array(v.id("submissions")),
    updates: v.object({
      status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
      priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
      assignedTo: v.optional(v.id("users")),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const updateData = { ...args.updates };
    if (args.updates.status) {
      updateData.reviewedAt = Date.now();
      updateData.reviewedBy = userId;
    }

    await Promise.all(
      args.ids.map(id => ctx.db.patch(id, updateData))
    );
  },
});