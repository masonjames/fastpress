import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignInForm } from "../SignInForm";
import { PostEditor } from "./PostEditor";
import { PageEditor } from "./PageEditor";
import { CommentModeration } from "./CommentModeration";
import { SEOAnalyzer } from "./SEOAnalyzer";
import { MCPManager } from "./MCPManager";
import { MediaManager } from "./MediaManager";
import ProfileEditor from "./ProfileEditor";
import React, { useState, useEffect } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'posts' | 'comments' | 'seo' | 'media' | 'mcp' | 'profile' | 'settings'>('posts');
  const [contentType, setContentType] = useState<'posts' | 'pages'>('posts');
  const [editingPost, setEditingPost] = useState<any>(null);
  const user = useQuery(api.auth.loggedInUser);
  const currentUser = useQuery(api.auth.currentUserFull);
  const posts = useQuery(api.posts.list, { limit: 50 });
  const pages = useQuery(api.pages.list, { limit: 50 });
  const comments = useQuery(api.comments.listForAdmin, { limit: 10 });
  const categories = useQuery(api.categories.list);
  
  const deletePost = useMutation(api.posts.remove);
  const deletePage = useMutation(api.pages.remove);

  // Calculate dynamic SEO score
  const calculateSEOScore = () => {
    if (!posts) return 0;
    
    let score = 50; // Base score
    const publishedPosts = posts.filter(p => p.status === 'published');
    
    // Points for published content
    if (publishedPosts.length > 0) score += 10;
    if (publishedPosts.length > 5) score += 10;
    if (publishedPosts.length > 10) score += 10;
    
    // Points for SEO optimization
    const postsWithSEO = publishedPosts.filter(p => p.metaTitle && p.metaDescription);
    const seoOptimizedRatio = postsWithSEO.length / Math.max(publishedPosts.length, 1);
    score += Math.round(seoOptimizedRatio * 20);
    
    return Math.min(score, 100);
  };

  const seoScore = calculateSEOScore();

  // Handle role-based tab access
  useEffect(() => {
    if (currentUser?.roleSlug) {
      const availableTabs = [
        { id: 'posts', roles: ['administrator', 'editor'] },
        { id: 'comments', roles: ['administrator', 'editor'] },
        { id: 'seo', roles: ['administrator', 'editor'] },
        { id: 'media', roles: ['administrator', 'editor'] },
        { id: 'mcp', roles: ['administrator'] },
        { id: 'profile', roles: ['administrator', 'editor'] },
        { id: 'settings', roles: ['administrator'] },
      ];

      const currentTabAllowed = availableTabs.find(tab => 
        tab.id === activeTab && tab.roles.includes(currentUser.roleSlug)
      );

      if (!currentTabAllowed) {
        // Redirect to first available tab
        const firstAvailable = availableTabs.find(tab => 
          tab.roles.includes(currentUser.roleSlug)
        );
        if (firstAvailable) {
          setActiveTab(firstAvailable.id as any);
        }
      }
    }
  }, [currentUser?.roleSlug, activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Unauthenticated>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Sign in to manage your content</p>
          </div>
          <SignInForm />
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || user?.email}!
          </h1>
          <p className="text-gray-600">Manage your content and optimize for SEO</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-semibold text-gray-900">{posts?.length || 0}</p>
                <p className="text-xs text-gray-500">{pages?.length || 0} pages</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {posts?.filter(p => p.status === 'published').length || 0}
                </p>
                <p className="text-xs text-gray-500">
                  {pages?.filter(p => p.status === 'published').length || 0} pages published
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-orange-600 text-xl">💬</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Comments</p>
                <p className="text-2xl font-semibold text-gray-900">{comments?.length || 0}</p>
                <p className="text-xs text-gray-500">
                  {comments?.filter(c => c.status === 'pending').length || 0} pending
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-purple-600 text-xl">🔍</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">SEO Score</p>
                <p className={`text-2xl font-semibold ${
                  seoScore >= 80 ? 'text-green-600' : 
                  seoScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {seoScore}/100
                </p>
                <p className="text-xs text-gray-500">
                  {posts?.filter(p => p.status === 'published' && p.metaTitle && p.metaDescription).length || 0} optimized
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'posts', label: 'Posts & Pages', icon: '📝', roles: ['administrator', 'editor'] },
              { id: 'comments', label: 'Comments', icon: '💬', roles: ['administrator', 'editor'] },
              { id: 'seo', label: 'SEO Analysis', icon: '🔍', roles: ['administrator', 'editor'] },
              { id: 'media', label: 'Media Library', icon: '🖼️', roles: ['administrator', 'editor'] },
              { id: 'mcp', label: 'AI Integration', icon: '🤖', roles: ['administrator'] },
              { id: 'profile', label: 'My Profile', icon: '👤', roles: ['administrator', 'editor'] },
              { id: 'settings', label: 'Settings', icon: '⚙️', roles: ['administrator'] },
            ].filter((tab) => {
              const userRoleSlug = currentUser?.roleSlug;
              return userRoleSlug && tab.roles.includes(userRoleSlug);
            }).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'posts' && (
          <div>
            {/* Content Type Sub-Navigation */}
            <div className="mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setContentType('posts')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    contentType === 'posts'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Posts ({posts?.length || 0})
                </button>
                <button
                  onClick={() => setContentType('pages')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    contentType === 'pages'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Pages ({pages?.length || 0})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {contentType === 'posts' ? (
                  <PostEditor 
                    editingPost={editingPost}
                    onPostSaved={() => setEditingPost(null)}
                    onCancel={() => setEditingPost(null)}
                  />
                ) : (
                  <PageEditor 
                    editingPage={editingPost}
                    onPageSaved={() => setEditingPost(null)}
                    onCancel={() => setEditingPost(null)}
                  />
                )}
              </div>
              <div>
                {contentType === 'posts' ? (
                  <PostsList 
                    posts={posts || []} 
                    onEditPost={setEditingPost}
                    onDeletePost={async (postId) => {
                      if (!confirm("Are you sure you want to delete this post?")) return;
                      try {
                        await deletePost({ id: postId });
                        toast.success("Post deleted successfully");
                      } catch (error) {
                        toast.error("Failed to delete post");
                      }
                    }}
                  />
                ) : (
                  <PagesList 
                    pages={pages || []} 
                    onEditPage={setEditingPost}
                    onDeletePage={async (pageId) => {
                      if (!confirm("Are you sure you want to delete this page?")) return;
                      try {
                        await deletePage({ id: pageId });
                        toast.success("Page deleted successfully");
                      } catch (error) {
                        toast.error("Failed to delete page");
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comments' && <CommentModeration />}
        {activeTab === 'seo' && <SEOAnalyzer />}
        {activeTab === 'media' && <MediaManager />}
        {activeTab === 'mcp' && <MCPManager />}
        {activeTab === 'profile' && <ProfileEditor />}
        {activeTab === 'settings' && <SettingsPanel />}
      </Authenticated>
    </div>
  );
}

interface PostsListProps {
  posts: any[];
  onEditPost: (post: any) => void;
  onDeletePost: (postId: Id<"posts">) => void;
}

function PostsList({ posts, onEditPost, onDeletePost }: PostsListProps) {
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'private'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  
  const filteredPosts = posts.filter(post => filter === 'all' || post.status === filter);
  
  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  // Reset to first page when filter changes
  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">
          Posts ({filteredPosts.length})
          {totalPages > 1 && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              Page {currentPage} of {totalPages}
            </span>
          )}
        </h3>
        <select
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value as any)}
          className="text-xs px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Posts</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
          <option value="private">Private</option>
        </select>
      </div>
      
      <div className="space-y-3">
        {paginatedPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No posts found</p>
            <p className="text-xs mt-1">Create your first post to get started!</p>
          </div>
        ) : (
          paginatedPosts.map((post) => (
            <div key={post._id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate mb-1">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className={`px-2 py-1 rounded-full ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-700'
                        : post.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {post.status}
                    </span>
                    <span>•</span>
                    <span>
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Not published'}
                    </span>
                  </div>
                  {post.excerpt && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => onEditPost(post)}
                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                    title="Edit post"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDeletePost(post._id)}
                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    title="Delete post"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              {/* Quick stats */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>📝 {post.content ? `${Math.ceil(post.content.split(' ').length / 200)} min read` : '0 min'}</span>
                  {post.tags && post.tags.length > 0 && (
                    <span>🏷️ {post.tags.length} tag{post.tags.length !== 1 ? 's' : ''}</span>
                  )}
                  {post.categories && post.categories.length > 0 && (
                    <span>📂 {post.categories.length} categor{post.categories.length !== 1 ? 'ies' : 'y'}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm rounded-lg ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => onEditPost(null)}
          className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium"
        >
          + Create New Post
        </button>
      </div>
    </div>
  );
}

interface PagesListProps {
  pages: any[];
  onEditPage: (page: any) => void;
  onDeletePage: (pageId: Id<"pages">) => void;
}

function PagesList({ pages, onEditPage, onDeletePage }: PagesListProps) {
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'private'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pagesPerPage = 5;
  
  const filteredPages = pages.filter(page => filter === 'all' || page.status === filter);
  
  // Pagination logic
  const totalPages = Math.ceil(filteredPages.length / pagesPerPage);
  const startIndex = (currentPage - 1) * pagesPerPage;
  const paginatedPages = filteredPages.slice(startIndex, startIndex + pagesPerPage);

  // Reset to first page when filter changes
  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">
          Pages ({filteredPages.length})
          {totalPages > 1 && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              Page {currentPage} of {totalPages}
            </span>
          )}
        </h3>
        <select
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value as any)}
          className="text-xs px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Pages</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
          <option value="private">Private</option>
        </select>
      </div>
      
      <div className="space-y-3">
        {paginatedPages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No pages found</p>
            <p className="text-xs mt-1">Create your first page to get started!</p>
          </div>
        ) : (
          paginatedPages.map((page) => (
            <div key={page._id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate mb-1">
                    {page.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className={`px-2 py-1 rounded-full ${
                      page.status === 'published' 
                        ? 'bg-green-100 text-green-700'
                        : page.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {page.status}
                    </span>
                    <span>•</span>
                    <span>/{page.slug}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => onEditPage(page)}
                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                    title="Edit page"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDeletePage(page._id)}
                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    title="Delete page"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              {/* Quick stats */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>📄 Page</span>
                  {page.parent && <span>📂 Has Parent</span>}
                  {page.childCount > 0 && <span>👥 {page.childCount} child{page.childCount !== 1 ? 'ren' : ''}</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm rounded-lg ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => onEditPage(null)}
          className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium"
        >
          + Create New Page
        </button>
      </div>
    </div>
  );
}

function SettingsPanel() {
  const [activeSection, setActiveSection] = useState<'general' | 'seo'>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const allSettings = useQuery(api.siteSettings.getAllSettings, {});
  const saveSettings = useMutation(api.siteSettings.saveMultipleSettings);
  
  const [formData, setFormData] = useState({
    // General Settings
    commentsEnabledGlobally: true,
    siteName: '',
    tagline: '',
    timezone: 'UTC',
    dateFormat: 'F j, Y',
    timeFormat: 'g:i a',
    weekStartsOn: '1',
    
    // SEO Settings
    siteVisibility: 'public',
    defaultMetaTitle: '',
    defaultMetaDescription: '',
    robotsTxt: '',
    llmsTxt: '',
    sitemapEnabled: true,
    rssFeedEnabled: true,
    rssFeedItems: 10,
    organizationName: '',
    twitterCardType: 'summary_large_image',
  });

  // Update form data when settings load
  React.useEffect(() => {
    if (allSettings) {
      setFormData(prev => ({
        ...prev,
        ...allSettings,
        commentsEnabledGlobally: allSettings.commentsEnabledGlobally ?? true,
        sitemapEnabled: allSettings.sitemapEnabled ?? true,
        rssFeedEnabled: allSettings.rssFeedEnabled ?? true,
        rssFeedItems: allSettings.rssFeedItems ?? 10,
        twitterCardType: allSettings.twitterCardType ?? 'summary_large_image',
        siteVisibility: allSettings.siteVisibility ?? 'public',
        weekStartsOn: allSettings.weekStartsOn ?? '1',
        dateFormat: allSettings.dateFormat ?? 'F j, Y',
        timeFormat: allSettings.timeFormat ?? 'g:i a',
        timezone: allSettings.timezone ?? 'UTC',
      }));
    }
  }, [allSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await saveSettings({ settings: formData });
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Settings save failed:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!allSettings) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>
        <p className="text-gray-600 mt-1">Configure your site's general settings and SEO options</p>
      </div>

      {/* Settings Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'general', label: 'General Settings', icon: '⚙️' },
            { id: 'seo', label: 'SEO & Visibility', icon: '🔍' },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === section.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeSection === 'general' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">General Site Settings</h3>
            
            <div className="space-y-6">
              {/* Site Identity */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Site Identity</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                      Site Title
                    </label>
                    <input
                      type="text"
                      id="siteName"
                      name="siteName"
                      value={formData.siteName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your Site Name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">
                      Tagline
                    </label>
                    <input
                      type="text"
                      id="tagline"
                      name="tagline"
                      value={formData.tagline}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Just another WordPress site"
                    />
                    <p className="text-xs text-gray-500 mt-1">In a few words, explain what this site is about.</p>
                  </div>
                </div>
              </div>

              {/* Date/Time Settings */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Date & Time</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="weekStartsOn" className="block text-sm font-medium text-gray-700 mb-1">
                      Week Starts On
                    </label>
                    <select
                      id="weekStartsOn"
                      name="weekStartsOn"
                      value={formData.weekStartsOn}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="0">Sunday</option>
                      <option value="1">Monday</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Comments Settings */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Discussion</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Enable Comments Site-Wide
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        When disabled, comments are hidden on all posts regardless of individual post settings
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="commentsEnabledGlobally"
                        checked={formData.commentsEnabledGlobally}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'seo' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">SEO & Visibility Settings</h3>
            
            <div className="space-y-6">
              {/* Site Visibility */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Site Visibility</h4>
                <div>
                  <label htmlFor="siteVisibility" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Engine Visibility
                  </label>
                  <select
                    id="siteVisibility"
                    name="siteVisibility"
                    value={formData.siteVisibility}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="public">Public (Encourage search engines)</option>
                    <option value="private">Private (Discourage search engines)</option>
                    <option value="maintenance">Maintenance Mode</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Control how search engines index your site.
                  </p>
                </div>
              </div>

              {/* Default SEO Meta */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Default SEO Meta</h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="defaultMetaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Default Meta Title
                    </label>
                    <input
                      type="text"
                      id="defaultMetaTitle"
                      name="defaultMetaTitle"
                      value={formData.defaultMetaTitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Used when posts/pages don't have custom titles"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="defaultMetaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Default Meta Description
                    </label>
                    <textarea
                      id="defaultMetaDescription"
                      name="defaultMetaDescription"
                      value={formData.defaultMetaDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Used when posts/pages don't have custom descriptions"
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
                  </div>
                </div>
              </div>

              {/* Organization Info */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Organization</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      id="organizationName"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your company or organization name"
                    />
                    <p className="text-xs text-gray-500 mt-1">Used for structured data markup</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Social Media</h4>
                <div>
                  <label htmlFor="twitterCardType" className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Card Type
                  </label>
                  <select
                    id="twitterCardType"
                    name="twitterCardType"
                    value={formData.twitterCardType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary with Large Image</option>
                  </select>
                </div>
              </div>

              {/* Sitemaps & Feeds */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Sitemaps & Feeds</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Enable XML Sitemap
                      </label>
                      <p className="text-xs text-gray-500">Helps search engines discover your content</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="sitemapEnabled"
                        checked={formData.sitemapEnabled}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Enable RSS Feed
                      </label>
                      <p className="text-xs text-gray-500">Allow users to subscribe to your content</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="rssFeedEnabled"
                        checked={formData.rssFeedEnabled}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {formData.rssFeedEnabled && (
                    <div>
                      <label htmlFor="rssFeedItems" className="block text-sm font-medium text-gray-700 mb-1">
                        RSS Feed Items
                      </label>
                      <input
                        type="number"
                        id="rssFeedItems"
                        name="rssFeedItems"
                        value={formData.rssFeedItems}
                        onChange={handleInputChange}
                        min="1"
                        max="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Number of recent posts to include in RSS feed (1-50)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Advanced SEO */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Advanced SEO</h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="robotsTxt" className="block text-sm font-medium text-gray-700 mb-1">
                      Robots.txt Content
                    </label>
                    <textarea
                      id="robotsTxt"
                      name="robotsTxt"
                      value={formData.robotsTxt}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                      placeholder={`User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php`}
                    />
                    <p className="text-xs text-gray-500 mt-1">Custom robots.txt content for search engines</p>
                  </div>

                  <div>
                    <label htmlFor="llmsTxt" className="block text-sm font-medium text-gray-700 mb-1">
                      LLMs.txt Content
                    </label>
                    <textarea
                      id="llmsTxt"
                      name="llmsTxt"
                      value={formData.llmsTxt}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                      placeholder={`# This is an LLMs.txt file\n# More info: https://llmstxt.org/\n\n# Scrapers:\nallow: all\n\n# Opt-out:\ncontact: email@example.com`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Instructions for AI/LLM crawlers <a href="https://llmstxt.org/" target="_blank" className="text-blue-600 hover:underline">Learn more</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
