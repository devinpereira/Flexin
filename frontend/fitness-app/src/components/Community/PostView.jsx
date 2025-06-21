import React from 'react';
import { FaThumbsUp, FaComment, FaFlag, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';

const PostView = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="bg-[#1d1d3a] rounded-lg p-6">
      {/* Header with author info and date */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f67a45]/20 rounded-full flex items-center justify-center">
            <span className="text-[#f67a45] font-medium">
              {post.author[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-white font-medium">{post.author}</h3>
            <p className="text-white/50 text-sm flex items-center gap-1">
              <FaClock size={12} />
              {format(new Date(post.date), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors"
        >
          Close
        </button>
      </div>

      {/* Post title */}
      <h2 className="text-white text-xl font-bold mb-4">{post.title}</h2>

      {/* Post content - Using mock content since it's not in the original data */}
      <div className="text-white/70 mb-6">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </p>
      </div>

      {/* Engagement stats */}
      <div className="flex items-center gap-6 text-white/50">
        <div className="flex items-center gap-2">
          <FaThumbsUp size={14} />
          <span>{post.likes} likes</span>
        </div>
        <div className="flex items-center gap-2">
          <FaComment size={14} />
          <span>{post.comments} comments</span>
        </div>
        {post.reports > 0 && (
          <div className="flex items-center gap-2 text-yellow-400">
            <FaFlag size={14} />
            <span>{post.reports} reports</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostView;