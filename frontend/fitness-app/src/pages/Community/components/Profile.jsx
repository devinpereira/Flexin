import React, { useState } from 'react';
import { FaUserEdit, FaTh, FaBookmark, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('posts');
  
  // Mock current user data
  const user = {
    name: 'John Doe',
    username: '@johndoe',
    profileImage: '/src/assets/profile1.png',
    bio: 'Fitness enthusiast | Working out since 2018 | Plant-based diet',
    posts: 24,
    followers: 530,
    following: 215,
  };
  
  // Mock posts data
  const posts = [
    { id: 1, image: '/src/assets/posts/workout.png' },
    { id: 2, image: '/src/assets/posts/workout1.png' },
    { id: 3, image: '/src/assets/posts/workout.png' },
  ];
  
  // Mock saved posts
  const savedPosts = [
    { id: 4, image: '/src/assets/posts/workout1.png' },
    { id: 5, image: '/src/assets/posts/workout.png' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-[#1A1A2F] to-[#0A0A1F] relative">
          <button className="absolute top-4 right-4 bg-[#1A1A2F]/50 p-2 rounded-full text-white hover:bg-[#1A1A2F]/80">
            <FaUserEdit size={18} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pt-16 pb-6 border-b border-gray-700">
          {/* Profile Picture */}
          <div className="absolute -top-14 left-6 w-28 h-28 rounded-full border-4 border-[#121225] overflow-hidden">
            <img 
              src={user.profileImage} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Settings Button */}
          <div className="flex justify-end mb-4">
            <button className="bg-[#1A1A2F] p-2 rounded-full text-white hover:bg-[#f67a45]/10">
              <FaCog size={18} />
            </button>
          </div>
          
          {/* User Info */}
          <div>
            <h1 className="text-white text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-400 mb-4">{user.username}</p>
            
            <p className="text-white mb-6">{user.bio}</p>
            
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-white font-bold">{user.posts}</p>
                <p className="text-gray-400 text-sm">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">{user.followers}</p>
                <p className="text-gray-400 text-sm">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">{user.following}</p>
                <p className="text-gray-400 text-sm">Following</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex">
            <button 
              className={`flex-1 py-4 text-center ${activeTab === 'posts' 
                ? 'text-[#f67a45] border-b-2 border-[#f67a45]' 
                : 'text-gray-400'}`}
              onClick={() => setActiveTab('posts')}
            >
              <FaTh className="inline-block mr-2" />
              Posts
            </button>
            <button 
              className={`flex-1 py-4 text-center ${activeTab === 'saved' 
                ? 'text-[#f67a45] border-b-2 border-[#f67a45]' 
                : 'text-gray-400'}`}
              onClick={() => setActiveTab('saved')}
            >
              <FaBookmark className="inline-block mr-2" />
              Saved
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {activeTab === 'posts' && (
            posts.length > 0 ? (
              <motion.div 
                className="grid grid-cols-3 gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {posts.map(post => (
                  <motion.div 
                    key={post.id} 
                    className="aspect-square overflow-hidden rounded-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src={post.image} 
                      alt="Post" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/src/assets/posts/default.jpg';
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-gray-400">No posts yet.</p>
                <button className="mt-4 bg-[#f67a45] text-white px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors">
                  Create Your First Post
                </button>
              </div>
            )
          )}
          
          {activeTab === 'saved' && (
            savedPosts.length > 0 ? (
              <motion.div 
                className="grid grid-cols-3 gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {savedPosts.map(post => (
                  <motion.div 
                    key={post.id} 
                    className="aspect-square overflow-hidden rounded-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src={post.image} 
                      alt="Saved Post" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/src/assets/posts/default.jpg';
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-gray-400">No saved posts.</p>
              </div>
            )
          )}
        </div>
        
        {/* Log Out Button */}
        <div className="p-4 border-t border-gray-700">
          <button className="w-full py-3 text-[#f67a45] flex items-center justify-center gap-2 hover:bg-[#f67a45]/10 rounded-lg transition-colors">
            <FaSignOutAlt />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;