import React, { useState } from 'react';
import { FaEdit, FaCamera, FaHeart, FaComment, FaShare } from 'react-icons/fa';

const Profile = () => {
  // Mock user data (in a real app, this would come from an API)
  const [user, setUser] = useState({
    name: 'Alex Morgan',
    username: 'alexmorgan',
    bio: 'Fitness enthusiast | Marathon runner | Nutrition coach',
    image: '/src/assets/profile1.png',
    coverImage: '/src/assets/cover-photo.jpg',
    stats: {
      posts: 156,
      followers: 843,
      following: 267
    }
  });
  
  // Mock posts data
  const [posts, setPosts] = useState([
    {
      id: 1,
      content: 'Just completed a 5K run in under 25 minutes! Personal best! 🏃‍♀️💪 #Fitness #PersonalBest',
      image: '/src/assets/posts/workout1.jpg',
      time: '2 days ago',
      likes: 24,
      comments: 5,
      isLiked: true
    },
    {
      id: 2,
      content: 'New gym equipment arrived today. Can\'t wait to try it out tomorrow! Any recommendations for a good shoulder workout?',
      image: null,
      time: '1 week ago',
      likes: 18,
      comments: 12,
      isLiked: false
    }
  ]);
  
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
  
  // Profile tabs
  const [activeTab, setActiveTab] = useState('posts');
  const tabs = [
    { id: 'posts', label: 'Posts' },
    { id: 'photos', label: 'Photos' },
    { id: 'saved', label: 'Saved' }
  ];

  return (
    <div className="space-y-6">
      {/* Cover Photo */}
      <div className="relative rounded-xl overflow-hidden h-48 sm:h-64">
        <img 
          src={user.coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/src/assets/default-cover.jpg';
          }}
        />
        <button className="absolute bottom-4 right-4 bg-[#1A1A2F]/80 text-white p-2 rounded-full hover:bg-[#1A1A2F]">
          <FaCamera size={18} />
        </button>
      </div>
      
      {/* Profile Info */}
      <div className="bg-[#121225] rounded-xl p-6 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative -mt-16 sm:-mt-20 border-4 border-[#121225] rounded-full">
            <img 
              src={user.image} 
              alt={user.name} 
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/src/assets/profile1.png';
              }}
            />
            <button className="absolute bottom-2 right-2 bg-[#1A1A2F] text-white p-1.5 rounded-full hover:bg-[#f67a45]">
              <FaCamera size={14} />
            </button>
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-white text-2xl font-bold">{user.name}</h2>
                <p className="text-gray-400 mb-2">@{user.username}</p>
              </div>
              <button className="bg-[#1A1A2F] text-white px-4 py-2 rounded-full hover:bg-[#f67a45]/20 hover:text-[#f67a45] flex items-center gap-2 mx-auto sm:mx-0">
                <FaEdit size={14} />
                <span>Edit Profile</span>
              </button>
            </div>
            
            <p className="text-white mb-4">{user.bio}</p>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-6">
              <div className="text-center">
                <p className="text-white font-bold">{user.stats.posts}</p>
                <p className="text-gray-400 text-sm">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">{user.stats.followers}</p>
                <p className="text-gray-400 text-sm">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">{user.stats.following}</p>
                <p className="text-gray-400 text-sm">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="bg-[#121225] rounded-xl">
        <div className="flex border-b border-gray-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === tab.id
                  ? 'text-[#f67a45] border-b-2 border-[#f67a45]'
                  : 'text-white hover:text-[#f67a45]'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="bg-[#1A1A2F] rounded-xl p-4">
                  {/* Post Header */}
                  <div className="flex gap-3 mb-3">
                    <img 
                      src={user.image} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/src/assets/profile1.png";
                      }}
                    />
                    <div>
                      <h4 className="text-white font-medium">{user.name}</h4>
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
                      <FaHeart className={post.isLiked ? "text-[#f67a45]" : "text-white"} />
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
          )}
          
          {activeTab === 'photos' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {posts
                .filter(post => post.image)
                .map(post => (
                  <div key={post.id} className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={post.image} 
                      alt="Post" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/src/assets/posts/default.jpg";
                      }}
                    />
                  </div>
                ))}
            </div>
          )}
          
          {activeTab === 'saved' && (
            <div className="bg-[#1A1A2F] rounded-xl p-6 text-center">
              <p className="text-gray-400">No saved posts yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
