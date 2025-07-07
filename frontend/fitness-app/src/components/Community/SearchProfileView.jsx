import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaUserPlus, FaUserCheck, FaTh, FaRegHeart, FaComment } from 'react-icons/fa';
import { API_PATHS, BASE_URL } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { formatDistanceToNow } from 'date-fns';
import PostImageModal from './modals/PostImageModal';

const SearchProfileView = ({ userId, onBack }) => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followStatus, setFollowStatus] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loadingFollow, setLoadingFollow] = useState(false);

  // Fetch user profile and posts
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Fetch user profile
        const profileRes = await axiosInstance.get(API_PATHS.PROFILE.GET_USER_PROFILE(userId));
        setProfile(profileRes.data.user);
        setFollowStatus(profileRes.data.user.followStatus);

        // Fetch user posts
        const postsRes = await axiosInstance.get(API_PATHS.POST.GET_USER_POSTS(userId));
        setPosts(postsRes.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Handle follow/unfollow user
  const handleFollowAction = async () => {
    if (!profile || loadingFollow) return;

    setLoadingFollow(true);
    try {
      if (followStatus === "accepted") {
        // Unfollow user
        await axiosInstance.delete(API_PATHS.FOLLOW.UNFOLLOW_USER(userId));
        setFollowStatus(null);
      } else {
        // Follow user
        await axiosInstance.post(API_PATHS.FOLLOW.SEND_FOLLOW_REQUEST(userId));
        setFollowStatus("accepted"); // Assuming auto-acceptance for simplicity
      }
    } catch (err) {
      console.error("Error following/unfollowing user:", err);
    } finally {
      setLoadingFollow(false);
    }
  };

  // Handle opening post image modal
  const handleImageClick = (post) => {
    setSelectedPost(post);
  };

  // Handle post like
  const handleLikePost = async (postId, isLiked) => {
    try {
      await axiosInstance.post(API_PATHS.POST.LIKE_POST(postId));

      // Update local state
      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
            liked: isLiked
          };
        }
        return post;
      }));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#121225] rounded-lg p-6 flex justify-center items-center min-h-[300px]">
        <div className="w-10 h-10 border-4 border-[#f67a45] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-[#121225] rounded-lg p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-[#f67a45] mb-4"
        >
          <FaArrowLeft />
          <span>Back to Search</span>
        </button>
        <div className="text-center py-8">
          <p className="text-white/70">User profile not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden">
      {/* Header with back button */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-[#f67a45] transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Search</span>
        </button>
      </div>

      {/* Profile Header */}
      <div className="p-6 border-b border-gray-700 bg-[#1A1A2F]">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Image */}
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#121225]">
            <img
              src={profile.profileImageUrl || "/src/assets/profile1.png"}
              alt={profile.fullName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/src/assets/profile1.png";
              }}
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-white text-2xl font-bold">{profile.fullName}</h1>
            <p className="text-gray-400 mb-3">@{profile.username}</p>
            <p className="text-white/80 mb-4">{profile.bio || "No bio available"}</p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4">
              <div className="text-center">
                <p className="text-white font-bold">{profile.noOfPosts || 0}</p>
                <p className="text-gray-400 text-sm">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">{profile.followers || 0}</p>
                <p className="text-gray-400 text-sm">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">{profile.following || 0}</p>
                <p className="text-gray-400 text-sm">Following</p>
              </div>
            </div>

            {/* Follow/Unfollow Button */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <button
                className={`px-6 py-2 rounded-lg flex items-center gap-2 ${followStatus === "accepted"
                    ? "bg-gray-700 text-white"
                    : "bg-[#f67a45] text-white hover:bg-[#e56d3d]"
                  }`}
                onClick={handleFollowAction}
                disabled={loadingFollow}
              >
                {loadingFollow ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : followStatus === "accepted" ? (
                  <FaUserCheck />
                ) : (
                  <FaUserPlus />
                )}
                <span>{followStatus === "accepted" ? "Following" : "Follow"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Tab */}
      <div className="border-b border-gray-700">
        <div className="flex">
          <button
            className="flex-1 py-4 text-center text-[#f67a45] border-b-2 border-[#f67a45]"
          >
            <FaTh className="inline-block mr-2" />
            Posts
          </button>
        </div>
      </div>

      {/* Posts Content */}
      <div className="p-4">
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post._id} className="bg-[#1A1A2F] rounded-lg overflow-hidden">
                {/* Post Header */}
                <div className="p-4 flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img
                      src={profile.profileImageUrl || "/src/assets/profile1.png"}
                      alt={profile.fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/src/assets/profile1.png";
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{profile.fullName}</h4>
                    <p className="text-gray-400 text-xs">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
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
                      src={post.content[0]}
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
                  <span>{post.likes || 0} likes</span>
                  <span>{post.comments || 0} comments</span>
                </div>

                {/* Post Actions */}
                <div className="px-4 py-2 border-t border-gray-700 flex justify-between">
                  <button
                    className="flex items-center gap-2 text-white hover:text-[#f67a45] flex-1 justify-center py-1"
                    onClick={() => handleLikePost(post._id, !post.liked)}
                  >
                    <FaRegHeart />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center gap-2 text-white hover:text-[#f67a45] flex-1 justify-center py-1">
                    <FaComment />
                    <span>Comment</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-gray-400">No posts yet.</p>
          </div>
        )}
      </div>

      {/* Post Image Modal */}
      {selectedPost && (
        <PostImageModal
          post={{
            ...selectedPost,
            images: selectedPost.content.map(img => ({ preview: img }))
          }}
          user={profile}
          onClose={() => setSelectedPost(null)}
          onLike={(postId, isLiked) => handleLikePost(postId, isLiked)}
        />
      )}
    </div>
  );
};

export default SearchProfileView;
