import React, { useState, useRef } from 'react';
import { BASE_URL } from '../../../utils/apiPaths';

const ProfilePictureModal = ({ onClose, user, onSave }) => {
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [uploadingProfilePicture, setUploadingProfilePicture] = useState(false);
  const fileInputRef = useRef(null);

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  // Save new profile picture
  const handleSaveProfilePicture = () => {
    if (!profileImageFile) return;

    setUploadingProfilePicture(true);
    onSave(profileImageFile, profileImagePreview, setUploadingProfilePicture);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#1A1A2F] rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-white text-xl font-bold mb-4">Update Profile Picture</h3>

        <div className="flex flex-col items-center mb-6">
          <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
            <img
              src={profileImagePreview || (user.profileImageUrl ? `${BASE_URL}/${user.profileImageUrl}` : '/src/assets/profile1.png')}
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfilePictureChange}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="bg-[#242440] text-white px-4 py-2 rounded-lg hover:bg-[#2a2a4a] transition-colors"
          >
            Choose Image
          </button>
          <p className="text-gray-400 text-xs mt-2">Maximum size: 5MB</p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-700 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveProfilePicture}
            disabled={!profileImageFile || uploadingProfilePicture}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${!profileImageFile || uploadingProfilePicture
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-[#f67a45] text-white hover:bg-[#e56d3d] transition-colors'
              }`}
          >
            {uploadingProfilePicture && (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            )}
            {uploadingProfilePicture ? 'Uploading...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureModal;
