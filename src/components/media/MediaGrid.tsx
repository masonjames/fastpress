import { Id } from "../../../convex/_generated/dataModel";
import { MediaItem } from "./MediaItem";

interface MediaGridProps {
  media: any[];
  selectedMedia: Id<"media"> | null;
  onSelect: (id: Id<"media">) => void;
  onDelete: (id: Id<"media">, filename: string) => void;
  onAltUpdate: (id: Id<"media">, alt: string) => void;
}

export function MediaGrid({ media, selectedMedia, onSelect, onDelete, onAltUpdate }: MediaGridProps) {
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