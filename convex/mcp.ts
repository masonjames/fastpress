import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listConnections = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("mcpConnections").collect();
  },
});

export const createConnection = mutation({
  args: {
    name: v.string(),
    endpoint: v.string(),
    apiKey: v.optional(v.string()),
    model: v.string(),
    capabilities: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("mcpConnections", {
      ...args,
      isActive: true,
      lastUsed: undefined,
    });
  },
});

export const generateContent = action({
  args: {
    connectionId: v.id("mcpConnections"),
    prompt: v.string(),
    contentType: v.union(v.literal("post"), v.literal("page"), v.literal("seo")),
    focusKeyword: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const connection = await ctx.runQuery(api.mcp.getConnection, {
      id: args.connectionId,
    });

    if (!connection || !connection.isActive) {
      throw new Error("MCP connection not found or inactive");
    }

    // Update last used timestamp
    await ctx.runMutation(api.mcp.updateLastUsed, {
      id: args.connectionId,
    });

    // Simulate MCP call - in real implementation, this would call the actual MCP endpoint
    const response = await simulateMCPCall(connection, args.prompt, args.contentType, args.focusKeyword);
    
    return response;
  },
});

export const getConnection = query({
  args: { id: v.id("mcpConnections") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateLastUsed = mutation({
  args: { id: v.id("mcpConnections") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { lastUsed: Date.now() });
  },
});

export const optimizeForSEO = action({
  args: {
    connectionId: v.id("mcpConnections"),
    title: v.string(),
    content: v.string(),
    focusKeyword: v.string(),
  },
  handler: async (ctx, args) => {
    const connection = await ctx.runQuery(api.mcp.getConnection, {
      id: args.connectionId,
    });

    if (!connection || !connection.isActive) {
      throw new Error("MCP connection not found or inactive");
    }

    const prompt = `Optimize this content for SEO with focus keyword "${args.focusKeyword}":
    
Title: ${args.title}
Content: ${args.content}

Please provide:
1. Optimized title
2. Meta description
3. Improved content with better keyword integration
4. Suggested headings structure
5. Internal linking opportunities`;

    const response = await simulateMCPCall(connection, prompt, "seo", args.focusKeyword);
    
    await ctx.runMutation(api.mcp.updateLastUsed, {
      id: args.connectionId,
    });

    return response;
  },
});

// Simulate MCP call - replace with actual MCP implementation
async function simulateMCPCall(
  connection: any,
  prompt: string,
  contentType: string,
  focusKeyword?: string
) {
  // This would be replaced with actual MCP protocol implementation
  const responses = {
    post: {
      title: `Optimized Title with ${focusKeyword || "keyword"}`,
      content: `# Optimized Content\n\nThis is AI-generated content optimized for SEO with the focus keyword "${focusKeyword || "keyword"}" naturally integrated throughout the text.\n\n## Key Points\n\n- SEO-optimized structure\n- Natural keyword integration\n- Engaging and readable content\n- Proper heading hierarchy`,
      metaDescription: `Discover comprehensive insights about ${focusKeyword || "this topic"} in our detailed guide.`,
      suggestions: [
        "Add internal links to related posts",
        "Include relevant images with alt text",
        "Consider adding a FAQ section"
      ]
    },
    page: {
      title: `${focusKeyword || "Service"} - Professional Solutions`,
      content: `# Welcome to Our ${focusKeyword || "Service"} Page\n\nWe provide professional ${focusKeyword || "services"} tailored to your needs.\n\n## Our Approach\n\nOur methodology ensures the best results for your ${focusKeyword || "requirements"}.`,
      metaDescription: `Professional ${focusKeyword || "services"} with proven results. Contact us today.`,
      suggestions: [
        "Add testimonials section",
        "Include contact form",
        "Add service pricing table"
      ]
    },
    seo: {
      optimizedTitle: `${focusKeyword || "Keyword"} Guide: Complete 2024 Overview`,
      metaDescription: `Complete guide to ${focusKeyword || "this topic"}. Learn best practices, tips, and strategies.`,
      contentSuggestions: [
        `Use "${focusKeyword}" in the first paragraph`,
        "Add relevant subheadings with keyword variations",
        "Include bullet points for better readability",
        "Add a conclusion with call-to-action"
      ],
      headingStructure: [
        `H1: ${focusKeyword || "Main Topic"} - Complete Guide`,
        `H2: What is ${focusKeyword || "This Topic"}?`,
        `H2: Benefits of ${focusKeyword || "This Topic"}`,
        `H2: How to Get Started with ${focusKeyword || "This Topic"}`,
        `H3: Step-by-step process`,
        `H3: Common mistakes to avoid`,
        `H2: Conclusion`
      ]
    }
  };

  return responses[contentType as keyof typeof responses] || responses.post;
}

import { api } from "./_generated/api";
