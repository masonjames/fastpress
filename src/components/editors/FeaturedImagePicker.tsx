import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { MediaPickerModal } from "./MediaPickerModal";

interface FeaturedImagePickerProps {
  featuredImageId: Id<"media"> | null;
  featuredImage: any;
  onSelect: (id: Id<"media">) => void;
  onRemove: () => void;
}

export function FeaturedImagePicker({ featuredImageId, featuredImage, onSelect, onRemove }: FeaturedImagePickerProps) {
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