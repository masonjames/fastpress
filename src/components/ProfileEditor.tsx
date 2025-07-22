import React, { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { toast } from 'sonner';

const ProfileEditor: React.FC = () => {
  const currentUser = useQuery(api.auth.currentUserFull);
  const updateProfile = useMutation(api.users.updateProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  
  // Avatar image display
  const avatarMedia = useQuery(
    api.media.getById, 
    currentUser?.profile?.avatarId ? { id: currentUser.profile.avatarId } : 'skip'
  );
  
  // Get media for picker
  const mediaItems = useQuery(api.media.list);

  const [formData, setFormData] = useState({
    display_name: currentUser?.profile?.display_name || '',
    first_name: currentUser?.profile?.first_name || '',
    last_name: currentUser?.profile?.last_name || '',
    bio: currentUser?.profile?.bio || '',
    user_url: currentUser?.profile?.user_url || '',
    avatarId: currentUser?.profile?.avatarId || undefined,
  });

  // Update form when user data loads
  React.useEffect(() => {
    if (currentUser?.profile) {
      setFormData({
        display_name: currentUser.profile.display_name || '',
        first_name: currentUser.profile.first_name || '',
        last_name: currentUser.profile.last_name || '',
        bio: currentUser.profile.bio || '',
        user_url: currentUser.profile.user_url || '',
        avatarId: currentUser.profile.avatarId || undefined,
      });
    }
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Filter out empty strings to undefined for optional fields
      const updateData = {
        display_name: formData.display_name || undefined,
        first_name: formData.first_name || undefined,
        last_name: formData.last_name || undefined,
        bio: formData.bio || undefined,
        user_url: formData.user_url || undefined,
        avatarId: formData.avatarId || undefined,
      };

      await updateProfile(updateData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarSelect = (mediaId: Id<'media'>) => {
    setFormData(prev => ({
      ...prev,
      avatarId: mediaId
    }));
    setShowMediaPicker(false);
  };

  const removeAvatar = () => {
    setFormData(prev => ({
      ...prev,
      avatarId: undefined
    }));
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <p className="text-gray-600 mt-1">Manage your account settings and profile information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Profile Avatar</label>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {avatarMedia?.url ? (
                <img 
                  src={avatarMedia.url} 
                  alt="Profile avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-2xl font-bold">
                  {formData.display_name?.charAt(0)?.toUpperCase() || 
                   currentUser.profile?.user_login?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowMediaPicker(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Choose Avatar
              </button>
              {formData.avatarId && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Remove Avatar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your first name"
            />
          </div>
          
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your last name"
            />
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-1">
            Display Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="display_name"
            name="display_name"
            value={formData.display_name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="How your name appears publicly"
          />
          <p className="text-xs text-gray-500 mt-1">This is how your name will appear on posts and comments</p>
        </div>

        {/* Website URL */}
        <div>
          <label htmlFor="user_url" className="block text-sm font-medium text-gray-700 mb-1">
            Website URL
          </label>
          <input
            type="url"
            id="user_url"
            name="user_url"
            value={formData.user_url}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://your-website.com"
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Biographical Info
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Share a little about yourself..."
          />
          <p className="text-xs text-gray-500 mt-1">This may be displayed publicly on your profile</p>
        </div>

        {/* Account Information (Read-only) */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={currentUser.profile?.user_login || ''}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="text"
                value={currentUser.profile?.user_email || ''}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={currentUser.role?.name || 'Subscriber'}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <input
                type="text"
                value={currentUser.profile?.user_registered 
                  ? new Date(currentUser.profile.user_registered).toLocaleDateString()
                  : 'Unknown'
                }
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Choose Profile Avatar</h3>
                <button
                  onClick={() => setShowMediaPicker(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-96">
              {!mediaItems ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading media...</p>
                </div>
              ) : mediaItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">🖼️</div>
                  <p>No images found. Upload images in the Media Library first.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {mediaItems
                    .filter(item => item.mimeType.startsWith('image/'))
                    .map((item) => (
                    <div
                      key={item._id}
                      className="cursor-pointer border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
                      onClick={() => handleAvatarSelect(item._id)}
                    >
                      <div className="aspect-square">
                        <img
                          src={item.url || ''}
                          alt={item.alt || item.filename}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-gray-600 truncate" title={item.filename}>
                          {item.filename}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowMediaPicker(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEditor;