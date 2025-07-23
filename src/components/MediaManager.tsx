import { useState, useRef } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { LoadingState } from "./LoadingSpinner";
import { MediaGrid } from "./media/MediaGrid";
import { MediaDetails } from "./media/MediaDetails";
import { formatFileSize } from "./media/utils";

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


