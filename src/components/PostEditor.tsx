import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { SEOPreview } from "./SEOPreview";

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
    featuredImageId?: Id<"media">;
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
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Id<"categories">[]>([]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [featuredImageId, setFeaturedImageId] = useState<Id<"media"> | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

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
      setExcerpt(editingPost.excerpt || "");
      setStatus(editingPost.status);
      setTags(editingPost.tags || []);
      setSelectedCategories(editingPost.categories || []);
      setMetaTitle(editingPost.metaTitle || "");
      setMetaDescription(editingPost.metaDescription || "");
      setFocusKeyword(editingPost.focusKeyword || "");
      setFeaturedImageId(editingPost.featuredImageId || null);
    } else {
      // Reset form when not editing
      resetForm();
    }
  }, [editingPost]);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setContent("");
    setExcerpt("");
    setStatus("draft");
    setTags([]);
    setSelectedCategories([]);
    setMetaTitle("");
    setMetaDescription("");
    setFocusKeyword("");
    setFeaturedImageId(null);
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
      const postData = {
        title: title.trim(),
        slug: slug.trim() || generateSlug(title),
        content: content.trim(),
        excerpt: excerpt.trim() || undefined,
        status,
        tags,
        categories: selectedCategories,
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
        focusKeyword: focusKeyword.trim() || undefined,
        featuredImageId: featuredImageId || undefined,
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
        {title && content && (
          <SEOPreview
            title={title}
            metaTitle={metaTitle}
            metaDescription={metaDescription}
            slug={slug || generateSlug(title)}
            focusKeyword={focusKeyword}
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

interface FeaturedImagePickerProps {
  featuredImageId: Id<"media"> | null;
  featuredImage: any;
  onSelect: (id: Id<"media">) => void;
  onRemove: () => void;
}

function FeaturedImagePicker({ featuredImageId, featuredImage, onSelect, onRemove }: FeaturedImagePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="space-y-3">
      {featuredImage && featuredImage.url ? (
        <div className="relative">
          <img
            src={featuredImage.url}
            alt={featuredImage.alt || "Featured image"}
            className="w-full h-48 object-cover rounded-lg border"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              title="Change image"
            >
              ✏️
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              title="Remove image"
            >
              🗑️
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {featuredImage.filename}
          </div>
        </div>
      ) : (
        <div
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50"
          onClick={() => setShowPicker(true)}
        >
          <div className="text-center">
            <div className="text-4xl text-gray-400 mb-2">🖼️</div>
            <p className="text-sm text-gray-600">Click to select a featured image</p>
          </div>
        </div>
      )}

      {showPicker && (
        <MediaPickerModal
          onSelect={(mediaId) => {
            onSelect(mediaId);
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

interface MediaPickerModalProps {
  onSelect: (id: Id<"media">) => void;
  onClose: () => void;
}

function MediaPickerModal({ onSelect, onClose }: MediaPickerModalProps) {
  const media = useQuery(api.media.list, { limit: 50 });
  // Filter images on the client side to ensure reliability
  const imageMedia = media ? {
    ...media,
    items: media.items?.filter(item => item.mimeType?.startsWith('image/')) || []
  } : media;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Select Featured Image</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {imageMedia === undefined ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : imageMedia?.items?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🖼️</div>
              <p>No images found. Upload images in the Media Library first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageMedia?.items?.map((item) => (
                <div
                  key={item._id}
                  className="cursor-pointer border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
                  onClick={() => onSelect(item._id)}
                >
                  <div className="aspect-square">
                    <img
                      src={item.url}
                      alt={item.alt || item.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-600 truncate" title={item.filename}>
                      {item.filename}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

function TagInput({ tags, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = inputValue.trim().toLowerCase();
      
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[2.5rem]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
          >
            <span>#{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-blue-600 focus:outline-none"
              aria-label={`Remove tag ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Add tags..." : ""}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm placeholder-gray-500"
        />
      </div>
      <p className="text-xs text-gray-500">
        Press Enter or comma to add tags. Click × to remove.
        {tags.length > 0 && (
          <span className="ml-2 font-medium">
            ({tags.length} tag{tags.length !== 1 ? 's' : ''})
          </span>
        )}
      </p>
    </div>
  );
}
