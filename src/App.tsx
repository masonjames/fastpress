import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { BlogHome } from "./components/BlogHome";
import { PostView } from "./components/PostView";
import { CategoryView } from "./components/CategoryView";
import { AdminDashboard } from "./components/AdminDashboard";
import { SEOHead } from "./components/SEOHead";
import { useState, useEffect } from "react";

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    setSearchParams(new URLSearchParams());
  };

  const renderContent = () => {
    if (currentPath === '/admin') {
      return <AdminDashboard />;
    }
    
    if (currentPath.startsWith('/category/')) {
      const categorySlug = currentPath.split('/category/')[1];
      return <CategoryView categorySlug={categorySlug} navigate={navigate} />;
    }
    
    if (currentPath !== '/' && currentPath !== '') {
      const postSlug = currentPath.substring(1);
      return <PostView postSlug={postSlug} navigate={navigate} />;
    }
    
    return <BlogHome navigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEOHead />
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              FastPress
            </button>
            <nav className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => navigate('/admin')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Admin
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Authenticated>
              <SignOutButton />
            </Authenticated>
            <Unauthenticated>
              <button 
                onClick={() => navigate('/admin')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            </Unauthenticated>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Unauthenticated>
          {currentPath === '/admin' ? (
            <div className="max-w-md mx-auto mt-20 p-6">
              <SignInForm />
            </div>
          ) : (
            renderContent()
          )}
        </Unauthenticated>
        
        <Authenticated>
          {renderContent()}
        </Authenticated>
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
