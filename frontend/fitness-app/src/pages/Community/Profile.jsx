import React, { useState, useEffect } from "react";
import {
  FaUserEdit,
  FaTh,
  FaBookmark,
  FaCog,
  FaSignOutAlt,
  FaCamera,
  FaImage,
  FaRegHeart,
  FaComment,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import CreatePost from "../../components/Community/shared/CreatePost";

// Import modals
import SettingsModal from "../../components/Community/modals/SettingsModal";
import ProfilePictureModal from "../../components/Community/modals/ProfilePictureModal";
import EditProfileModal from "../../components/Community/modals/EditProfileModal";
import CreatePostModal from "../../components/Community/modals/CreatePostModal";
import PostImageModal from "../../components/Community/modals/PostImageModal";
import CommunityLayout from "../../layouts/CommunityLayout";
import { useNavigate, useParams } from "react-router-dom";

const CommunityProfile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedImagePost, setSelectedImagePost] = useState(null);
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const url = userId
          ? API_PATHS.PROFILE.GET_USER_PROFILE(userId)
          : API_PATHS.PROFILE.GET_PROFILE_INFO;
        const response = await axiosInstance.get(url);
        setUser(response.data.user);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchUserProfile();
  }, [userId]);

  // Fetch user posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = userId
          ? API_PATHS.POST.GET_USER_POSTS(userId)
          : API_PATHS.POST.GET_ALL_POSTS;
        const res = await axiosInstance.get(url);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, [userId]);

  // Modal handlers
  const handleOpenSettings = () => setShowSettingsModal(true);
  const handleCloseSettings = () => setShowSettingsModal(false);

  const handleEditProfile = () => {
    setShowSettingsModal(false);
    setShowEditProfileModal(true);
  };

  const handleCloseEditProfile = () => setShowEditProfileModal(false);

  const handleUpdateProfile = (profileData, setSubmitting) => {
    // Simulate API call with timeout
    setTimeout(() => {
      // Update user state with updated data
      setUser({
        ...user,
        fullName: profileData.name,
        username: profileData.username,
        bio: profileData.bio,
      });

      setShowEditProfileModal(false);
      setSubmitting(false);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/logout");
  };

  const handleCreatePost = () => setShowPostModal(true);

  const handleAddPost = (newPost) => {
    const post = {
      id: Date.now(),
      images: newPost.images,
      likes: 0,
      comments: 0,
      caption: newPost.caption || "",
    };

    setPosts([post, ...posts]);
    setUser({
      ...user,
      posts: user.posts + 1,
    });
    setShowPostModal(false);
  };

  // Handle saving profile picture
  const handleSaveProfilePicture = async (file, preview, setUploading) => {
    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await axiosInstance.patch(API_PATHS.PROFILE.UPDATE_PROFILE_PIC, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setUser((prev) => ({
          ...prev,
          profileImageUrl: res.data.profileImageUrl,
        }));
      }

      setShowProfilePictureModal(false);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
    finally{
      setUploading(false);
    }
      // Update user state with new profile image
      setUser({
        ...user,
        profileImageUrl: preview, // Using the preview URL for demonstration
      });

      // Close modal

  };

  // Handle image click for post modal
  const handleImageClick = (post) => {
    setSelectedImagePost(post);
  };

  // Handle closing the image modal
  const handleCloseImageModal = () => {
    setSelectedImagePost(null);
  };

  // Handle new post created
  const handlePostCreated = (newPost) => {
    // Format the new post to match the structure of other posts
    const formattedNewPost = {
      _id: newPost._id,
      description: newPost.description,
      content: newPost.content || [],
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      user: {
        fullName: user.fullName,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
      },
    };

    setPosts([formattedNewPost, ...posts]);

    // Update user post count
    setUser({
      ...user,
      noOfPosts: (user.noOfPosts || 0) + 1,
    });
  };

  return (
    <CommunityLayout>
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-[#1A1A2F] px-6 pt-6 pb-6">
            <div className="flex flex-col items-center">
              {/* Profile Picture */}
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-[#121225] overflow-hidden">
                  <img
                    src={
                      user.profileImageUrl
                        ? user.profileImageUrl
                        : "/default.jpg"
                    }
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {!userId && (
                  <button
                    onClick={() => setShowProfilePictureModal(true)}
                    className="absolute bottom-0 right-0 bg-[#f67a45] text-white p-2 rounded-full hover:bg-[#e56d3d]"
                  >
                    <FaCamera size={16} />
                  </button>
                )}
              </div>

              {/* User Info */}
              <div className="text-center">
                <h1 className="text-white text-2xl font-bold">
                  {user.fullName}
                </h1>
                <p className="text-gray-400 mb-4">{`@${user.username}`}</p>
                <p className="text-white mb-6 max-w-lg mx-auto">{user.bio}</p>

                <div className="flex justify-center gap-6 mb-4">
                  <div className="text-center">
                    <p className="text-white font-bold">{user.noOfPosts}</p>
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
                {!userId && (
                  <div className="flex gap-3 justify-center mb-2">
                    <button
                      onClick={handleEditProfile}
                      className="bg-[#f67a45] text-white px-5 py-2 rounded-lg hover:bg-[#e56d3d] transition-colors flex items-center gap-2"
                    >
                      <FaUserEdit size={16} />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={handleOpenSettings}
                      className="bg-[#1A1A2F] text-white px-4 py-2 rounded-lg hover:bg-[#242440] transition-colors"
                    >
                      <FaCog size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Create Post Section */}
          {!userId && (
            <div className="p-4 border-b border-gray-700">
              <CreatePost
                onPostCreated={handlePostCreated}
                profileImage={
                  user.profileImageUrl ? user.profileImageUrl : "/default.jpg"
                }
              />
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-700">
            <div className="flex">
              <button
                className={`flex-1 py-4 text-center ${
                  activeTab === "posts"
                    ? "text-[#f67a45] border-b-2 border-[#f67a45]"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("posts")}
              >
                <FaTh className="inline-block mr-2" />
                Posts
              </button>
              <button
                className={`flex-1 py-4 text-center ${
                  activeTab === "saved"
                    ? "text-[#f67a45] border-b-2 border-[#f67a45]"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("saved")}
              >
                <FaBookmark className="inline-block mr-2" />
                Saved
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {activeTab === "posts" && (
              <>
                {posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div
                        key={post._id}
                        className="bg-[#1A1A2F] rounded-lg overflow-hidden"
                      >
                        {/* Post Header */}
                        <div className="p-4 flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                            <img
                              src={
                                user.profileImageUrl
                                  ? user.profileImageUrl
                                  : "/default.jpg"
                              }
                              alt={user.fullName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/default.jpg";
                              }}
                            />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">
                              {user.fullName}
                            </h4>
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
                              src={post.content[0]}
                              alt="Post"
                              className="w-full h-auto cursor-pointer"
                              onClick={() => handleImageClick(post)}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/post-default.jpg";
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
                    {!userId && (
                      <button
                        onClick={handleCreatePost}
                        className="mt-4 bg-[#f67a45] text-white px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors"
                      >
                        Create Your First Post
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {activeTab === "saved" && (
              <div className="py-10 text-center">
                <p className="text-gray-400">No saved posts.</p>
              </div>
            )}
          </div>

          {/* Log Out Button */}
          {!userId && (
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full py-3 text-[#f67a45] flex items-center justify-center gap-2 hover:bg-[#f67a45]/10 rounded-lg transition-colors"
              >
                <FaSignOutAlt />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Modals */}
        {showSettingsModal && (
          <SettingsModal
            onClose={handleCloseSettings}
            onEditProfile={handleEditProfile}
            onLogout={handleLogout}
          />
        )}

        {showEditProfileModal && (
          <EditProfileModal
            onClose={handleCloseEditProfile}
            user={user}
            onSubmit={handleUpdateProfile}
          />
        )}

        {showProfilePictureModal && (
          <ProfilePictureModal
            onClose={() => setShowProfilePictureModal(false)}
            user={user}
            onSave={handleSaveProfilePicture}
          />
        )}

        {showPostModal && (
          <CreatePostModal
            onClose={() => setShowPostModal(false)}
            onSubmit={handleAddPost}
          />
        )}

        {selectedImagePost && (
          <PostImageModal
            post={{
              ...selectedImagePost,
              images: selectedImagePost.content.map((img) => ({
                preview: img,
              })),
            }}
            user={user}
            onClose={handleCloseImageModal}
            onLike={(postId, isLiked) => {
              // Handle like functionality if needed
            }}
          />
        )}
      </div>
    </CommunityLayout>
  );
};

export default CommunityProfile;
