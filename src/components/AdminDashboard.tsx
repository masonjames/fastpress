import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignInForm } from "../SignInForm";
import { PostEditor } from "./PostEditor";
import { SEOAnalyzer } from "./SEOAnalyzer";
import { MCPManager } from "./MCPManager";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'posts' | 'seo' | 'mcp'>('posts');
  const [editingPost, setEditingPost] = useState<any>(null);
  const user = useQuery(api.auth.loggedInUser);
  const posts = useQuery(api.posts.list, { limit: 50 });
  const deletePost = useMutation(api.posts.remove);

  const handleEditPost = (post: any) => {
    setEditingPost(post);
  };

  const handleDeletePost = async (postId: Id<"posts">) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }
    
    try {
      await deletePost({ id: postId });
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post");
      console.error(error);
    }
  };

  const handlePostSaved = () => {
    setEditingPost(null);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

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

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'posts', label: 'Posts & Pages', icon: '📝' },
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PostEditor 
                editingPost={editingPost}
                onPostSaved={handlePostSaved}
                onCancel={handleCancelEdit}
              />
            </div>
            <div>
              <PostsList 
                posts={posts || []} 
                onEditPost={handleEditPost}
                onDeletePost={handleDeletePost}
              />
            </div>
          </div>
        )}

        {activeTab === 'seo' && <SEOAnalyzer />}
        {activeTab === 'mcp' && <MCPManager />}
      </Authenticated>
    </div>
  );
}

function PostsList({ 
  posts, 
  onEditPost, 
  onDeletePost 
}: { 
  posts: any[]; 
  onEditPost: (post: any) => void;
  onDeletePost: (postId: Id<"posts">) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Recent Posts</h3>
      <div className="space-y-3">
        {posts.slice(0, 10).map((post) => (
          <div key={post._id} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {post.title}
                </h4>
                <p className="text-xs text-gray-500">
                  {post.status} • {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                post.status === 'published' 
                  ? 'bg-green-100 text-green-700'
                  : post.status === 'draft'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {post.status}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => onEditPost(post)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Edit
              </button>
              <span className="text-xs text-gray-300">•</span>
              <button
                onClick={() => onDeletePost(post._id)}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
