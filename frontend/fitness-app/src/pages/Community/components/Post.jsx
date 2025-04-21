import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaEllipsisH } from 'react-icons/fa';

const Post = ({ post, onLike }) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    // Sample comments
    { id: 1, user: 'Jessica Kim', text: 'Looking great! Keep up the good work!', timestamp: '1 hour ago' },
    { id: 2, user: 'David Wilson', text: 'Amazing progress!', timestamp: '30 minutes ago' }
  ]);

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
    
    // Propagate to parent component
    if (onLike) {
      onLike(post.id);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const newComment = {
      id: Date.now(),
      user: 'John Doe', // Would come from auth context in real app
      text: commentText,
      timestamp: 'Just now'
    };
    
    setComments([...comments, newComment]);
    setCommentText('');
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setShowMenu(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
      {/* Post Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
            <img 
              src={post.user?.profileImage || '/src/assets/profile1.png'} 
              alt={post.user?.name || 'User'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/src/assets/profile1.png';
              }}
            />
          </div>
          <div>
            <h4 className="text-white font-medium">{post.user.name}</h4>
            <div className="flex items-center">
              <span className="text-gray-400 text-sm">{post.user.username} • {post.timestamp}</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button 
            className="text-white/70 p-2 rounded-full hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <FaEllipsisH />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 bg-[#1A1A2F] border border-gray-700 rounded shadow-lg py-2 min-w-[150px] z-10">
              <button className="w-full text-left px-4 py-2 text-white hover:bg-[#f67a45]/10 text-sm">
                Save Post
              </button>
              <button className="w-full text-left px-4 py-2 text-white hover:bg-[#f67a45]/10 text-sm">
                Report Post
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Post Content */}
      <p className="text-white mb-4">{post.content}</p>
      
      {/* Post Image (if any) */}
      {post.image && (
        <div className="rounded-lg overflow-hidden mb-4">
          <img 
            src={post.image} 
            alt="Post" 
            className="w-full h-auto"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/src/assets/posts/default.jpg';
            }}
          />
        </div>
      )}
      
      {/* Post Stats */}
      <div className="flex text-white/70 text-sm mb-4">
        <span className="mr-4">{likesCount} likes</span>
        <button 
          className="mr-4 hover:text-white"
          onClick={() => setShowComments(!showComments)}
        >
          {comments.length} comments
        </button>
        <span>{post.shares} shares</span>
      </div>
      
      {/* Post Actions */}
      <div className="flex border-t border-gray-700 pt-4">
        <button 
          className={`flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10 flex-1 justify-center ${liked ? 'text-[#f67a45]' : 'text-white'}`}
          onClick={handleLike}
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
          <span>Like</span>
        </button>
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10 text-white flex-1 justify-center"
          onClick={() => setShowComments(!showComments)}
        >
          <FaComment />
          <span>Comment</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10 text-white flex-1 justify-center">
          <FaShare />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-gray-700 pt-4">
          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="flex mb-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-[#1A1A2F] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className={`ml-2 px-4 py-2 rounded-lg ${!commentText.trim() ? 'bg-gray-600 text-gray-400' : 'bg-[#f67a45] text-white hover:bg-[#e56d3d]'}`}
            >
              Post
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="flex">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
                  <img 
                    src="/src/assets/profile1.png" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-[#1A1A2F] rounded-lg p-3 flex-1">
                  <div className="flex justify-between">
                    <span className="text-white font-medium">{comment.user}</span>
                    <span className="text-gray-400 text-xs">{comment.timestamp}</span>
                  </div>
                  <p className="text-white/90">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;