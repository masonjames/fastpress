import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const analyzeSEO = mutation({
  args: {
    postId: v.optional(v.id("posts")),
    pageId: v.optional(v.id("pages")),
    title: v.string(),
    content: v.string(),
    metaDescription: v.optional(v.string()),
    focusKeyword: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const analysis = analyzeSEOContent(
      args.title,
      args.content,
      args.metaDescription || "",
      args.focusKeyword
    );

    return await ctx.db.insert("seoAnalysis", {
      postId: args.postId,
      pageId: args.pageId,
      focusKeyword: args.focusKeyword,
      ...analysis,
    });
  },
});

export const getSEOAnalysis = query({
  args: {
    postId: v.optional(v.id("posts")),
    pageId: v.optional(v.id("pages")),
  },
  handler: async (ctx, args) => {
    if (args.postId) {
      return await ctx.db
        .query("seoAnalysis")
        .withIndex("by_post", (q) => q.eq("postId", args.postId))
        .first();
    }
    
    if (args.pageId) {
      return await ctx.db
        .query("seoAnalysis")
        .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
        .first();
    }
    
    return null;
  },
});

export const generateLLMsTxt = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .take(100);

    const categories = await ctx.db.query("categories").collect();
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const siteSettings = await ctx.db.query("siteSettings").collect();
    const siteName = siteSettings.find(s => s.key === "site_name")?.value || "My Blog";
    const siteDescription = siteSettings.find(s => s.key === "site_description")?.value || "A WordPress-like blog";

    let llmsTxt = `# ${siteName}\n\n${siteDescription}\n\n`;
    
    // Add site structure
    llmsTxt += "## Site Structure\n\n";
    llmsTxt += "### Categories\n";
    for (const category of categories) {
      llmsTxt += `- ${category.name}: ${category.description || "No description"}\n`;
    }
    
    llmsTxt += "\n### Pages\n";
    for (const page of pages) {
      llmsTxt += `- ${page.title} (/${page.slug})\n`;
    }

    // Add recent posts
    llmsTxt += "\n## Recent Posts\n\n";
    for (const post of posts.slice(0, 20)) {
      const author = await ctx.db.get(post.authorId);
      const category = post.categoryId ? await ctx.db.get(post.categoryId) : null;
      
      llmsTxt += `### ${post.title}\n`;
      llmsTxt += `- URL: /${post.slug}\n`;
      llmsTxt += `- Author: ${author?.name || "Unknown"}\n`;
      llmsTxt += `- Category: ${category?.name || "Uncategorized"}\n`;
      llmsTxt += `- Published: ${post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : "Draft"}\n`;
      llmsTxt += `- Tags: ${post.tags.join(", ")}\n`;
      if (post.excerpt) {
        llmsTxt += `- Excerpt: ${post.excerpt}\n`;
      }
      llmsTxt += `- Reading Time: ${post.readingTime || 0} minutes\n`;
      llmsTxt += `- Word Count: ${post.wordCount || 0} words\n\n`;
    }

    // Add content guidelines
    llmsTxt += "## Content Guidelines\n\n";
    llmsTxt += "This site focuses on high-quality, SEO-optimized content with:\n";
    llmsTxt += "- Comprehensive keyword analysis\n";
    llmsTxt += "- Readability optimization\n";
    llmsTxt += "- Structured data markup\n";
    llmsTxt += "- Fast loading times\n";
    llmsTxt += "- Mobile-first design\n\n";

    llmsTxt += "## AI Integration\n\n";
    llmsTxt += "This site supports Model Context Protocol (MCP) for:\n";
    llmsTxt += "- Content generation assistance\n";
    llmsTxt += "- SEO optimization suggestions\n";
    llmsTxt += "- Automated content analysis\n";
    llmsTxt += "- Performance monitoring\n";

    return llmsTxt;
  },
});

function analyzeSEOContent(title: string, content: string, metaDescription: string, focusKeyword: string) {
  const titleScore = analyzeTitleSEO(title, focusKeyword);
  const metaDescriptionScore = analyzeMetaDescription(metaDescription, focusKeyword);
  const contentScore = analyzeContentSEO(content, focusKeyword);
  const readabilityScore = analyzeReadability(content);
  const keywordDensity = calculateKeywordDensity(content, focusKeyword);

  const suggestions: string[] = [];
  const warnings: string[] = [];

  if (titleScore < 70) {
    suggestions.push("Consider including your focus keyword in the title");
  }
  if (metaDescriptionScore < 70) {
    suggestions.push("Optimize your meta description with the focus keyword");
  }
  if (contentScore < 70) {
    suggestions.push("Include your focus keyword more naturally in the content");
  }
  if (readabilityScore < 60) {
    warnings.push("Content readability could be improved with shorter sentences");
  }
  if (keywordDensity > 3) {
    warnings.push("Keyword density is too high - avoid keyword stuffing");
  }

  const overallScore = Math.round((titleScore + metaDescriptionScore + contentScore + readabilityScore) / 4);

  return {
    titleScore,
    metaDescriptionScore,
    contentScore,
    readabilityScore,
    keywordDensity,
    overallScore,
    suggestions,
    warnings,
  };
}

function analyzeTitleSEO(title: string, focusKeyword: string): number {
  let score = 50;
  
  if (title.toLowerCase().includes(focusKeyword.toLowerCase())) {
    score += 30;
  }
  
  if (title.length >= 30 && title.length <= 60) {
    score += 20;
  }
  
  return Math.min(score, 100);
}

function analyzeMetaDescription(metaDescription: string, focusKeyword: string): number {
  let score = 50;
  
  if (metaDescription.toLowerCase().includes(focusKeyword.toLowerCase())) {
    score += 30;
  }
  
  if (metaDescription.length >= 120 && metaDescription.length <= 160) {
    score += 20;
  }
  
  return Math.min(score, 100);
}

function analyzeContentSEO(content: string, focusKeyword: string): number {
  let score = 50;
  const wordCount = content.split(/\s+/).length;
  
  if (content.toLowerCase().includes(focusKeyword.toLowerCase())) {
    score += 20;
  }
  
  if (wordCount >= 300) {
    score += 20;
  }
  
  if (wordCount >= 1000) {
    score += 10;
  }
  
  return Math.min(score, 100);
}

function analyzeReadability(content: string): number {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = content.split(/\s+/).filter(w => w.length > 0);
  const avgWordsPerSentence = words.length / sentences.length;
  
  let score = 100;
  
  if (avgWordsPerSentence > 20) {
    score -= 20;
  }
  if (avgWordsPerSentence > 25) {
    score -= 20;
  }
  
  return Math.max(score, 0);
}

function calculateKeywordDensity(content: string, focusKeyword: string): number {
  const words = content.toLowerCase().split(/\s+/);
  const keywordOccurrences = words.filter(word => 
    word.includes(focusKeyword.toLowerCase())
  ).length;
  
  return (keywordOccurrences / words.length) * 100;
}
