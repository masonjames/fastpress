import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SEOHead } from "./SEOHead";
import { RelatedPosts } from "./RelatedPosts";
import { CommentList } from "./CommentList";
import { useNavigate } from "react-router-dom";

interface PostViewProps {
  postSlug: string;
}

export function PostView({ postSlug }: PostViewProps) {
  const navigate = useNavigate();
  const post = useQuery(api.posts.getBySlug, { slug: postSlug });

  if (post === undefined) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-8">The post you're looking for doesn't exist.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const publishDate = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Draft';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <SEOHead 
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt}
        keywords={post.tags.join(', ')}
        canonicalUrl={post.canonicalUrl}
        noIndex={post.noIndex}
        noFollow={post.noFollow}
        ogImage={post.featuredImageUrl || undefined}
        postData={post}
      />

      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <button onClick={() => navigate('/')} className="hover:text-gray-700">
              Home
            </button>
          </li>
          <li>/</li>
          {post.category && (
            <>
              <li>
                <button 
                  onClick={() => navigate(`/category/${post.category!.slug}`)}
                  className="hover:text-gray-700"
                >
                  {post.category.name}
                </button>
              </li>
              <li>/</li>
            </>
          )}
          <li className="text-gray-900 truncate">{post.title}</li>
        </ol>
      </nav>

      <article className="prose prose-lg max-w-none">
        {/* Featured Image */}
        {post.featuredImageUrl && (
          <div className="mb-8">
            <img 
              src={post.featuredImageUrl} 
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-sm"
            />
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <time dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined}>
              {publishDate}
            </time>
            {post.readingTime && (
              <>
                <span>•</span>
                <span>{post.readingTime} min read</span>
              </>
            )}
            {post.author?.name && (
              <>
                <span>•</span>
                <span>by {post.author.name}</span>
              </>
            )}
            {post.category && (
              <>
                <span>•</span>
                <button 
                  onClick={() => navigate(`/category/${post.category!.slug}`)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {post.category.name}
                </button>
              </>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
        />
      </article>

      {/* Comments Section */}
      <div className="mt-12 border-t pt-12">
        <CommentList postId={post._id} />
      </div>

      {/* Related Posts */}
      <div className="mt-12 border-t pt-12">
        <RelatedPosts 
          currentPostId={post._id}
          categoryId={post.categoryId}
          navigate={navigate}
        />
      </div>

      {/* Back to Top */}
      <div className="mt-12 text-center">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back to Top
        </button>
      </div>
    </div>
  );
}

function formatContent(content: string): string {
  // Convert markdown-like syntax to HTML
  return content
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.*)$/gim, '<p>$1</p>')
    .replace(/<p><h/g, '<h')
    .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
    .replace(/<p><\/p>/g, '');
}
