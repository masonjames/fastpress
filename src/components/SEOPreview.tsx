interface SEOPreviewProps {
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  slug: string;
  focusKeyword?: string;
  content: string;
}

export function SEOPreview({ 
  title, 
  metaTitle, 
  metaDescription, 
  slug, 
  focusKeyword,
  content 
}: SEOPreviewProps) {
  const displayTitle = metaTitle || title;
  const displayDescription = metaDescription || `${content.slice(0, 150)}...`;
  const displayUrl = `https://yoursite.com/${slug}`;
  
  // Calculate focus keyword density
  const keywordDensity = focusKeyword ? 
    (content.toLowerCase().split(focusKeyword.toLowerCase()).length - 1) / 
    Math.max(content.split(' ').length, 1) * 100 : 0;

  const getTitleStatus = () => {
    if (!displayTitle) return { color: 'text-red-500', message: 'Missing title' };
    if (displayTitle.length < 30) return { color: 'text-yellow-500', message: 'Too short' };
    if (displayTitle.length > 60) return { color: 'text-red-500', message: 'Too long' };
    return { color: 'text-green-500', message: 'Good length' };
  };

  const getDescriptionStatus = () => {
    if (!displayDescription) return { color: 'text-red-500', message: 'Missing description' };
    if (displayDescription.length < 120) return { color: 'text-yellow-500', message: 'Too short' };
    if (displayDescription.length > 160) return { color: 'text-red-500', message: 'Too long' };
    return { color: 'text-green-500', message: 'Good length' };
  };

  const titleStatus = getTitleStatus();
  const descriptionStatus = getDescriptionStatus();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="font-semibold text-gray-900 mb-4">🔍 SEO Preview</h3>
      
      {/* Google Search Preview */}
      <div className="border rounded-lg p-4 bg-gray-50 mb-4">
        <div className="text-xs text-gray-500 mb-1">yoursite.com › {slug}</div>
        <div className="text-lg text-blue-600 hover:underline cursor-pointer mb-1 line-clamp-1">
          {displayTitle}
        </div>
        <div className="text-sm text-gray-600 line-clamp-2">
          {displayDescription}
        </div>
      </div>

      {/* SEO Metrics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700">Title Length:</span>
          <span className={`font-medium ${titleStatus.color}`}>
            {displayTitle.length}/60 - {titleStatus.message}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700">Description Length:</span>
          <span className={`font-medium ${descriptionStatus.color}`}>
            {displayDescription.length}/160 - {descriptionStatus.message}
          </span>
        </div>

        {focusKeyword && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Keyword Density:</span>
            <span className={`font-medium ${
              keywordDensity > 0 && keywordDensity < 3 ? 'text-green-500' :
              keywordDensity >= 3 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {keywordDensity.toFixed(1)}%
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700">URL:</span>
          <span className="text-gray-500 text-xs font-mono">{displayUrl}</span>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-medium text-gray-900 mb-2">💡 Quick Tips:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Include your focus keyword in the title and description</li>
          <li>• Keep title under 60 characters for full display</li>
          <li>• Keep description between 120-160 characters</li>
          {keywordDensity > 3 && (
            <li className="text-yellow-600">• Reduce keyword usage to avoid over-optimization</li>
          )}
        </ul>
      </div>
    </div>
  );
}