import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaEllipsisH, FaTh, FaBookmark, FaUserTag, FaRegHeart, FaComment, FaUserCheck, FaUserPlus, FaEnvelope } from 'react-icons/fa';
import { API_PATHS, BASE_URL } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import PostImageModal from './modals/PostImageModal';

const UserProfile = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [selectedImagePost, setSelectedImagePost] = useState(null);

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
  }, [user._id]);

  const handleFollowUser = async (userId, isFollowing) => {
    try {
      if (isFollowing === "accepted") {
        await axiosInstance.delete(`${API_PATHS.FOLLOW.UNFOLLOW_USER(userId)}`);
      } else {
        await axiosInstance.post(`${API_PATHS.FOLLOW.SEND_FOLLOW_REQUEST(userId)}`);
      }
      // Update local state or refetch user data to reflect the new follow status
      // This could be done via a callback provided by the parent component
    } catch (err) {
      console.error("Error following/unfollowing user:", err);
    }
  }

  // Handle opening the image modal
  const handleImageClick = (post) => {
    setSelectedImagePost(post);
  };

  // Handle closing the image modal
  const handleCloseImageModal = () => {
    setSelectedImagePost(null);
  };

  return (
    <div className="bg-[#121225] rounded-xl overflow-hidden">
      {/* Header with back button */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-[#f67a45] transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Search</span>
        </button>
        <button className="text-white/70 p-2 rounded-full hover:bg-white/10">
          <FaEllipsisH />
        </button>
      </div>

      {/* Facebook-style Profile Header */}
      <div className="p-6 border-b border-gray-700 bg-[#1A1A2F]">
        <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
          {/* Profile Image */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#121225]">
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
            <h1 className="text-white text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-400 mb-3">{user.username}</p>

            {/* User Bio */}
            <p className="text-white mb-4">{user.bio}</p>

            {/* User Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4">
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

            {/* Action buttons moved to the bottom of profile info */}
            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
              <button
                className={`px-6 py-2 rounded-lg ${user.isFollowing
                  ? 'bg-[#121225] text-white hover:bg-red-500/10 hover:text-red-500'
                  : 'bg-[#f67a45] text-white hover:bg-[#e56d3d]'}`}
                onClick={(e) => handleFollowUser(user._id, user.isFollowing)}
              >
                <span className="flex items-center gap-2">
                  {user.isFollowing ? <FaUserCheck /> : <FaUserPlus />}
                  {user.isFollowing ? 'Following' : 'Follow'}
                </span>
              </button>
              <button className="bg-[#121225] text-white px-6 py-2 rounded-lg hover:bg-[#242440] flex items-center gap-2">
                <FaEnvelope />
                <span>Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
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

      {/* Content based on selected tab */}
      <div className="p-4">
        {activeTab === 'posts' && (
          <>
            {posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post._id} className="bg-[#1A1A2F] rounded-lg overflow-hidden">
                    {/* Post Header */}
                    <div className="p-4 flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/src/assets/profile1.png";
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{user.name}</h4>
                        <p className="text-gray-400 text-xs">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="px-4 pb-3">
                      <p className="text-white">{post.description}</p>
                    </div>

                    {/* Post Image */}
                    {post.content && post.content.length > 0 && (
                      <div className="w-full">
                        <img
                          src={`${BASE_URL}/${post.content[0]}`}
                          alt="Post"
                          className="w-full h-auto cursor-pointer"
                          onClick={() => handleImageClick(post)}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/src/assets/posts/default.jpg";
                          }}
                        />
                      </div>
                    )}

                    {/* Post Stats */}
                    <div className="px-4 py-2 border-t border-gray-700 text-sm text-gray-400 flex justify-between">
                      <span>{post.likes} likes</span>
                      <span>{post.comments} comments</span>
                    </div>

                    {/* Post Actions */}
                    <div className="px-4 py-2 border-t border-gray-700 flex justify-between">
                      <button className="flex items-center gap-2 text-white hover:text-[#f67a45] flex-1 justify-center py-1">
                        <FaRegHeart />
                        <span>Like</span>
                      </button>
                      <button className="flex items-center gap-2 text-white hover:text-[#f67a45] flex-1 justify-center py-1">
                        <FaComment />
                        <span>Comment</span>
                      </button>
                      {/* <button className="flex items-center gap-2 text-white hover:text-[#f67a45] flex-1 justify-center py-1">
                        <FaShare />
                        <span>Share</span>
                      </button> */}
                    </div>
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

      {/* Image Modal */}
      {selectedImagePost && (
        <PostImageModal
          post={{
            ...selectedImagePost,
            images: selectedImagePost.content.map(img => ({ preview: `${BASE_URL}/${img}` }))
          }}
          user={user}
          onClose={handleCloseImageModal}
          onLike={(postId, isLiked) => {
            // Handle like functionality if needed
          }}
        />
      )}
    </div>
  );
};

export default UserProfile;