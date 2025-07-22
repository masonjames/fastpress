import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { SEOPreview } from "./SEOPreview";

interface PageEditorProps {
  editingPage?: {
    _id: Id<"pages">;
    title: string;
    slug: string;
    content?: string;
    status: "draft" | "published" | "private";
    parent?: Id<"pages">;
    metaTitle?: string;
    metaDescription?: string;
  };
  onPageSaved?: () => void;
  onCancel?: () => void;
}

export function PageEditor({ editingPage, onPageSaved, onCancel }: PageEditorProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "private">("draft");
  const [parent, setParent] = useState<Id<"pages"> | undefined>(undefined);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const createPage = useMutation(api.pages.create);
  const updatePage = useMutation(api.pages.update);
  const pages = useQuery(api.pages.list, { limit: 100 });

  // Load editing page data
  useEffect(() => {
    if (editingPage) {
      setTitle(editingPage.title);
      setSlug(editingPage.slug);
      setContent(editingPage.content || "");
      setStatus(editingPage.status);
      setParent(editingPage.parent);
      setMetaTitle(editingPage.metaTitle || "");
      setMetaDescription(editingPage.metaDescription || "");
    } else {
      // Reset form when not editing
      resetForm();
    }
  }, [editingPage]);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setContent("");
    setStatus("draft");
    setParent(undefined);
    setMetaTitle("");
    setMetaDescription("");
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      const pageData = {
        title: title.trim(),
        slug: slug.trim() || generateSlug(title),
        content: content.trim(),
        status,
        parent: parent || undefined,
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
      };

      if (editingPage) {
        await updatePage({
          id: editingPage._id,
          ...pageData,
        });
        toast.success("Page updated successfully!");
        onPageSaved?.();
      } else {
        await createPage(pageData);
        toast.success("Page created successfully!");
        resetForm();
      }
    } catch (error) {
      toast.error(editingPage ? "Failed to update page" : "Failed to create page");
      console.error(error);
    }
  };

  // Filter out current page from parent options to prevent circular references
  const parentOptions = pages?.filter(page => page._id !== editingPage?._id) || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {editingPage ? "Edit Page" : "Create New Page"}
        </h2>
        {editingPage && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter page title..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="page-url-slug"
            />
          </div>
        </div>

        {/* Parent Page */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parent Page
          </label>
          <select
            value={parent || ""}
            onChange={(e) => setParent(e.target.value ? e.target.value as Id<"pages"> : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">None (Top Level)</option>
            {parentOptions.map((page) => (
              <option key={page._id} value={page._id}>
                {page.title}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Optional: Set a parent to create a page hierarchy
          </p>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your page content here... (Supports basic Markdown)"
            required
          />
        </div>

        {/* SEO Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="SEO title (50-60 characters)"
                maxLength={60}
              />
              <p className="text-xs text-gray-500 mt-1">
                {metaTitle.length}/60 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="SEO description (120-160 characters)"
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">
                {metaDescription.length}/160 characters
              </p>
            </div>
          </div>
        </div>

        {/* SEO Preview */}
        {title && content && (
          <SEOPreview
            title={title}
            metaTitle={metaTitle}
            metaDescription={metaDescription}
            slug={slug || generateSlug(title)}
            content={content}
          />
        )}

        {/* Status and Submit */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex gap-3">
            {editingPage && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {editingPage ? "Update Page" : "Create Page"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}