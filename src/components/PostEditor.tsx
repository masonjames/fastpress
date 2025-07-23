import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { SEOPreview } from "./SEOPreview";
import { TagInput } from "./editors/TagInput";
import { FeaturedImagePicker } from "./editors/FeaturedImagePicker";
import { BlockArrayField } from "./BlockArrayField";

interface PostEditorProps {
  editingPost?: {
    _id: Id<"posts">;
    title: string;
    slug: string;
    content?: string;
    layout?: any[];
    excerpt?: string;
    status: "draft" | "published" | "private";
    tags?: string[];
    categories?: Id<"categories">[];
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
    featuredImageId?: Id<"media">;
    commentsEnabled?: boolean;
  };
  onPostSaved?: () => void;
  onCancel?: () => void;
}

export function PostEditor({ editingPost, onPostSaved, onCancel }: PostEditorProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [layout, setLayout] = useState<any[]>([]);
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "private">("draft");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Id<"categories">[]>([]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [featuredImageId, setFeaturedImageId] = useState<Id<"media"> | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [commentsEnabled, setCommentsEnabled] = useState(true);

  const createPost = useMutation(api.posts.create);
  const updatePost = useMutation(api.posts.update);
  const categories = useQuery(api.categories.list);
  const featuredImage = useQuery(api.media.getById, featuredImageId ? { id: featuredImageId } : "skip");

  // Load editing post data
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setSlug(editingPost.slug);
      setContent(editingPost.content || "");
      setLayout(editingPost.layout || []);
      setExcerpt(editingPost.excerpt || "");
      setStatus(editingPost.status);
      setTags(editingPost.tags || []);
      setSelectedCategories(editingPost.categories || []);
      setMetaTitle(editingPost.metaTitle || "");
      setMetaDescription(editingPost.metaDescription || "");
      setFocusKeyword(editingPost.focusKeyword || "");
      setFeaturedImageId(editingPost.featuredImageId || null);
      setCommentsEnabled(editingPost.commentsEnabled ?? true);
    } else {
      // Reset form when not editing
      resetForm();
    }
  }, [editingPost]);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setContent("");
    setLayout([]);
    setExcerpt("");
    setStatus("draft");
    setTags([]);
    setSelectedCategories([]);
    setMetaTitle("");
    setMetaDescription("");
    setFocusKeyword("");
    setFeaturedImageId(null);
    setCommentsEnabled(true);
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
    
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    // Require either content or layout blocks
    if (!content.trim() && (!layout || layout.length === 0)) {
      toast.error("Content or blocks are required");
      return;
    }

    try {
      const postData = {
        title: title.trim(),
        slug: slug.trim() || generateSlug(title),
        content: content.trim() || undefined,
        layout: layout.length > 0 ? layout : undefined,
        excerpt: excerpt.trim() || undefined,
        status,
        tags,
        categories: selectedCategories,
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
        focusKeyword: focusKeyword.trim() || undefined,
        featuredImageId: featuredImageId || undefined,
        commentsEnabled,
      };


      if (editingPost) {
        await updatePost({
          id: editingPost._id,
          ...postData,
        });
        toast.success("Post updated successfully!");
        onPostSaved?.();
      } else {
        await createPost(postData);
        toast.success("Post created successfully!");
        resetForm();
      }
    } catch (error) {
      toast.error(editingPost ? "Failed to update post" : "Failed to create post");
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {editingPost ? "Edit Post" : "Create New Post"}
        </h2>
        {editingPost && onCancel && (
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
              placeholder="Enter post title..."
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
              placeholder="post-url-slug"
            />
          </div>
        </div>

        {/* Content - Block Editor */}
        <div>
          <BlockArrayField
            label="Post Content"
            value={layout}
            onChange={setLayout}
          />
          
          {/* Legacy content fallback */}
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Legacy Content (Markdown)
              </label>
              <span className="text-xs text-gray-500">
                Optional fallback for compatibility
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Legacy content (used when no blocks are present)"
            />
            <p className="text-xs text-gray-500 mt-1">
              This content will only be shown if no blocks are added above
            </p>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief description of the post..."
          />
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
          </label>
          <FeaturedImagePicker
            featuredImageId={featuredImageId}
            featuredImage={featuredImage}
            onSelect={setFeaturedImageId}
            onRemove={() => setFeaturedImageId(null)}
          />
        </div>

        {/* SEO Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Focus Keyword
              </label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Main keyword for SEO optimization"
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <TagInput tags={tags} onChange={setTags} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 max-h-40 overflow-y-auto">
                {categories && categories.length > 0 ? (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category._id} className="flex items-center cursor-pointer hover:bg-gray-100 rounded p-2">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, category._id]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(id => id !== category._id));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {category.parent ? `• ${category.name}` : category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No categories available</p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Select one or more categories for this post
                {selectedCategories.length > 0 && (
                  <span className="ml-2 font-medium">
                    ({selectedCategories.length} selected)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* SEO Preview */}
        {title && (layout.length > 0 || content) && (
          <SEOPreview
            title={title}
            metaTitle={metaTitle}
            metaDescription={metaDescription}
            slug={slug || generateSlug(title)}
            focusKeyword={focusKeyword}
            content={content || (layout.length > 0 ? 'Block-based content' : '')}
          />
        )}

        {/* Settings and Submit */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center gap-6">
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
            
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={commentsEnabled}
                  onChange={(e) => setCommentsEnabled(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Enable Comments
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Allow readers to comment on this post
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {editingPost && onCancel && (
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
              {editingPost ? "Update Post" : "Create Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}



