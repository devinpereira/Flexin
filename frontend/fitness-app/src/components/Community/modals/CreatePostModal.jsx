import React, { useState, useRef } from 'react';
import { FaImage, FaChevronLeft, FaChevronRight, FaTimes, FaCamera } from 'react-icons/fa';

const CreatePostModal = ({ onClose, onSubmit }) => {
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Limit to 5 images total
    const remainingSlots = 5 - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    const newImages = [];

    // Process each file
    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push({
          file,
          preview: reader.result
        });

        // Update state after all images are processed
        if (newImages.length === filesToProcess.length) {
          setImages([...images, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    if (currentPreviewIndex >= newImages.length && newImages.length > 0) {
      setCurrentPreviewIndex(newImages.length - 1);
    }
  };

  const handleNextImage = () => {
    if (currentPreviewIndex < images.length - 1) {
      setCurrentPreviewIndex(currentPreviewIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentPreviewIndex > 0) {
      setCurrentPreviewIndex(currentPreviewIndex - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (images.length === 0 && !caption.trim()) return;

    onSubmit({
      caption,
      images: images.map(img => img.preview)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#1A1A2F] rounded-lg p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-white text-xl font-bold mb-4">Create New Post</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {images.length > 0 ? (
            <div className="relative border border-gray-700 rounded-lg overflow-hidden">
              <div className="relative">
                <img
                  src={images[currentPreviewIndex].preview}
                  alt="Preview"
                  className="max-h-80 w-full object-contain bg-black"
                />

                {/* Image counter */}
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

              {/* Image thumbnails */}
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

              {/* Add more images button */}
              {images.length < 5 && (
                <div className="p-2 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="w-full py-2 bg-[#242440] text-white rounded-lg hover:bg-[#2a2a4a] transition-colors flex items-center justify-center gap-2"
                  >
                    <FaImage />
                    <span>Add More Images ({images.length}/5)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <label className="cursor-pointer flex flex-col items-center">
                <FaCamera className="text-gray-400 text-3xl mb-2" />
                <span className="text-gray-400 mb-2">Upload up to 5 images</span>
                <span className="px-4 py-2 bg-[#242440] text-white rounded-lg hover:bg-[#2a2a4a] transition-colors">
                  Choose Images
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          )}

          <div>
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-[#121225] border border-gray-700 rounded-lg p-3 text-white resize-none h-24 focus:border-[#f67a45] focus:outline-none"
            />
          </div>

          <input
            type="file"
            accept="image/*"
            multiple={images.length < 5}
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

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
              disabled={images.length === 0 && !caption.trim()}
              className={`px-4 py-2 rounded-lg ${images.length === 0 && !caption.trim()
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-[#f67a45] text-white hover:bg-[#e56d3d] transition-colors'
                }`}
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
