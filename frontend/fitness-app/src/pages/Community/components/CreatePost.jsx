import React, { useState, useRef } from "react";
import { FaImage, FaVideo, FaPoll, FaSmile, FaTimes } from "react-icons/fa";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";

const CreatePost = ({ onPostCreated }) => {
  const [postContent, setPostContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postContent.trim() && !imagePreview) return;
    setIsCreating(true);

    const formData = new FormData();
    formData.append("description", postContent);
    if (postImage) {
      formData.append("media", postImage);
    }

    try {
      const response = await axiosInstance.post(API_PATHS.POST.CREATE_POST, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onPostCreated(response.data);
      setPostContent("");
      setPostImage(null);
      setImagePreview(null);
      setIsCreating(false);
    } catch (error) {
        console.error('Post creation failed:', error.response?.data || error.message);
    setIsCreating(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPostImage(file);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPostImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Hidden file input
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
            <img
              src="/src/assets/profile1.png"
              alt="Your profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-transparent border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45] resize-none h-24"
            ></textarea>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative mt-3 rounded-lg overflow-hidden border border-gray-700">
                <img
                  src={imagePreview}
                  alt="Post preview"
                  className="max-h-60 w-auto mx-auto"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80"
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              type="button"
              className="p-2 rounded-full text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]"
              onClick={triggerFileInput}
            >
              <FaImage size={20} />
            </button>
            <button
              type="button"
              className="p-2 rounded-full text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]"
            >
              <FaVideo size={20} />
            </button>
            <button
              type="button"
              className="p-2 rounded-full text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]"
            >
              <FaPoll size={20} />
            </button>
            <button
              type="button"
              className="p-2 rounded-full text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]"
            >
              <FaSmile size={20} />
            </button>
          </div>
          <button
            type="submit"
            disabled={(!postContent.trim() && !imagePreview) || isCreating}
            className={`px-5 py-2 rounded-full ${
              (!postContent.trim() && !imagePreview) || isCreating
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-[#f67a45] text-white hover:bg-[#e56d3d]"
            } transition-colors`}
          >
            {isCreating ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
