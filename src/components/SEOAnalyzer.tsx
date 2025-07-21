import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function SEOAnalyzer() {
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const [analysisData, setAnalysisData] = useState<any>(null);
  
  const posts = useQuery(api.posts.list, { limit: 50 });
  const analyzeSEO = useMutation(api.seo.analyzeSEO);
  const seoAnalysis = useQuery(
    api.seo.getSEOAnalysis,
    selectedPostId ? { postId: selectedPostId as any } : "skip"
  );

  const handleAnalyze = async () => {
    if (!selectedPostId) {
      toast.error("Please select a post to analyze");
      return;
    }

    const post = posts?.find(p => p._id === selectedPostId);
    if (!post) return;

    try {
      await analyzeSEO({
        postId: selectedPostId as any,
        title: post.title,
        content: post.content,
        metaDescription: post.metaDescription,
        focusKeyword: post.focusKeyword || "blog",
      });
      toast.success("SEO analysis completed!");
    } catch (error) {
      toast.error("Failed to analyze SEO");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">SEO Analysis</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Post to Analyze
            </label>
            <select
              value={selectedPostId}
              onChange={(e) => setSelectedPostId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a post...</option>
              {posts?.map((post) => (
                <option key={post._id} value={post._id}>
                  {post.title} ({post.status})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selectedPostId}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Analyze SEO
          </button>
        </div>
      </div>

      {seoAnalysis && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{seoAnalysis.overallScore}/100</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{seoAnalysis.titleScore}/100</div>
              <div className="text-sm text-gray-600">Title Score</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{seoAnalysis.contentScore}/100</div>
              <div className="text-sm text-gray-600">Content Score</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{seoAnalysis.keywordDensity.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Keyword Density</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">💡 Suggestions</h4>
              <ul className="space-y-2">
                {seoAnalysis.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">⚠️ Warnings</h4>
              <ul className="space-y-2">
                {seoAnalysis.warnings.map((warning: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-yellow-500 mr-2">!</span>
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">🔍 SEO Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <ul className="space-y-2">
            <li>• Use focus keywords in title and first paragraph</li>
            <li>• Keep meta descriptions between 120-160 characters</li>
            <li>• Use heading tags (H1, H2, H3) properly</li>
            <li>• Optimize images with alt text</li>
          </ul>
          <ul className="space-y-2">
            <li>• Maintain keyword density between 1-3%</li>
            <li>• Write for humans, not just search engines</li>
            <li>• Use internal and external links</li>
            <li>• Ensure fast loading times</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
