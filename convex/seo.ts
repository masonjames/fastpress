import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Analyze SEO for a post
export const analyzePost = mutation({
  args: {
    postId: v.id("posts"),
    focusKeyword: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    const analysis = performSEOAnalysis(post, args.focusKeyword);
    
    // Store the analysis
    const existingAnalysis = await ctx.db
      .query("seoAnalysis")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .unique();

    if (existingAnalysis) {
      await ctx.db.patch(existingAnalysis._id, analysis);
      return existingAnalysis._id;
    } else {
      return await ctx.db.insert("seoAnalysis", {
        ...analysis,
        postId: args.postId,
      });
    }
  },
});

// Analyze SEO for a page
export const analyzePage = mutation({
  args: {
    pageId: v.id("pages"),
    focusKeyword: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const page = await ctx.db.get(args.pageId);
    if (!page) throw new Error("Page not found");

    const analysis = performSEOAnalysis(page, args.focusKeyword);
    
    // Store the analysis
    const existingAnalysis = await ctx.db
      .query("seoAnalysis")
      .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
      .unique();

    if (existingAnalysis) {
      await ctx.db.patch(existingAnalysis._id, analysis);
      return existingAnalysis._id;
    } else {
      return await ctx.db.insert("seoAnalysis", {
        ...analysis,
        pageId: args.pageId,
      });
    }
  },
});

// Get SEO analysis for a post
export const getPostAnalysis = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("seoAnalysis")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .unique();
  },
});

// Get SEO analysis for a page
export const getPageAnalysis = query({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("seoAnalysis")
      .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
      .unique();
  },
});

// Get SEO overview for all content
export const getOverview = query({
  handler: async (ctx) => {
    const allAnalyses = await ctx.db.query("seoAnalysis").collect();
    
    const averageScore = allAnalyses.length > 0 
      ? allAnalyses.reduce((sum, analysis) => sum + analysis.overallScore, 0) / allAnalyses.length
      : 0;

    const scoreDistribution = {
      excellent: allAnalyses.filter(a => a.overallScore >= 90).length,
      good: allAnalyses.filter(a => a.overallScore >= 70 && a.overallScore < 90).length,
      needs_improvement: allAnalyses.filter(a => a.overallScore >= 50 && a.overallScore < 70).length,
      poor: allAnalyses.filter(a => a.overallScore < 50).length,
    };

    return {
      totalAnalyses: allAnalyses.length,
      averageScore: Math.round(averageScore),
      scoreDistribution,
      recentAnalyses: allAnalyses
        .sort((a, b) => (b._creationTime || 0) - (a._creationTime || 0))
        .slice(0, 10),
    };
  },
});

// Generate sitemap data
export const getSitemapData = query({
  handler: async (ctx) => {
    // Get published posts
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    // Get published pages
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const sitemapEntries = [
      ...posts.map(post => ({
        url: `/${post.slug}`,
        lastModified: new Date(post._creationTime).toISOString(),
        changeFreq: 'weekly' as const,
        priority: 0.8,
      })),
      ...pages.map(page => ({
        url: `/${page.slug}`,
        lastModified: new Date(page._creationTime).toISOString(),
        changeFreq: 'monthly' as const,
        priority: 0.7,
      })),
    ];

    return sitemapEntries;
  },
});

// Generate robots.txt content
export const getRobotsTxt = query({
  handler: async (ctx) => {
    return `User-agent: *
Allow: /

Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/sitemap.xml`;
  },
});

// Helper function to perform SEO analysis
function performSEOAnalysis(content: any, focusKeyword: string) {
  const title = content.title || '';
  const metaDescription = content.metaDescription || '';
  const bodyContent = content.content || '';
  
  // Keyword density calculation
  const keywordCount = (bodyContent.toLowerCase().match(new RegExp(focusKeyword.toLowerCase(), 'g')) || []).length;
  const totalWords = bodyContent.split(/\s+/).length;
  const keywordDensity = totalWords > 0 ? (keywordCount / totalWords) * 100 : 0;

  // Title analysis
  const titleScore = calculateTitleScore(title, focusKeyword);
  
  // Meta description analysis
  const metaDescriptionScore = calculateMetaDescriptionScore(metaDescription, focusKeyword);
  
  // Content analysis
  const contentScore = calculateContentScore(bodyContent, focusKeyword);
  
  // Readability analysis (simplified)
  const readabilityScore = calculateReadabilityScore(bodyContent);
  
  // Overall score calculation
  const overallScore = Math.round(
    (titleScore * 0.25) + 
    (metaDescriptionScore * 0.2) + 
    (contentScore * 0.35) + 
    (readabilityScore * 0.2)
  );

  // Generate suggestions and warnings
  const { suggestions, warnings } = generateSEORecommendations({
    title,
    metaDescription,
    bodyContent,
    focusKeyword,
    keywordDensity,
    titleScore,
    metaDescriptionScore,
    contentScore,
    readabilityScore,
  });

  return {
    focusKeyword,
    keywordDensity: Math.round(keywordDensity * 100) / 100,
    titleScore,
    metaDescriptionScore,
    contentScore,
    readabilityScore,
    overallScore,
    suggestions,
    warnings,
  };
}

function calculateTitleScore(title: string, focusKeyword: string): number {
  let score = 0;
  
  if (title.length >= 30 && title.length <= 60) score += 40;
  else if (title.length > 0) score += 20;
  
  if (title.toLowerCase().includes(focusKeyword.toLowerCase())) score += 40;
  
  if (title.length > 0) score += 20;
  
  return Math.min(score, 100);
}

function calculateMetaDescriptionScore(metaDescription: string, focusKeyword: string): number {
  let score = 0;
  
  if (metaDescription.length >= 120 && metaDescription.length <= 160) score += 50;
  else if (metaDescription.length > 0) score += 25;
  
  if (metaDescription.toLowerCase().includes(focusKeyword.toLowerCase())) score += 30;
  
  if (metaDescription.length > 0) score += 20;
  
  return Math.min(score, 100);
}

function calculateContentScore(content: string, focusKeyword: string): number {
  let score = 0;
  
  if (content.length >= 300) score += 30;
  
  const keywordCount = (content.toLowerCase().match(new RegExp(focusKeyword.toLowerCase(), 'g')) || []).length;
  if (keywordCount >= 2) score += 30;
  
  // Check for headings (simplified)
  if (content.includes('#') || content.includes('<h')) score += 20;
  
  // Check for images (simplified)
  if (content.includes('![') || content.includes('<img')) score += 20;
  
  return Math.min(score, 100);
}

function calculateReadabilityScore(content: string): number {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = content.split(/\s+/).filter(w => w.length > 0);
  
  if (sentences.length === 0 || words.length === 0) return 0;
  
  const avgWordsPerSentence = words.length / sentences.length;
  
  // Simple readability score based on sentence length
  let score = 100;
  if (avgWordsPerSentence > 20) score -= 30;
  else if (avgWordsPerSentence > 15) score -= 15;
  
  return Math.max(score, 0);
}

function generateSEORecommendations(analysis: any) {
  const suggestions: string[] = [];
  const warnings: string[] = [];

  // Title recommendations
  if (analysis.titleScore < 80) {
    if (analysis.title.length < 30) suggestions.push("Consider making your title longer (30-60 characters)");
    if (analysis.title.length > 60) warnings.push("Title is too long, it may be truncated in search results");
    if (!analysis.title.toLowerCase().includes(analysis.focusKeyword.toLowerCase())) {
      suggestions.push("Include your focus keyword in the title");
    }
  }

  // Meta description recommendations
  if (analysis.metaDescriptionScore < 80) {
    if (analysis.metaDescription.length < 120) suggestions.push("Write a longer meta description (120-160 characters)");
    if (analysis.metaDescription.length > 160) warnings.push("Meta description is too long");
    if (!analysis.metaDescription.toLowerCase().includes(analysis.focusKeyword.toLowerCase())) {
      suggestions.push("Include your focus keyword in the meta description");
    }
  }

  // Content recommendations
  if (analysis.contentScore < 80) {
    if (analysis.bodyContent.length < 300) suggestions.push("Add more content - aim for at least 300 words");
    if (analysis.keywordDensity < 0.5) suggestions.push("Use your focus keyword more frequently in the content");
    if (analysis.keywordDensity > 3) warnings.push("Keyword density is too high - avoid keyword stuffing");
  }

  // Readability recommendations
  if (analysis.readabilityScore < 70) {
    suggestions.push("Improve readability by using shorter sentences and paragraphs");
  }

  return { suggestions, warnings };
}