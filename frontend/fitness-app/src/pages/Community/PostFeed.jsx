import React, { useState } from 'react';
import { FaImage, FaVideo, FaRegSmile, FaHeart, FaRegHeart, FaComment, FaShare } from 'react-icons/fa';

const PostFeed = ({ profileImage }) => {
  const [postText, setPostText] = useState('');
  
  // Mock posts data (in a real app, this would come from an API)
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Sarah Johnson',
      authorImage: '/src/assets/profile1.png',
      time: '2 hours ago',
      content: 'Just completed a 5K run in under 25 minutes! Personal best! 🏃‍♀️💪 #Fitness #PersonalBest',
      image: '/src/assets/posts/workout1.jpg',
      likes: 24,
      comments: 5,
      isLiked: false
    },
    {
      id: 2,
      author: 'Mike Peterson',
      authorImage: '/src/assets/profile1.png',
      time: '5 hours ago',
      content: 'New gym equipment arrived today. Can\'t wait to try it out tomorrow! Any recommendations for a good shoulder workout?',
      image: null,
      likes: 18,
      comments: 12,
      isLiked: true
    }
  ]);

  // Handle post submission
  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (!postText.trim()) return;
    
    // In a real app, you would send this to an API
    const newPost = {
      id: posts.length + 1,
      author: 'You',
      authorImage: profileImage || '/src/assets/profile1.png',
      time: 'Just now',
      content: postText,
      image: null,
      likes: 0,
      comments: 0,
      isLiked: false
    };
    
    setPosts([newPost, ...posts]);
    setPostText('');
  };

  // Toggle like on a post
  const handleToggleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Create Post Card */}
      <div className="bg-[#121225] rounded-xl p-4">
        <form onSubmit={handleSubmitPost}>
          <div className="flex gap-3 mb-4">
            <img 
              src={profileImage || "/src/assets/profile1.png"} 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <input
              type="text"
              placeholder="What's on your mind?"
              className="flex-1 bg-[#1A1A2F] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <button type="button" className="text-white hover:text-[#f67a45] transition-colors flex items-center gap-2">
                <FaImage />
                <span className="text-sm hidden sm:inline">Photo</span>
              </button>
              <button type="button" className="text-white hover:text-[#f67a45] transition-colors flex items-center gap-2">
                <FaVideo />
                <span className="text-sm hidden sm:inline">Video</span>
              </button>
              <button type="button" className="text-white hover:text-[#f67a45] transition-colors flex items-center gap-2">
                <FaRegSmile />
                <span className="text-sm hidden sm:inline">Feeling</span>
              </button>
            </div>
            
            <button 
              type="submit" 
              className="bg-[#f67a45] text-white px-4 py-1.5 rounded-full hover:bg-[#e56d3d] transition-colors"
              disabled={!postText.trim()}
            >
              Post
            </button>
          </div>
        </form>
      </div>
      
      {/* Posts List */}
      {posts.map(post => (
        <div key={post.id} className="bg-[#121225] rounded-xl p-4">
          {/* Post Header */}
          <div className="flex gap-3 mb-3">
            <img 
              src={post.authorImage} 
              alt={post.author} 
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/src/assets/profile1.png";
              }}
            />
            <div>
              <h4 className="text-white font-medium">{post.author}</h4>
              <p className="text-gray-400 text-xs">{post.time}</p>
            </div>
          </div>
          
          {/* Post Content */}
          <p className="text-white mb-3">{post.content}</p>
          
          {/* Post Image (if any) */}
          {post.image && (
            <div className="mb-3 rounded-lg overflow-hidden">
              <img 
                src={post.image} 
                alt="Post" 
                className="w-full h-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/src/assets/posts/default.jpg";
                }}
              />
            </div>
          )}
          
          {/* Post Actions */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-700">
            <button 
              className="flex items-center gap-2 text-white hover:text-[#f67a45] transition-colors"
              onClick={() => handleToggleLike(post.id)}
            >
              {post.isLiked ? <FaHeart className="text-[#f67a45]" /> : <FaRegHeart />}
              <span>{post.likes}</span>
            </button>
            
            <button className="flex items-center gap-2 text-white hover:text-[#f67a45] transition-colors">
              <FaComment />
              <span>{post.comments}</span>
            </button>
            
            <button className="flex items-center gap-2 text-white hover:text-[#f67a45] transition-colors">
              <FaShare />
              <span>Share</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostFeed;
