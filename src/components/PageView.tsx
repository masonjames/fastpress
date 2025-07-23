import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SEOHead } from "./SEOHead";
import { ErrorBoundary } from "./ErrorBoundary";
import { LoadingState } from "./LoadingSpinner";
import { RenderBlocks } from "../blocks/RenderBlocks";

interface PageViewProps {
  pageSlug: string;
}

export function PageView({ pageSlug }: PageViewProps) {
  const page = useQuery(api.pages.getBySlug, { slug: pageSlug });

  if (page === undefined) {
    return <LoadingState message="Loading page..." />;
  }

  if (page === null) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  // Don't show draft or private pages to non-authenticated users
  if (page.status !== 'published') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Available</h1>
          <p className="text-gray-600 mb-8">
            This page is not currently available for public viewing.
          </p>
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <SEOHead 
          title={page.metaTitle || page.title}
          description={page.metaDescription}
          slug={page.slug}
          type="article"
        />
        
        {/* Breadcrumbs */}
        {page.parent && (
          <nav className="mb-6 text-sm text-gray-600">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="/" className="hover:text-blue-600">Home</a>
              </li>
              <li>/</li>
              {page.parent && (
                <>
                  <li>
                    <a href={`/page/${page.parent.slug}`} className="hover:text-blue-600">
                      {page.parent.title}
                    </a>
                  </li>
                  <li>/</li>
                </>
              )}
              <li className="text-gray-900">{page.title}</li>
            </ol>
          </nav>
        )}

        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              {page.title}
            </h1>
            
            {page.authors && page.authors.length > 0 && (
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <span>By</span>
                  {page.authors.map((author, index) => (
                    <span key={author._id}>
                      {author.name || author.email}
                      {index < page.authors.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </header>

          {/* Render blocks if layout exists, otherwise fall back to content */}
          {page.layout && page.layout.length > 0 ? (
            <RenderBlocks 
              blocks={page.layout} 
              disableContainer={false}
            />
          ) : (
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: page.content?.replace(/\n/g, '<br>') || '' 
              }}
            />
          )}
        </article>

        {/* Child Pages */}
        {page.childPages && page.childPages.length > 0 && (
          <section className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Subpages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {page.childPages.map((childPage) => (
                <div key={childPage._id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    <a 
                      href={`/page/${childPage.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {childPage.title}
                    </a>
                  </h3>
                  {childPage.content && (
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {childPage.content.substring(0, 150)}
                      {childPage.content.length > 150 && '...'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t">
          <a 
            href="/"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </ErrorBoundary>
  );
}