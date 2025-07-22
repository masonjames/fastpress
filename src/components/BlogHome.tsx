import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PostCard } from "./PostCard";
import { CategoryList } from "./CategoryList";
import { SearchBox } from "./SearchBox";
import { SEOHead } from "./SEOHead";
import { ErrorBoundary } from "./ErrorBoundary";
import { LoadingState } from "./LoadingSpinner";
import { useState, useMemo, useCallback } from "react";

interface BlogHomeProps {
  navigate: (path: string) => void;
}

export function BlogHome({ navigate }: BlogHomeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const posts = useQuery(api.posts.list, { 
    status: "published", 
    limit: 12,
    categoryId: selectedCategory as any || undefined 
  });
  
  const searchResults = useQuery(
    api.posts.search, 
    searchQuery.length > 2 ? { 
      query: searchQuery,
      categoryId: selectedCategory as any || undefined 
    } : "skip"
  );
  
  const categories = useQuery(api.categories.list);

  const displayPosts = searchQuery.length > 2 ? searchResults : posts;
  
  // Memoize navigation handlers to prevent unnecessary re-renders
  const handlePostClick = useCallback((slug: string) => {
    navigate(`/${slug}`);
  }, [navigate]);
  
  const handleCategoryClick = useCallback((slug: string) => {
    navigate(`/category/${slug}`);
  }, [navigate]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <SEOHead />
      
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-blue-600">FastPress</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Lightning-fast WordPress alternative with built-in SEO optimization, 
          AI content generation, and modern web standards.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
          <SearchBox 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search articles..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {searchQuery.length > 2 && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Search Results for "{searchQuery}"
              </h2>
              {searchResults && searchResults.length === 0 && (
                <p className="text-gray-600">No articles found matching your search.</p>
              )}
            </div>
          )}

          <ErrorBoundary>
            {!displayPosts ? (
              <LoadingState message="Loading posts..." />
            ) : displayPosts.length === 0 ? (
              <div className="text-center py-12">
                {searchQuery.length > 2 ? (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">Try a different search term or browse categories.</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600">Check back soon for new content!</p>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayPosts.map((post) => (
                  <ErrorBoundary key={post._id}>
                    <PostCard 
                      post={post} 
                      onClick={() => handlePostClick(post.slug)}
                    />
                  </ErrorBoundary>
                ))}
              </div>
            )}
          </ErrorBoundary>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <CategoryList 
              categories={categories || []}
              selectedCategory={selectedCategory}
              onCategorySelect={(categoryId) => {
                setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
                setSearchQuery("");
              }}
              onCategoryClick={handleCategoryClick}
            />

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Site Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Posts</span>
                  <span className="font-semibold">{posts?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categories</span>
                  <span className="font-semibold">{categories?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SEO Score</span>
                  <span className="font-semibold text-green-600">95/100</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">✨ Features</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>🚀 Lightning fast performance</li>
                <li>🔍 Advanced SEO optimization</li>
                <li>🤖 AI content generation</li>
                <li>📱 Mobile-first design</li>
                <li>🔗 Built-in MCP support</li>
                <li>📊 Real-time analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
