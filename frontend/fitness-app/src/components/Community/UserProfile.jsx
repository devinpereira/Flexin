import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaEllipsisH, FaTh, FaRegHeart, FaComment, FaUserCheck, FaUserPlus } from 'react-icons/fa';
import { API_PATHS, BASE_URL } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import PostImageModal from './modals/PostImageModal';

const UserProfile = ({ user, onBack }) => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedImagePost, setSelectedImagePost] = useState(null);
  const [isFollowing, setIsFollowing] = useState(null);
  const [loadingFollow, setLoadingFollow] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(`/api/v1/profile/user/${user.id || user._id}`);
        setProfile(res.data.user);
        setPosts(res.data.posts);
        setIsFollowing(res.data.user.followStatus || null);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    fetchProfile();
  }, [user.id, user._id]);

  // Handle follow/unfollow like in search panel
  const handleFollowUser = async () => {
    if (!profile?.id) return;
    setLoadingFollow(true);
    try {
      if (isFollowing === "accepted") {
        await axiosInstance.delete(API_PATHS.FOLLOW.UNFOLLOW_USER(profile.id));
        setIsFollowing(null);
      } else {
        await axiosInstance.post(API_PATHS.FOLLOW.SEND_FOLLOW_REQUEST(profile.id));
        setIsFollowing("accepted");
      }
    } catch (err) {
      console.error("Error following/unfollowing user:", err);
    }
    setLoadingFollow(false);
  };

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

      {/* Profile Header */}
      {profile && (
        <div className="p-6 border-b border-gray-700 bg-[#1A1A2F]">
          <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#121225]">
              <img
                src={profile.profileImage ? `${BASE_URL}/${profile.profileImage}` : '/src/assets/profile1.png'}
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/src/assets/profile1.png';
                }}
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-white text-2xl font-bold">{profile.name}</h1>
              <p className="text-gray-400 mb-3">{profile.username}</p>
              <p className="text-white mb-4">{profile.bio}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4">
                <div className="text-center">
                  <p className="text-white font-bold">{profile.posts}</p>
                  <p className="text-gray-400 text-sm">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold">{profile.followers}</p>
                  <p className="text-gray-400 text-sm">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold">{profile.following}</p>
                  <p className="text-gray-400 text-sm">Following</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                <button
                  className={`px-6 py-2 rounded-lg flex items-center gap-2 ${isFollowing === "accepted"
                    ? "bg-gray-700 text-white"
                    : "bg-[#f67a45] text-white hover:bg-[#e56d3d]"
                    }`}
                  onClick={handleFollowUser}
                  disabled={loadingFollow}
                >
                  {isFollowing === "accepted" ? (
                    <>
                      <FaUserCheck />
                      Following
                    </>
                  ) : (
                    <>
                      <FaUserPlus />
                      Follow
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Only show Posts tab */}
      <div className="border-b border-gray-700">
        <div className="flex">
          <button
            className="flex-1 py-4 text-center text-[#f67a45] border-b-2 border-[#f67a45]"
            style={{ cursor: "default" }}
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
                      src={profile.profileImage ? `${BASE_URL}/${profile.profileImage}` : '/src/assets/profile1.png'}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/src/assets/profile1.png";
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{profile.name}</h4>
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
                      onClick={() => setSelectedImagePost(post)}
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

      {/* Image Modal */}
      {selectedImagePost && (
        <PostImageModal
          post={{
            ...selectedImagePost,
            images: selectedImagePost.content.map(img => ({ preview: `${BASE_URL}/${img}` }))
          }}
          user={profile}
          onClose={() => setSelectedImagePost(null)}
          onLike={() => { }}
        />
      )}
    </div>
  );
};

export default UserProfile;