import React from 'react';
import { FaArrowLeft, FaEnvelope, FaUserPlus, FaUserCheck } from 'react-icons/fa';

const UserProfile = ({ user, onBack }) => {
  // In a real app, these would be actual states with API calls
  const [isFollowing, setIsFollowing] = React.useState(false);
  
  // Mock posts from the user
  const userPosts = [
    {
      id: 1,
      content: 'Just completed a 5K run in under 25 minutes! Personal best! 🏃‍♀️💪 #Fitness #PersonalBest',
      image: '/src/assets/posts/workout1.jpg',
      time: '2 days ago',
      likes: 24,
      comments: 5
    },
    {
      id: 2,
      content: 'New gym equipment arrived today. Can\'t wait to try it out tomorrow!',
      image: null,
      time: '1 week ago',
      likes: 18,
      comments: 12
    }
  ];

  return (
    <div className="space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white hover:text-[#f67a45] transition-colors mb-4"
      >
        <FaArrowLeft />
        <span>Back to Search</span>
      </button>
      
      {/* Profile Header */}
      <div className="bg-[#121225] rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img 
            src={user.image} 
            alt={user.name} 
            className="w-24 h-24 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/src/assets/profile1.png";
            }}
          />
          
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-white text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-400 mb-2">@{user.username}</p>
            <p className="text-white mb-4">{user.bio}</p>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              <div className="text-center">
                <p className="text-white font-bold">248</p>
                <p className="text-gray-400 text-sm">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">1.2k</p>
                <p className="text-gray-400 text-sm">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">645</p>
                <p className="text-gray-400 text-sm">Following</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="bg-[#f67a45] text-white px-4 py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center gap-2">
              <FaEnvelope />
              <span>Message</span>
            </button>
            
            <button 
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                isFollowing 
                  ? 'bg-[#1A1A2F] text-white hover:bg-red-500/20 hover:text-red-500' 
                  : 'bg-[#1A1A2F] text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45]'
              }`}
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? <FaUserCheck /> : <FaUserPlus />}
              <span>{isFollowing ? 'Following' : 'Follow'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* User Posts */}
      <h3 className="text-white text-xl font-bold mt-8 mb-4">Posts</h3>
      
      <div className="space-y-4">
        {userPosts.map(post => (
          <div key={post.id} className="bg-[#121225] rounded-xl p-4">
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
            
            {/* Post Meta */}
            <div className="flex justify-between text-gray-400 text-sm">
              <span>{post.time}</span>
              <span>{post.likes} likes • {post.comments} comments</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
