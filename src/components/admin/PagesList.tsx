import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";

interface PagesListProps {
  pages: any[];
  onEditPage: (page: any) => void;
  onDeletePage: (pageId: Id<"pages">) => void;
}

export function PagesList({ pages, onEditPage, onDeletePage }: PagesListProps) {
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