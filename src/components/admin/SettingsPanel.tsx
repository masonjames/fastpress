import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";

export function SettingsPanel() {
  const [activeSection, setActiveSection] = useState<'general' | 'seo'>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const allSettings = useQuery(api.siteSettings.getAllSettings, {});
  const saveSettings = useMutation(api.siteSettings.saveMultipleSettings);
  
  const [formData, setFormData] = useState({
    // General Settings
    commentsEnabledGlobally: true,
    siteName: '',
    tagline: '',
    timezone: 'UTC',
    dateFormat: 'F j, Y',
    timeFormat: 'g:i a',
    weekStartsOn: '1',
    
    // SEO Settings
    siteVisibility: 'public',
    defaultMetaTitle: '',
    defaultMetaDescription: '',
    robotsTxt: '',
    llmsTxt: '',
    sitemapEnabled: true,
    rssFeedEnabled: true,
    rssFeedItems: 10,
    organizationName: '',
    twitterCardType: 'summary_large_image',
  });

  // Update form data when settings load
  React.useEffect(() => {
    if (allSettings) {
      setFormData(prev => ({
        ...prev,
        ...allSettings,
        commentsEnabledGlobally: allSettings.commentsEnabledGlobally ?? true,
        sitemapEnabled: allSettings.sitemapEnabled ?? true,
        rssFeedEnabled: allSettings.rssFeedEnabled ?? true,
        rssFeedItems: allSettings.rssFeedItems ?? 10,
        twitterCardType: allSettings.twitterCardType ?? 'summary_large_image',
        siteVisibility: allSettings.siteVisibility ?? 'public',
        weekStartsOn: allSettings.weekStartsOn ?? '1',
        dateFormat: allSettings.dateFormat ?? 'F j, Y',
        timeFormat: allSettings.timeFormat ?? 'g:i a',
        timezone: allSettings.timezone ?? 'UTC',
      }));
    }
  }, [allSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await saveSettings({ settings: formData });
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Settings save failed:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!allSettings) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>
        <p className="text-gray-600 mt-1">Configure your site's general settings and SEO options</p>
      </div>

      {/* Settings Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'general', label: 'General Settings', icon: '⚙️' },
            { id: 'seo', label: 'SEO & Visibility', icon: '🔍' },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === section.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeSection === 'general' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">General Site Settings</h3>
            
            <div className="space-y-6">
              {/* Site Identity */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Site Identity</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                      Site Title
                    </label>
                    <input
                      type="text"
                      id="siteName"
                      name="siteName"
                      value={formData.siteName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your Site Name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">
                      Tagline
                    </label>
                    <input
                      type="text"
                      id="tagline"
                      name="tagline"
                      value={formData.tagline}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Just another WordPress site"
                    />
                    <p className="text-xs text-gray-500 mt-1">In a few words, explain what this site is about.</p>
                  </div>
                </div>
              </div>

              {/* Date/Time Settings */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Date & Time</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="weekStartsOn" className="block text-sm font-medium text-gray-700 mb-1">
                      Week Starts On
                    </label>
                    <select
                      id="weekStartsOn"
                      name="weekStartsOn"
                      value={formData.weekStartsOn}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="0">Sunday</option>
                      <option value="1">Monday</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Comments Settings */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Discussion</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Enable Comments Site-Wide
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        When disabled, comments are hidden on all posts regardless of individual post settings
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="commentsEnabledGlobally"
                        checked={formData.commentsEnabledGlobally}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'seo' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">SEO & Visibility Settings</h3>
            
            <div className="space-y-6">
              {/* Site Visibility */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Site Visibility</h4>
                <div>
                  <label htmlFor="siteVisibility" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Engine Visibility
                  </label>
                  <select
                    id="siteVisibility"
                    name="siteVisibility"
                    value={formData.siteVisibility}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="public">Public (Encourage search engines)</option>
                    <option value="private">Private (Discourage search engines)</option>
                    <option value="maintenance">Maintenance Mode</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Control how search engines index your site.
                  </p>
                </div>
              </div>

              {/* Default SEO Meta */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Default SEO Meta</h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="defaultMetaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Default Meta Title
                    </label>
                    <input
                      type="text"
                      id="defaultMetaTitle"
                      name="defaultMetaTitle"
                      value={formData.defaultMetaTitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Used when posts/pages don't have custom titles"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="defaultMetaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Default Meta Description
                    </label>
                    <textarea
                      id="defaultMetaDescription"
                      name="defaultMetaDescription"
                      value={formData.defaultMetaDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Used when posts/pages don't have custom descriptions"
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
                  </div>
                </div>
              </div>

              {/* Organization Info */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Organization</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      id="organizationName"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your company or organization name"
                    />
                    <p className="text-xs text-gray-500 mt-1">Used for structured data markup</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Social Media</h4>
                <div>
                  <label htmlFor="twitterCardType" className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Card Type
                  </label>
                  <select
                    id="twitterCardType"
                    name="twitterCardType"
                    value={formData.twitterCardType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary with Large Image</option>
                  </select>
                </div>
              </div>

              {/* Sitemaps & Feeds */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Sitemaps & Feeds</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Enable XML Sitemap
                      </label>
                      <p className="text-xs text-gray-500">Helps search engines discover your content</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="sitemapEnabled"
                        checked={formData.sitemapEnabled}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Enable RSS Feed
                      </label>
                      <p className="text-xs text-gray-500">Allow users to subscribe to your content</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="rssFeedEnabled"
                        checked={formData.rssFeedEnabled}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {formData.rssFeedEnabled && (
                    <div>
                      <label htmlFor="rssFeedItems" className="block text-sm font-medium text-gray-700 mb-1">
                        RSS Feed Items
                      </label>
                      <input
                        type="number"
                        id="rssFeedItems"
                        name="rssFeedItems"
                        value={formData.rssFeedItems}
                        onChange={handleInputChange}
                        min="1"
                        max="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Number of recent posts to include in RSS feed (1-50)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Advanced SEO */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Advanced SEO</h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="robotsTxt" className="block text-sm font-medium text-gray-700 mb-1">
                      Robots.txt Content
                    </label>
                    <textarea
                      id="robotsTxt"
                      name="robotsTxt"
                      value={formData.robotsTxt}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                      placeholder={`User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php`}
                    />
                    <p className="text-xs text-gray-500 mt-1">Custom robots.txt content for search engines</p>
                  </div>

                  <div>
                    <label htmlFor="llmsTxt" className="block text-sm font-medium text-gray-700 mb-1">
                      LLMs.txt Content
                    </label>
                    <textarea
                      id="llmsTxt"
                      name="llmsTxt"
                      value={formData.llmsTxt}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                      placeholder={`# This is an LLMs.txt file\n# More info: https://llmstxt.org/\n\n# Scrapers:\nallow: all\n\n# Opt-out:\ncontact: email@example.com`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Instructions for AI/LLM crawlers <a href="https://llmstxt.org/" target="_blank" className="text-blue-600 hover:underline">Learn more</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}