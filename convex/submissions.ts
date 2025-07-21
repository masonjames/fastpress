import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// List submissions with comprehensive filtering
export const list = query({
  args: {
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    formId: v.optional(v.id("forms")),
    studentId: v.optional(v.id("students")),
    assignedTo: v.optional(v.id("users")),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    const offset = args.offset || 0;

    let submissions = await ctx.db.query("submissions").collect();

    // Apply filters
    if (args.status) {
      submissions = submissions.filter(s => s.status === args.status);
    }
    if (args.priority) {
      submissions = submissions.filter(s => s.priority === args.priority);
    }
    if (args.formId) {
      submissions = submissions.filter(s => s.form === args.formId);
    }
    if (args.studentId) {
      submissions = submissions.filter(s => s.student === args.studentId);
    }
    if (args.assignedTo) {
      submissions = submissions.filter(s => s.assignedTo === args.assignedTo);
    }

    // Sort by submission date (newest first)
    submissions.sort((a, b) => b.submittedAt - a.submittedAt);

    // Paginate
    const paginatedSubmissions = submissions.slice(offset, offset + limit);
    const hasMore = submissions.length > offset + limit;

    // Populate relationships
    const populatedSubmissions = await Promise.all(
      paginatedSubmissions.map(async (submission) => {
        const [form, student, reviewer, assignee] = await Promise.all([
          ctx.db.get(submission.form),
          submission.student ? ctx.db.get(submission.student) : null,
          submission.reviewedBy ? ctx.db.get(submission.reviewedBy) : null,
          submission.assignedTo ? ctx.db.get(submission.assignedTo) : null,
        ]);

        return {
          ...submission,
          form,
          student,
          reviewer,
          assignee,
        };
      })
    );

    return {
      items: populatedSubmissions,
      hasMore,
    };
  },
});

// Get submission by ID
export const getById = query({
  args: { id: v.id("submissions") },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.id);
    if (!submission) return null;

    const [form, student, reviewer, assignee] = await Promise.all([
      ctx.db.get(submission.form),
      submission.student ? ctx.db.get(submission.student) : null,
      submission.reviewedBy ? ctx.db.get(submission.reviewedBy) : null,
      submission.assignedTo ? ctx.db.get(submission.assignedTo) : null,
    ]);

    return {
      ...submission,
      form,
      student,
      reviewer,
      assignee,
    };
  },
});

// Process new submission with auto-linking
export const processSubmission = mutation({
  args: {
    formId: v.id("forms"),
    submissionData: v.any(),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
  },
  handler: async (ctx, args) => {
    // Try to auto-link to student based on email
    let studentId = null;
    let autoLinked = false;
    let linkingConfidence = 0;

    if (args.submissionData.email) {
      const student = await ctx.db
        .query("students")
        .withIndex("by_email", (q) => q.eq("email", args.submissionData.email))
        .unique();
      
      if (student) {
        studentId = student._id;
        autoLinked = true;
        linkingConfidence = 0.95; // High confidence for email match
      } else {
        // Try fuzzy matching on name if email doesn't match
        if (args.submissionData.name) {
          const allStudents = await ctx.db.query("students").collect();
          const nameMatch = allStudents.find(s => 
            s.name.toLowerCase().includes(args.submissionData.name.toLowerCase()) ||
            args.submissionData.name.toLowerCase().includes(s.name.toLowerCase())
          );
          
          if (nameMatch) {
            studentId = nameMatch._id;
            autoLinked = true;
            linkingConfidence = 0.7; // Lower confidence for name match
          }
        }
      }
    }

    // Create submission record
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

// Update submission status and review
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

// Assign submission to user
export const assign = mutation({
  args: {
    id: v.id("submissions"),
    assignedTo: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(args.id, {
      assignedTo: args.assignedTo,
    });
  },
});

// Link submission to student manually
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

// Update submission priority
export const updatePriority = mutation({
  args: {
    id: v.id("submissions"),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(args.id, { priority: args.priority });
  },
});

// Add tags to submission
export const updateTags = mutation({
  args: {
    id: v.id("submissions"),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(args.id, { tags: args.tags });
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

    const updateData: any = { ...args.updates };
    if (args.updates.status) {
      updateData.reviewedAt = Date.now();
      updateData.reviewedBy = userId;
    }

    await Promise.all(
      args.ids.map(id => ctx.db.patch(id, updateData))
    );
  },
});

// Get submission statistics
export const getStats = query({
  args: {
    formId: v.optional(v.id("forms")),
    dateRange: v.optional(v.object({
      start: v.number(),
      end: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    let submissions = await ctx.db.query("submissions").collect();

    // Filter by form if specified
    if (args.formId) {
      submissions = submissions.filter(s => s.form === args.formId);
    }

    // Filter by date range if specified
    if (args.dateRange) {
      submissions = submissions.filter(s => 
        s.submittedAt >= args.dateRange!.start && 
        s.submittedAt <= args.dateRange!.end
      );
    }

    const total = submissions.length;
    const byStatus = {
      pending: submissions.filter(s => s.status === "pending").length,
      approved: submissions.filter(s => s.status === "approved").length,
      rejected: submissions.filter(s => s.status === "rejected").length,
    };

    const byPriority = {
      low: submissions.filter(s => s.priority === "low").length,
      medium: submissions.filter(s => s.priority === "medium").length,
      high: submissions.filter(s => s.priority === "high").length,
    };

    const autoLinked = submissions.filter(s => s.autoLinked).length;
    const manuallyLinked = submissions.filter(s => s.student && !s.autoLinked).length;
    const unlinked = submissions.filter(s => !s.student).length;

    return {
      total,
      byStatus,
      byPriority,
      linking: {
        autoLinked,
        manuallyLinked,
        unlinked,
      },
    };
  },
});