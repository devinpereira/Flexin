import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaEllipsisH, FaTh, FaBookmark, FaUserTag } from 'react-icons/fa';
import { API_PATHS } from '../../../utils/apiPaths';

const UserProfile = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get(`${API_PATHS.POST.GET_USER_POSTS(user._id)}`);
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, []);

  const handleFollowUser = async (userId, isFollowing) => {
      try {
        if (isFollowing == "accepted") {
          await axiosInstance.delete(`${API_PATHS.FOLLOW.UNFOLLOW_USER(userId)}`);
        } else {
          await axiosInstance.post(`${API_PATHS.FOLLOW.SEND_FOLLOW_REQUEST(userId)}`);
        }
      } catch (err) {
        console.error("Error following/unfollowing user:", err);
      }
    }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden">
        {/* Header with back button */}
        <div className="flex items-center justify-between bg-[#1A1A2F] p-4 border-b border-gray-700">
          <button 
            onClick={onBack}
            className="text-white flex items-center gap-2"
          >
            <FaArrowLeft />
            <span>Back to Search</span>
          </button>
          <button className="text-white p-2">
            <FaEllipsisH />
          </button>
        </div>

        {/* Profile Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Image */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden">
              <img 
                src={user.profileImage} 
                alt={user.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/src/assets/profile1.png';
                }}
              />
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-white text-2xl font-bold mb-1">{user.name}</h1>
              <p className="text-gray-400 mb-4">{user.username}</p>
              
              <p className="text-white mb-4">{user.bio}</p>
              
              <div className="flex justify-center md:justify-start gap-6 mb-4">
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
              
              <div className="flex justify-center md:justify-start gap-4">
                <button 
                  className={`px-6 py-2 rounded-full ${user.isFollowing 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-[#f67a45] text-white hover:bg-[#e56d3d]'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollowUser(user.id, user.isFollowing);
                  }}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
                <button className="px-6 py-2 rounded-full bg-[#1A1A2F] text-white hover:bg-gray-700">
                  Message
                </button>
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
            <button 
              className={`flex-1 py-4 text-center ${activeTab === 'tagged' 
                ? 'text-[#f67a45] border-b-2 border-[#f67a45]' 
                : 'text-gray-400'}`}
              onClick={() => setActiveTab('tagged')}
            >
              <FaUserTag className="inline-block mr-2" />
              Tagged
            </button>
          </div>
        </div>
        
        {/* Posts Grid */}
        <div className="p-4">
          {activeTab === 'posts' && (
            <>
              {posts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                  {posts.map(post => (
                    <div key={post.id} className="aspect-square overflow-hidden">
                      <img 
                        src={post.image} 
                        alt="Post" 
                        className="w-full h-full object-cover transition-transform hover:scale-105 cursor-pointer"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/src/assets/posts/default.jpg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-gray-400">No posts yet.</p>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'saved' && (
            <div className="py-10 text-center">
              <p className="text-gray-400">No saved posts.</p>
            </div>
          )}
          
          {activeTab === 'tagged' && (
            <div className="py-10 text-center">
              <p className="text-gray-400">No tagged posts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;