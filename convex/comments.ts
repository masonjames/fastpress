import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Submit a new comment (public endpoint)
export const create = mutation({
  args: {
    postId: v.id("posts"),
    author: v.string(),
    email: v.string(),
    content: v.string(),
    parent: v.optional(v.id("comments")),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Basic validation
    if (!args.content.trim()) {
      throw new Error("Comment content cannot be empty");
    }

    if (!args.author.trim()) {
      throw new Error("Author name is required");
    }

    if (!args.email.trim() || !args.email.includes("@")) {
      throw new Error("Valid email is required");
    }

    // Verify post exists
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // If replying to a comment, verify parent exists
    if (args.parent) {
      const parentComment = await ctx.db.get(args.parent);
      if (!parentComment || parentComment.post !== args.postId) {
        throw new Error("Parent comment not found or belongs to different post");
      }
    }

    // Create comment with pending status for moderation
    const commentId = await ctx.db.insert("comments", {
      post: args.postId,
      parent: args.parent,
      author: args.author.trim(),
      email: args.email.trim().toLowerCase(),
      content: args.content.trim(),
      status: "pending", // All comments start as pending
      createdAt: Date.now(),
      userAgent: args.userAgent,
      ipAddress: args.ipAddress,
    });

    return commentId;
  },
});

// Get approved comments for a post (public)
export const listForPost = query({
  args: { 
    postId: v.id("posts"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("post", args.postId))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .order("asc") // Show oldest first for threaded discussions
      .take(args.limit || 100);

    // Build threaded structure
    const commentMap = new Map();
    const rootComments: any[] = [];

    // First pass: create comment objects with replies array
    for (const comment of comments) {
      const commentWithReplies = {
        ...comment,
        replies: [],
      };
      commentMap.set(comment._id, commentWithReplies);
      
      if (!comment.parent) {
        rootComments.push(commentWithReplies);
      }
    }

    // Second pass: build threaded structure
    for (const comment of comments) {
      if (comment.parent && commentMap.has(comment.parent)) {
        const parentComment = commentMap.get(comment.parent);
        const commentWithReplies = commentMap.get(comment._id);
        parentComment.replies.push(commentWithReplies);
      }
    }

    return rootComments;
  },
});

// Admin: Get all comments with filtering (for moderation)
export const listForAdmin = query({
  args: {
    status: v.optional(v.union(v.literal("approved"), v.literal("pending"), v.literal("spam"))),
    postId: v.optional(v.id("posts")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    let comments;

    if (args.status) {
      comments = await ctx.db
        .query("comments")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc") // Newest first for admin
        .take(args.limit || 50);
    } else {
      comments = await ctx.db
        .query("comments")
        .order("desc") // Newest first for admin
        .take(args.limit || 50);
    }

    // Filter by post if specified
    const filteredComments = args.postId
      ? comments.filter(comment => comment.post === args.postId)
      : comments;

    // Populate post information
    const commentsWithPosts = await Promise.all(
      filteredComments.map(async (comment) => {
        const post = comment.post ? await ctx.db.get(comment.post) : null;
        const parentComment = comment.parent ? await ctx.db.get(comment.parent) : null;
        
        return {
          ...comment,
          post,
          parentComment,
        };
      })
    );

    return commentsWithPosts;
  },
});

// Admin: Approve comment
export const approve = mutation({
  args: { 
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    await ctx.db.patch(args.commentId, {
      status: "approved",
    });
  },
});

// Admin: Mark comment as spam
export const markSpam = mutation({
  args: { 
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    await ctx.db.patch(args.commentId, {
      status: "spam",
    });
  },
});

// Admin: Delete comment
export const remove = mutation({
  args: { 
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Check if comment has replies
    const replies = await ctx.db
      .query("comments")
      .withIndex("by_parent", (q) => q.eq("parent", args.commentId))
      .collect();

    if (replies.length > 0) {
      throw new Error("Cannot delete comment with replies. Please delete replies first.");
    }

    await ctx.db.delete(args.commentId);
  },
});

// Get comment count for a post
export const getCommentCount = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("post", args.postId))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();

    return comments.length;
  },
});