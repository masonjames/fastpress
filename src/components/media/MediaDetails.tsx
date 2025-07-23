import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { LoadingState } from "../LoadingSpinner";
import { formatFileSize } from "./utils";

interface MediaDetailsProps {
  mediaId: Id<"media">;
  onClose: () => void;
  onAltUpdate: (id: Id<"media">, alt: string) => void;
}

export function MediaDetails({ mediaId, onClose, onAltUpdate }: MediaDetailsProps) {
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