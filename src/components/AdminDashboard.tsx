import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignInForm } from "../SignInForm";
import { PostEditor } from "./PostEditor";
import { SEOAnalyzer } from "./SEOAnalyzer";
import { MCPManager } from "./MCPManager";
import { useState } from "react";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'posts' | 'seo' | 'mcp'>('posts');
  const user = useQuery(api.auth.loggedInUser);
  const posts = useQuery(api.posts.list, { limit: 50 });

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
              <PostEditor />
            </div>
            <div>
              <PostsList posts={posts || []} />
            </div>
          </div>
        )}

        {activeTab === 'seo' && <SEOAnalyzer />}
        {activeTab === 'mcp' && <MCPManager />}
      </Authenticated>
    </div>
  );
}

function PostsList({ posts }: { posts: any[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Recent Posts</h3>
      <div className="space-y-3">
        {posts.slice(0, 10).map((post) => (
          <div key={post._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {post.title}
              </h4>
              <p className="text-xs text-gray-500">
                {post.status} • {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                post.status === 'published' 
                  ? 'bg-green-100 text-green-700'
                  : post.status === 'draft'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {post.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
