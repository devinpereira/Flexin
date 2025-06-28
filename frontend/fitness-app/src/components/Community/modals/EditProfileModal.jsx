import React, { useState } from 'react';

const EditProfileModal = ({ onClose, user, onSubmit }) => {
  const [name, setName] = useState(user.fullName);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    onSubmit({ name, username, bio }, setIsSubmitting);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#1A1A2F] rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-white text-xl font-bold mb-4">Edit Profile Info</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white mb-1 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#121225] border border-gray-700 rounded-lg p-3 text-white focus:border-[#f67a45] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-white mb-1 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#121225] border border-gray-700 rounded-lg p-3 text-white focus:border-[#f67a45] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-white mb-1 block">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#121225] border border-gray-700 rounded-lg p-3 text-white resize-none h-24 focus:border-[#f67a45] focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#f67a45] text-white px-4 py-2 rounded-lg hover:bg-[#e56d3d] transition-colors flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              )}
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
