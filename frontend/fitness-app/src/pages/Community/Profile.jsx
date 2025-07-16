import React, { useState, useEffect, useContext } from "react";
import {
  FaUserEdit,
  FaTh,
  FaBookmark,
  FaCog,
  FaSignOutAlt,
  FaCamera,
  FaImage,
  FaRegHeart,
  FaHeart,
  FaComment,
  FaTrash,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import CreatePost from "../../components/Community/shared/CreatePost";
import Post from "../../components/Community/shared/Post";
import { formatDistanceToNow } from 'date-fns';

// Import modals
import SettingsModal from "../../components/Community/modals/SettingsModal";
import ProfilePictureModal from "../../components/Community/modals/ProfilePictureModal";
import EditProfileModal from "../../components/Community/modals/EditProfileModal";
import CreatePostModal from "../../components/Community/modals/CreatePostModal";
import PostImageModal from "../../components/Community/modals/PostImageModal";
import CommunityLayout from "../../layouts/CommunityLayout";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

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
  const { user: currentUser } = useContext(UserContext);

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
        
        // Format posts similar to Home component
        const formattedPosts = res.data.map(post => ({
          ...post,
          isliked: post.liked // Map the liked field to isliked for consistency
        }));
        
        setPosts(formattedPosts);
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
            isliked: isLiked
          };
        }
        return post;
      }));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  // Handle post deletion
  const handleDeletePost = async (postId) => {
    try {
      await axiosInstance.delete(API_PATHS.POST.DELETE_POST(postId));

      // Update local state
      setPosts(posts.filter(post => post._id !== postId));

      // Update user post count
      setUser(prevUser => ({
        ...prevUser,
        noOfPosts: Math.max(0, (prevUser.noOfPosts || 0) - 1)
      }));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axiosInstance.delete(API_PATHS.COMMENT.DELETE_COMMENT(postId, commentId));

      // Update local state - this would be handled by the Post component
      // but we can also update the comment count locally if needed
      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: Math.max(0, (post.comments || 0) - 1)
          };
        }
        return post;
      }));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
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
                    {posts.map((post) => {
                      // Format post data to match Post component expectations
                      const formattedPost = {
                        id: post._id,
                        user: {
                          id: post.userId,
                          name: user.fullName,
                          username: `@${user.username}`,
                          profileImage: user.profileImageUrl || "/default.jpg",
                        },
                        content: post.description,
                        images: post.content && post.content.length > 0 
                          ? post.content.map(img => ({ preview: img }))
                          : [],
                        likes: post.likes || 0,
                        isliked: post.isliked || false,
                        comments: post.comments || 0,
                        timestamp: post.createdAt
                      };

                      return (
                        <Post
                          key={post._id}
                          post={formattedPost}
                          onLike={handleLikePost}
                          onDelete={handleDeletePost}
                          onDeleteComment={handleDeleteComment}
                          currentUser={currentUser}
                          showOwnerActions={!userId || userId === currentUser?._id}
                        />
                      );
                    })}
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
            onLike={(postId, isLiked) => handleLikePost(postId, isLiked)}
          />
        )}
      </div>
    </CommunityLayout>
  );
};

export default CommunityProfile;
