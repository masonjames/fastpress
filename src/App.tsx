import { Authenticated, Unauthenticated } from "convex/react";
import { Routes, Route, useParams, Link } from "react-router-dom";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { BlogHome } from "./components/BlogHome";
import { PostView } from "./components/PostView";
import { CategoryView } from "./components/CategoryView";
import { AdminDashboard } from "./components/AdminDashboard";
import { SEOHead } from "./components/SEOHead";

// Wrapper components for routes with parameters
const CategoryWrapper = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  return <CategoryView categorySlug={categorySlug!} />;
};

const PostWrapper = () => {
  const { postSlug } = useParams<{ postSlug: string }>();
  return <PostView postSlug={postSlug!} />;
};

const AdminWrapper = () => (
  <>
    <Unauthenticated>
      <div className="max-w-md mx-auto mt-20 p-6">
        <SignInForm />
      </div>
    </Unauthenticated>
    <Authenticated>
      <AdminDashboard />
    </Authenticated>
  </>
);

export default function App() {

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEOHead />
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link 
              to="/"
              className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              FastPress
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link 
                to="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/admin"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Admin
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Authenticated>
              <SignOutButton />
            </Authenticated>
            <Unauthenticated>
              <Link 
                to="/admin"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </Unauthenticated>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<BlogHome />} />
          <Route path="/admin" element={<AdminWrapper />} />
          <Route path="/category/:categorySlug" element={<CategoryWrapper />} />
          <Route path="/:postSlug" element={<PostWrapper />} />
        </Routes>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">FastPress</h3>
              <p className="text-gray-400">
                A lightning-fast WordPress alternative with built-in SEO optimization and AI integration.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>SEO Optimization</li>
                <li>AI Content Generation</li>
                <li>Real-time Analytics</li>
                <li>Fast Performance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/sitemap.xml" className="hover:text-white">Sitemap</a></li>
                <li><a href="/feed.xml" className="hover:text-white">RSS Feed</a></li>
                <li><a href="/LLMs.txt" className="hover:text-white">LLMs.txt</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-gray-400">
                Built with Convex and optimized for modern web standards.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FastPress. Built with ❤️ and AI.</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
