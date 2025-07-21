interface PostCardProps {
  post: {
    _id: string;
    title: string;
    excerpt?: string;
    content: string;
    publishedAt?: number;
    readingTime?: number;
    tags: string[];
    author?: { name?: string } | null;
    category?: { name: string; slug: string } | null;
    featuredImageUrl?: string | null;
  };
  onClick: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  const excerpt = post.excerpt || post.content.substring(0, 150) + '...';
  const publishDate = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Draft';

  return (
    <article 
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      {post.featuredImageUrl && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={post.featuredImageUrl} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <time dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined}>
            {publishDate}
          </time>
          {post.readingTime && (
            <>
              <span>•</span>
              <span>{post.readingTime} min read</span>
            </>
          )}
          {post.category && (
            <>
              <span>•</span>
              <span className="text-blue-600 font-medium">{post.category.name}</span>
            </>
          )}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {post.title}
        </h2>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {post.author?.name && (
              <span className="text-sm text-gray-500">
                by {post.author.name}
              </span>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className="flex gap-1">
              {post.tags.slice(0, 2).map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{post.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
