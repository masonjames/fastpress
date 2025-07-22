import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface PostEditorProps {
  editingPost?: {
    _id: Id<"posts">;
    title: string;
    slug: string;
    content?: string;
    excerpt?: string;
    status: "draft" | "published" | "private";
    tags?: string[];
    categories?: Id<"categories">[];
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
  };
  onPostSaved?: () => void;
  onCancel?: () => void;
}

export function PostEditor({ editingPost, onPostSaved, onCancel }: PostEditorProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "private">("draft");
  const [tags, setTags] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Id<"categories">[]>([]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");

  const createPost = useMutation(api.posts.create);
  const updatePost = useMutation(api.posts.update);
  const categories = useQuery(api.categories.list);

  // Load editing post data
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setSlug(editingPost.slug);
      setContent(editingPost.content || "");
      setExcerpt(editingPost.excerpt || "");
      setStatus(editingPost.status);
      setTags(editingPost.tags?.join(", ") || "");
      setSelectedCategories(editingPost.categories || []);
      setMetaTitle(editingPost.metaTitle || "");
      setMetaDescription(editingPost.metaDescription || "");
      setFocusKeyword(editingPost.focusKeyword || "");
    }
  }, [editingPost]);

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

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setContent("");
    setExcerpt("");
    setStatus("draft");
    setTags("");
    setSelectedCategories([]);
    setMetaTitle("");
    setMetaDescription("");
    setFocusKeyword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      const postData = {
        title: title.trim(),
        slug: slug.trim() || generateSlug(title),
        content: content.trim(),
        excerpt: excerpt.trim() || undefined,
        status,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        categories: selectedCategories,
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
        focusKeyword: focusKeyword.trim() || undefined,
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
            placeholder="Write your post content here... (Supports basic Markdown)"
            required
          />
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
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate tags with commas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <select
                multiple
                value={selectedCategories}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value as Id<"categories">);
                  setSelectedCategories(values);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              >
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.parent ? `• ${category.name}` : category.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Hold Ctrl/Cmd to select multiple categories
              </p>
            </div>
          </div>
        </div>

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
