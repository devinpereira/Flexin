import React, { useState, useRef } from 'react';
import { FaImage, FaVideo, FaPoll, FaSmile, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CreatePost = ({ onPostCreated }) => {
  const [postContent, setPostContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [images, setImages] = useState([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!postContent.trim() && images.length === 0) return;
    
    setIsCreating(true);
    
    // Create new post object
    const newPost = {
      id: Date.now(),
      user: {
        name: 'John Doe', // This would come from current user context
        username: '@johndoe',
        profileImage: '/src/assets/profile1.png'
      },
      content: postContent,
      images: images,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: 'Just now',
      liked: false
    };
    
    // Add delay to simulate API call
    setTimeout(() => {
      onPostCreated(newPost);
      setPostContent('');
      setImages([]);
      setCurrentPreviewIndex(0);
      setIsCreating(false);
    }, 1000);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Limit to 5 images total
    const remainingSlots = 5 - images.length;
    const filesToProcess = files.slice(0, remainingSlots);
    
    // Process each file
    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prevImages => [...prevImages, {
          file,
          preview: reader.result
        }]);
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input to allow selecting same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    
    // Adjust current preview index if needed
    if (currentPreviewIndex >= indexToRemove && currentPreviewIndex > 0) {
      setCurrentPreviewIndex(prev => prev - 1);
    }
  };

  const handlePrevImage = () => {
    setCurrentPreviewIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextImage = () => {
    setCurrentPreviewIndex(prev => (prev < images.length - 1 ? prev + 1 : prev));
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
            
            {/* Images Preview */}
            {images.length > 0 && (
              <div className="relative mt-3 rounded-lg overflow-hidden border border-gray-700">
                <div className="relative">
                  <img 
                    src={images[currentPreviewIndex].preview} 
                    alt={`Post preview ${currentPreviewIndex + 1}`} 
                    className="max-h-80 w-full object-contain"
                  />
                  
                  {/* Image count indicator */}
                  <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                    {currentPreviewIndex + 1}/{images.length}
                  </div>
                  
                  {/* Navigation arrows */}
                  {images.length > 1 && (
                    <>
                      <button 
                        type="button"
                        onClick={handlePrevImage}
                        className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full ${currentPreviewIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/80'}`}
                        disabled={currentPreviewIndex === 0}
                      >
                        <FaChevronLeft />
                      </button>
                      <button 
                        type="button"
                        onClick={handleNextImage}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full ${currentPreviewIndex === images.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/80'}`}
                        disabled={currentPreviewIndex === images.length - 1}
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  )}
                  
                  {/* Remove current image button */}
                  <button 
                    type="button"
                    onClick={() => handleRemoveImage(currentPreviewIndex)}
                    className="absolute top-2 left-2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex justify-center p-2 gap-2 bg-black/30">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentPreviewIndex(idx)}
                        className={`w-10 h-10 rounded-md overflow-hidden border-2 ${currentPreviewIndex === idx ? 'border-[#f67a45]' : 'border-transparent'}`}
                      >
                        <img 
                          src={img.preview} 
                          alt={`Thumbnail ${idx + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Hidden file input (now accepts multiple) */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageSelect} 
          accept="image/*" 
          multiple={images.length < 5}
          className="hidden" 
        />
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              type="button" 
              className={`p-2 rounded-full ${images.length >= 5 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'}`}
              onClick={images.length < 5 ? triggerFileInput : undefined}
              disabled={images.length >= 5}
              title={images.length >= 5 ? "Maximum 5 images allowed" : "Add images"}
            >
              <FaImage size={20} />
              {images.length > 0 && <span className="text-xs ml-1">{images.length}/5</span>}
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
            disabled={(!postContent.trim() && images.length === 0) || isCreating}
            className={`px-5 py-2 rounded-full ${
              (!postContent.trim() && images.length === 0) || isCreating
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-[#f67a45] text-white hover:bg-[#e56d3d]'
            } transition-colors`}
          >
            {isCreating ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;