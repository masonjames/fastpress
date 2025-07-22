import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignInForm } from "../SignInForm";
import { PostEditor } from "./PostEditor";
import { PageEditor } from "./PageEditor";
import { CommentModeration } from "./CommentModeration";
import { SEOAnalyzer } from "./SEOAnalyzer";
import { MCPManager } from "./MCPManager";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'posts' | 'comments' | 'seo' | 'mcp'>('posts');
  const [contentType, setContentType] = useState<'posts' | 'pages'>('posts');
  const [editingPost, setEditingPost] = useState<any>(null);
  const user = useQuery(api.auth.loggedInUser);
  const posts = useQuery(api.posts.list, { limit: 50 });
  const pages = useQuery(api.pages.list, { limit: 50 });
  
  const deletePost = useMutation(api.posts.remove);
  const deletePage = useMutation(api.pages.remove);

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
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-yellow-600 text-xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {posts?.filter(p => p.status === 'draft').length || 0}
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
                <p className="text-2xl font-semibold text-gray-900">85/100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'posts', label: 'Posts & Pages', icon: '📝' },
              { id: 'comments', label: 'Comments', icon: '💬' },
              { id: 'seo', label: 'SEO Analysis', icon: '🔍' },
              { id: 'mcp', label: 'AI Integration', icon: '🤖' },
            ].map((tab) => (
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
        {activeTab === 'mcp' && <MCPManager />}
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
  
  const filteredPosts = posts.filter(post => filter === 'all' || post.status === filter);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Posts ({filteredPosts.length})</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="text-xs px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Posts</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
          <option value="private">Private</option>
        </select>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No posts found</p>
            <p className="text-xs mt-1">Create your first post to get started!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
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
  
  const filteredPages = pages.filter(page => filter === 'all' || page.status === filter);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Pages ({filteredPages.length})</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="text-xs px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Pages</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
          <option value="private">Private</option>
        </select>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredPages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No pages found</p>
            <p className="text-xs mt-1">Create your first page to get started!</p>
          </div>
        ) : (
          filteredPages.map((page) => (
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
