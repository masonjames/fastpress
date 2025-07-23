import { formatFileSize } from "./utils";

interface MediaItemProps {
  media: any;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onAltUpdate: (alt: string) => void;
}

export function MediaItem({ media, isSelected, onSelect, onDelete }: MediaItemProps) {
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