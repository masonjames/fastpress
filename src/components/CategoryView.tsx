import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PostCard } from "./PostCard";
import { SEOHead } from "./SEOHead";

interface CategoryViewProps {
  categorySlug: string;
  navigate: (path: string) => void;
}

export function CategoryView({ categorySlug, navigate }: CategoryViewProps) {
  const category = useQuery(api.categories.getBySlug, { slug: categorySlug });
  const posts = useQuery(
    api.categories.getPostsByCategory, 
    category ? { categoryId: category._id, limit: 20 } : "skip"
  );

  if (category === undefined) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (category === null) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
        <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <SEOHead 
        title={category.metaTitle || `${category.name} - FastPress`}
        description={category.metaDescription || category.description || `Browse all posts in ${category.name}`}
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
          <li>Categories</li>
          <li>/</li>
          <li className="text-gray-900">{category.name}</li>
        </ol>
      </nav>

      {/* Category Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {category.description}
          </p>
        )}
        <div className="mt-4 text-sm text-gray-500">
          {posts?.length || 0} {posts?.length === 1 ? 'post' : 'posts'} in this category
        </div>
      </div>

      {/* Posts Grid */}
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard 
              key={post._id} 
              post={post} 
              onClick={() => navigate(`/${post.slug}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts in this category yet</h3>
          <p className="text-gray-600 mb-8">Check back soon for new content!</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Posts
          </button>
        </div>
      )}
    </div>
  );
}
