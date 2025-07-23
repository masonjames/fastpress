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
import { PostsList } from "./admin/PostsList";
import { PagesList } from "./admin/PagesList";
import { SettingsPanel } from "./admin/SettingsPanel";

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



