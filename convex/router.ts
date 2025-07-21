import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Generate /LLMs.txt endpoint
http.route({
  path: "/LLMs.txt",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const llmsTxt = await ctx.runQuery(api.seo.generateLLMsTxt);
    
    return new Response(llmsTxt, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  }),
});

// Generate sitemap.xml
http.route({
  path: "/sitemap.xml",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const posts = await ctx.runQuery(api.posts.list, { status: "published", limit: 1000 });
    const categories = await ctx.runQuery(api.categories.list);
    
    const baseUrl = new URL(request.url).origin;
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    // Add posts
    for (const post of posts) {
      const lastmod = post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      sitemap += `
  <url>
    <loc>${baseUrl}/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }

    // Add categories
    for (const category of categories) {
      sitemap += `
  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    }

    sitemap += `
</urlset>`;

    return new Response(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }),
});

// RSS Feed
http.route({
  path: "/feed.xml",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const posts = await ctx.runQuery(api.posts.list, { status: "published", limit: 20 });
    const baseUrl = new URL(request.url).origin;
    
    let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>My WordPress Clone</title>
    <description>A fast, SEO-optimized WordPress alternative</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`;

    for (const post of posts) {
      const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString();
      rss += `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || post.content.substring(0, 200) + '...'}]]></description>
      <link>${baseUrl}/${post.slug}</link>
      <guid>${baseUrl}/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${post.category?.name || 'Uncategorized'}</category>
    </item>`;
    }

    rss += `
  </channel>
</rss>`;

    return new Response(rss, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }),
});

export default http;
