import { useState, useRef } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { LoadingState } from "./LoadingSpinner";

export function MediaManager() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Id<"media"> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const media = useQuery(api.media.list, { 
    limit: 100,
    mimeType: selectedFilter === "all" ? undefined : selectedFilter 
  });
  const mediaStats = useQuery(api.media.getStats);
  
  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const processUpload = useAction(api.media.processUpload);
  const deleteMedia = useMutation(api.media.remove);
  const updateMedia = useMutation(api.media.update);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`"${file.name}" is not an image file`);
          continue;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`"${file.name}" is too large. Maximum size is 10MB.`);
          continue;
        }

        // Generate upload URL
        const uploadUrl = await generateUploadUrl();

        // Upload file
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const { storageId } = await result.json();

        // Process the upload
        await processUpload({
          storageId,
          filename: file.name,
          mimeType: file.type,
          filesize: file.size,
        });

        toast.success(`"${file.name}" uploaded successfully!`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (mediaId: Id<"media">, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteMedia({ id: mediaId });
      toast.success(`"${filename}" deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete media file");
      console.error(error);
    }
  };

  const handleAltUpdate = async (mediaId: Id<"media">, newAlt: string) => {
    try {
      await updateMedia({ id: mediaId, alt: newAlt });
      toast.success("Alt text updated successfully");
    } catch (error) {
      toast.error("Failed to update alt text");
      console.error(error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (media === undefined || mediaStats === undefined) {
    return <LoadingState message="Loading media library..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Upload */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Uploading..." : "Upload Images"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-gray-900">{mediaStats.total}</div>
          <div className="text-sm text-gray-600">Total Files</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">{mediaStats.images}</div>
          <div className="text-sm text-gray-600">Images</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">{formatFileSize(mediaStats.totalSize)}</div>
          <div className="text-sm text-gray-600">Total Size</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">{mediaStats.videos + mediaStats.documents}</div>
          <div className="text-sm text-gray-600">Other Files</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Filter Media</h3>
          <div className="flex items-center gap-2">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Files</option>
              <option value="image/">Images</option>
              <option value="video/">Videos</option>
              <option value="audio/">Audio</option>
            </select>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <MediaGrid 
        media={media?.items || []}
        selectedMedia={selectedMedia}
        onSelect={setSelectedMedia}
        onDelete={handleDelete}
        onAltUpdate={handleAltUpdate}
      />

      {/* Selected Media Details */}
      {selectedMedia && (
        <MediaDetails 
          mediaId={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onAltUpdate={handleAltUpdate}
        />
      )}
    </div>
  );
}

interface MediaGridProps {
  media: any[];
  selectedMedia: Id<"media"> | null;
  onSelect: (id: Id<"media">) => void;
  onDelete: (id: Id<"media">, filename: string) => void;
  onAltUpdate: (id: Id<"media">, alt: string) => void;
}

function MediaGrid({ media, selectedMedia, onSelect, onDelete, onAltUpdate }: MediaGridProps) {
  if (media.length === 0) {
    return (
      <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
        <div className="text-gray-500">
          <div className="text-6xl mb-4">🖼️</div>
          <h3 className="text-lg font-medium mb-2">No media files found</h3>
          <p>Upload images to get started with your media library.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {media.map((item) => (
        <MediaItem
          key={item._id}
          media={item}
          isSelected={selectedMedia === item._id}
          onSelect={() => onSelect(item._id)}
          onDelete={() => onDelete(item._id, item.filename)}
          onAltUpdate={(alt) => onAltUpdate(item._id, alt)}
        />
      ))}
    </div>
  );
}

interface MediaItemProps {
  media: any;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onAltUpdate: (alt: string) => void;
}

function MediaItem({ media, isSelected, onSelect, onDelete }: MediaItemProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
        isSelected 
          ? 'border-blue-500 shadow-lg' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Image/File Preview */}
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {media.mimeType.startsWith('image/') && media.url ? (
          <img
            src={media.url}
            alt={media.alt || media.filename}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="text-4xl text-gray-400">📄</div>
        )}
      </div>

      {/* Overlay with actions */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          title="Delete"
        >
          🗑️
        </button>
      </div>

      {/* File info */}
      <div className="p-2 bg-white border-t">
        <div className="text-xs font-medium text-gray-900 truncate" title={media.filename}>
          {media.filename}
        </div>
        <div className="text-xs text-gray-500">
          {formatFileSize(media.filesize)}
        </div>
      </div>
    </div>
  );
}

interface MediaDetailsProps {
  mediaId: Id<"media">;
  onClose: () => void;
  onAltUpdate: (id: Id<"media">, alt: string) => void;
}

function MediaDetails({ mediaId, onClose, onAltUpdate }: MediaDetailsProps) {
  const [altText, setAltText] = useState("");
  const media = useQuery(api.media.getById, { id: mediaId });

  if (media === undefined) {
    return <LoadingState message="Loading media details..." />;
  }

  if (media === null) {
    return null;
  }

  const handleAltSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAltUpdate(mediaId, altText);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Media Details</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Preview */}
            <div>
              {media.mimeType.startsWith('image/') && media.url ? (
                <img
                  src={media.url}
                  alt={media.alt || media.filename}
                  className="w-full h-auto rounded-lg shadow-sm border"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-6xl text-gray-400">📄</div>
                </div>
              )}
            </div>

            {/* Details and Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filename
                </label>
                <div className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                  {media.filename}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Size
                </label>
                <div className="text-sm text-gray-900">
                  {formatFileSize(media.filesize)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <div className="text-sm text-gray-900">
                  {media.mimeType}
                </div>
              </div>

              {media.width && media.height && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dimensions
                  </label>
                  <div className="text-sm text-gray-900">
                    {media.width} × {media.height} pixels
                  </div>
                </div>
              )}

              <form onSubmit={handleAltSubmit}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text
                </label>
                <textarea
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder={media.alt || "Describe this image..."}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Update Alt Text
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}