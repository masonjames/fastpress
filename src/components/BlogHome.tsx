import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PostCard } from "./PostCard";
import { CategoryList } from "./CategoryList";
import { SearchBox } from "./SearchBox";
import { SEOHead } from "./SEOHead";
import { useState } from "react";

interface BlogHomeProps {
  navigate: (path: string) => void;
}

export function BlogHome({ navigate }: BlogHomeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  
  const posts = useQuery(api.posts.list, { 
    status: "published", 
    limit: 12,
    categoryId: selectedCategory as any || undefined,
    tag: selectedTag || undefined,
    sortBy: sortBy
  });
  
  const searchResults = useQuery(
    api.posts.search, 
    searchQuery.length > 2 ? { 
      query: searchQuery,
      categoryId: selectedCategory as any || undefined,
      sortBy: sortBy === "date" ? "date" : sortBy === "title" ? "title" : "relevance"
    } : "skip"
  );
  
  const categories = useQuery(api.categories.list);
  const tags = useQuery(api.posts.getAllTags);

  const displayPosts = searchQuery.length > 2 ? searchResults : posts;

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
          {/* Results Header */}
          <div className="mb-6">
            {searchQuery.length > 2 ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Search Results for "{searchQuery}"
                </h2>
                <p className="text-gray-600">
                  {searchResults?.length || 0} article{searchResults?.length !== 1 ? 's' : ''} found
                  {selectedCategory && <span> in selected category</span>}
                </p>
              </div>
            ) : (selectedCategory || selectedTag) ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Filtered Posts
                </h2>
                <p className="text-gray-600">
                  {displayPosts?.length || 0} article{displayPosts?.length !== 1 ? 's' : ''} found
                  {selectedTag && <span> with tag "{selectedTag}"</span>}
                  {selectedCategory && <span> in selected category</span>}
                </p>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayPosts?.map((post) => (
              <PostCard 
                key={post._id} 
                post={post} 
                onClick={() => navigate(`/${post.slug}`)}
              />
            ))}
          </div>

          {displayPosts && displayPosts.length === 0 && !searchQuery && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">Check back soon for new content!</p>
            </div>
          )}
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
                setSelectedTag(null); // Reset tag when category changes
              }}
              onCategoryClick={(slug) => navigate(`/category/${slug}`)}
            />

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Filters & Sort</h3>
              
              <div className="space-y-4">
                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "date" | "title")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="date">Latest First</option>
                    <option value="title">Alphabetical</option>
                  </select>
                </div>

                {/* Tag Filter */}
                {tags && tags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Tag
                    </label>
                    <select
                      value={selectedTag || ""}
                      onChange={(e) => {
                        setSelectedTag(e.target.value || null);
                        setSearchQuery(""); // Reset search when tag changes
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Tags</option>
                      {tags.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Clear Filters */}
                {(selectedCategory || selectedTag) && (
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedTag(null);
                      setSearchQuery("");
                    }}
                    className="w-full px-3 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>

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
