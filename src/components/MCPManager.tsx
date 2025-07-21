import { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function MCPManager() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConnection, setNewConnection] = useState({
    name: "",
    endpoint: "",
    apiKey: "",
    model: "gpt-4o-mini",
    capabilities: ["content-generation", "seo-optimization"]
  });
  const [contentPrompt, setContentPrompt] = useState("");
  const [selectedConnection, setSelectedConnection] = useState("");
  const [contentType, setContentType] = useState<"post" | "page" | "seo">("post");
  const [focusKeyword, setFocusKeyword] = useState("");

  const connections = useQuery(api.mcp.listConnections);
  const createConnection = useMutation(api.mcp.createConnection);
  const generateContent = useAction(api.mcp.generateContent);

  const handleAddConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newConnection.name || !newConnection.endpoint) {
      toast.error("Name and endpoint are required");
      return;
    }

    try {
      await createConnection({
        name: newConnection.name,
        endpoint: newConnection.endpoint,
        apiKey: newConnection.apiKey || undefined,
        model: newConnection.model,
        capabilities: newConnection.capabilities,
      });

      toast.success("MCP connection added successfully!");
      setShowAddForm(false);
      setNewConnection({
        name: "",
        endpoint: "",
        apiKey: "",
        model: "gpt-4o-mini",
        capabilities: ["content-generation", "seo-optimization"]
      });
    } catch (error) {
      toast.error("Failed to add MCP connection");
      console.error(error);
    }
  };

  const handleGenerateContent = async () => {
    if (!selectedConnection || !contentPrompt) {
      toast.error("Please select a connection and enter a prompt");
      return;
    }

    try {
      const result = await generateContent({
        connectionId: selectedConnection as any,
        prompt: contentPrompt,
        contentType,
        focusKeyword: focusKeyword || undefined,
      });

      toast.success("Content generated successfully!");
      console.log("Generated content:", result);
    } catch (error) {
      toast.error("Failed to generate content");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* MCP Connections */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">MCP Connections</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showAddForm ? "Cancel" : "Add Connection"}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddConnection} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connection Name
                </label>
                <input
                  type="text"
                  value={newConnection.name}
                  onChange={(e) => setNewConnection({...newConnection, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="OpenAI GPT-4"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endpoint URL
                </label>
                <input
                  type="url"
                  value={newConnection.endpoint}
                  onChange={(e) => setNewConnection({...newConnection, endpoint: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://api.openai.com/v1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key (Optional)
                </label>
                <input
                  type="password"
                  value={newConnection.apiKey}
                  onChange={(e) => setNewConnection({...newConnection, apiKey: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="sk-..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model
                </label>
                <select
                  value={newConnection.model}
                  onChange={(e) => setNewConnection({...newConnection, model: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Connection
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections?.map((connection) => (
            <div key={connection._id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{connection.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  connection.isActive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {connection.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{connection.model}</p>
              <div className="flex flex-wrap gap-1">
                {connection.capabilities.map((cap) => (
                  <span key={cap} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                    {cap}
                  </span>
                ))}
              </div>
              {connection.lastUsed && (
                <p className="text-xs text-gray-500 mt-2">
                  Last used: {new Date(connection.lastUsed).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>

        {connections?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No MCP connections configured yet.</p>
            <p className="text-sm">Add a connection to start using AI features.</p>
          </div>
        )}
      </div>

      {/* Content Generation */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Content Generation</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MCP Connection
              </label>
              <select
                value={selectedConnection}
                onChange={(e) => setSelectedConnection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select connection...</option>
                {connections?.filter(c => c.isActive).map((connection) => (
                  <option key={connection._id} value={connection._id}>
                    {connection.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="post">Blog Post</option>
                <option value="page">Page</option>
                <option value="seo">SEO Optimization</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Focus Keyword
              </label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="SEO keyword"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Prompt
            </label>
            <textarea
              value={contentPrompt}
              onChange={(e) => setContentPrompt(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe what content you want to generate..."
            />
          </div>

          <button
            onClick={handleGenerateContent}
            disabled={!selectedConnection || !contentPrompt}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Content
          </button>
        </div>
      </div>

      {/* MCP Info */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">🤖 About Model Context Protocol (MCP)</h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            MCP enables seamless integration with AI models for content generation, 
            SEO optimization, and automated writing assistance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="font-medium mb-2">Supported Features:</h4>
              <ul className="space-y-1">
                <li>• AI-powered content generation</li>
                <li>• SEO optimization suggestions</li>
                <li>• Automated meta descriptions</li>
                <li>• Content structure recommendations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Popular Models:</h4>
              <ul className="space-y-1">
                <li>• OpenAI GPT-4 & GPT-3.5</li>
                <li>• Anthropic Claude</li>
                <li>• Google Gemini</li>
                <li>• Local LLMs via Ollama</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
