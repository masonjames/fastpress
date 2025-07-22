import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  ogImage?: string;
  postData?: any;
}

export function SEOHead({ 
  title, 
  description, 
  keywords, 
  canonicalUrl,
  noIndex = false,
  noFollow = false,
  ogImage,
  postData 
}: SEOHeadProps) {
  const defaultTitle = "FastPress – WordPress reimagined for 2026";
  const defaultDescription = "WordPress reimagined for 2026 – lightning-fast with built-in SEO optimization and AI integration.";
  
  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const currentUrl = window.location.href;

  useEffect(() => {
    // Update document title
    document.title = finalTitle;

    // Update meta tags
    updateMetaTag('description', finalDescription);
    
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Open Graph tags
    updateMetaTag('og:title', finalTitle, 'property');
    updateMetaTag('og:description', finalDescription, 'property');
    updateMetaTag('og:url', currentUrl, 'property');
    updateMetaTag('og:type', postData ? 'article' : 'website', 'property');
    
    if (ogImage) {
      updateMetaTag('og:image', ogImage, 'property');
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', finalTitle, 'name');
    updateMetaTag('twitter:description', finalDescription, 'name');
    
    if (ogImage) {
      updateMetaTag('twitter:image', ogImage, 'name');
    }

    // Canonical URL
    updateLinkTag('canonical', canonicalUrl || currentUrl);

    // Robots meta tag
    const robotsContent = [];
    if (noIndex) robotsContent.push('noindex');
    if (noFollow) robotsContent.push('nofollow');
    if (robotsContent.length === 0) robotsContent.push('index', 'follow');
    
    updateMetaTag('robots', robotsContent.join(', '));

    // Enhanced meta tags
    updateMetaTag('theme-color', '#3B82F6', 'name');
    updateMetaTag('og:site_name', 'FastPress', 'property');
    updateMetaTag('author', postData?.authors?.[0]?.name || 'FastPress', 'name');

    // Article specific tags
    if (postData) {
      updateMetaTag('article:published_time', new Date(postData.publishedAt).toISOString(), 'property');
      updateMetaTag('article:author', postData.authors?.[0]?.name || 'FastPress', 'property');
      
      // Add category as article section
      if (postData.categories && postData.categories.length > 0) {
        updateMetaTag('article:section', postData.categories[0].name || 'General', 'property');
      }

      // Add reading time and word count for better indexing
      if (postData.readTime) {
        updateMetaTag('twitter:label1', 'Reading time', 'name');
        updateMetaTag('twitter:data1', `${postData.readTime} min read`, 'name');
      }
      
      if (postData.tags && postData.tags.length > 0) {
        // Remove existing article:tag meta tags
        const existingTags = document.querySelectorAll('meta[property="article:tag"]');
        existingTags.forEach(tag => tag.remove());
        
        // Add new article:tag meta tags
        postData.tags.forEach((tag: string) => {
          const meta = document.createElement('meta');
          meta.setAttribute('property', 'article:tag');
          meta.setAttribute('content', tag);
          document.head.appendChild(meta);
        });
      }
    }

    // JSON-LD structured data
    updateStructuredData(finalTitle, finalDescription, currentUrl, postData);

  }, [finalTitle, finalDescription, keywords, canonicalUrl, noIndex, noFollow, ogImage, postData, currentUrl]);

  return null;
}

function updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`);
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', href);
}

function updateStructuredData(title: string, description: string, url: string, postData?: any) {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  let structuredData: any;

  if (postData) {
    // Article structured data
    structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "url": url,
      "datePublished": new Date(postData.publishedAt).toISOString(),
      "dateModified": new Date(postData._creationTime).toISOString(),
      "author": {
        "@type": "Person",
        "name": postData.author?.name || "Anonymous"
      },
      "publisher": {
        "@type": "Organization",
        "name": "FastPress",
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/logo.png`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      }
    };

    if (postData.featuredImageUrl) {
      structuredData.image = {
        "@type": "ImageObject",
        "url": postData.featuredImageUrl
      };
    }

    if (postData.category) {
      structuredData.articleSection = postData.category.name;
    }

    if (postData.tags && postData.tags.length > 0) {
      structuredData.keywords = postData.tags.join(', ');
    }
  } else {
    // Website structured data
    structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "FastPress",
      "description": description,
      "url": window.location.origin,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${window.location.origin}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}
