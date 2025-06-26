import React, { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaRegHeart, FaHeart, FaComment, FaShare } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { BASE_URL } from '../../../utils/apiPaths';

const PostImageModal = ({ post, user, onClose, onLike }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(post.isliked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [commentText, setCommentText] = useState('');

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (post.images && currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handleLike = async () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);

    if (onLike) {
      onLike(post.id, !liked);
    }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    // In a real implementation, this would call an API
    setCommentText('');
  };

  const hasMultipleImages = post.images && Array.isArray(post.images) && post.images.length > 1;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white p-2 rounded-full bg-black/30"
        >
          <FaTimes size={24} />
        </button>
      </div>

      <div
        className="w-full h-full max-w-6xl md:h-[90vh] flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        {/* Image Section - Left/Top */}
        <div className="relative flex items-center justify-center bg-black md:w-7/12 h-1/2 md:h-full">
          <img
            src={post.images ? post.images[currentImageIndex].preview : post.image}
            alt="Post"
            className="max-h-full max-w-full object-contain"
          />

          {hasMultipleImages && (
            <>
              <button
                onClick={handlePrevImage}
                className={`absolute left-4 text-white/80 hover:text-white p-2 rounded-full bg-black/30 ${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                disabled={currentImageIndex === 0}
              >
                <FaChevronLeft size={20} />
              </button>

              <button
                onClick={handleNextImage}
                className={`absolute right-4 text-white/80 hover:text-white p-2 rounded-full bg-black/30 ${currentImageIndex === post.images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                disabled={currentImageIndex === post.images.length - 1}
              >
                <FaChevronRight size={20} />
              </button>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
                {post.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/30'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Comments/Details Section - Right/Bottom */}
        <div className="md:w-5/12 h-1/2 md:h-full bg-[#121225] flex flex-col overflow-hidden">
          {/* Post Header */}
          <div className="p-4 border-b border-gray-700 flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <img
                src={user.profileImage || user.profileImageUrl ? `${BASE_URL}/${user.profileImageUrl}` : '/src/assets/profile1.png'}
                alt={user.name || user.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-white font-medium">{user.name || user.fullName}</h4>
              <p className="text-gray-400 text-xs">{user.username}</p>
            </div>
          </div>

          {/* Post Caption and Comments */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Caption */}
            <div className="flex">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                <img
                  src={user.profileImage || user.profileImageUrl ? `${BASE_URL}/${user.profileImageUrl}` : '/src/assets/profile1.png'}
                  alt={user.name || user.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-white font-medium">{user.name || user.fullName}</span>{' '}
                <span className="text-white/90">{post.content || post.description}</span>
                <p className="text-gray-500 text-xs mt-1">
                  {formatDistanceToNow(new Date(post.timestamp || post.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            {/* Comments would be mapped here */}
            <div className="mt-4 text-white/40 text-center text-sm">
              No comments yet
            </div>
          </div>

          {/* Actions Bar */}
          <div className="border-t border-gray-700 p-4">
            <div className="flex items-center mb-3 gap-4">
              <button
                onClick={handleLike}
                className="text-2xl"
              >
                {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-white hover:text-white/70" />}
              </button>
              <button className="text-2xl text-white hover:text-white/70">
                <FaComment />
              </button>
              {/* <button className="text-2xl text-white hover:text-white/70">
                <FaShare />
              </button> */}
            </div>

            <div className="text-white font-medium mb-3">
              {likesCount} likes
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="flex items-center">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-transparent border-none text-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className={`ml-2 font-medium ${commentText.trim() ? 'text-[#f67a45] hover:text-[#e56d3d]' : 'text-[#f67a45]/50 cursor-not-allowed'}`}
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostImageModal;
