import React, { useState, useRef, useEffect } from 'react';
import { FaUserEdit, FaTh, FaBookmark, FaCog, FaSignOutAlt, FaCamera, FaPen, 
         FaImage, FaChevronLeft, FaChevronRight, FaTimes, FaHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../../../utils/apiPaths";

const Profile = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPostImageIndex, setCurrentPostImageIndex] = useState(0);
  
  const [user, setUser] = useState([]);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get(`${API_PATHS.PROFILE.GET_PROFILE_INFO}`);
        setUser(response.data.user);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUserProfile();
  }, []);


  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get(`${API_PATHS.POST.GET_ALL_POSTS}`);
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, []);
  
  // Mock saved posts
  const [savedPosts, setSavedPosts] = useState([
    { 
      id: 4, 
      images: ['/src/assets/posts/workout1.png'], 
      likes: 120, 
      comments: 24, 
      caption: 'Great meal prep ideas for the week! #mealprep #healthyeating' 
    },
    { 
      id: 5, 
      images: [
        '/src/assets/posts/workout.png',
        '/src/assets/posts/workout1.png'
      ], 
      likes: 85, 
      comments: 10, 
      caption: 'Try this workout routine for building strength and endurance!' 
    },
  ]);

  // Handle opening the settings modal
  const handleOpenSettings = () => {
    setShowSettingsModal(true);
  };

  // Handle closing the settings modal
  const handleCloseSettings = () => {
    setShowSettingsModal(false);
  };

  // Handle opening the edit profile modal
  const handleEditProfile = () => {
    setShowSettingsModal(false);
    setShowEditProfileModal(true);
  };

  // Handle closing the edit profile modal
  const handleCloseEditProfile = () => {
    setShowEditProfileModal(false);
  };

  // Handle updating profile info
  const handleUpdateProfile = (updatedInfo) => {
    setUser({
      ...user,
      ...updatedInfo
    });
    setShowEditProfileModal(false);
  };

  // Handle logout
  const handleLogout = () => {
    // In a real app, this would clear auth tokens and redirect to login
    console.log("Logging out...");
    // Example redirect: window.location.href = '/';
  };

  // Handle creating a new post
  const handleCreatePost = () => {
    setShowPostModal(true);
  };

  // Handle adding a new post
  const handleAddPost = (newPost) => {
    const post = {
      id: Date.now(),
      images: newPost.images || ['/src/assets/posts/default.jpg'],
      likes: 0,
      comments: 0,
      caption: newPost.caption || ''
    };
    
    setPosts([post, ...posts]);
    setUser({
      ...user,
      posts: user.posts + 1
    });
    setShowPostModal(false);
  };

  // Handle viewing a post
  const handleViewPost = (post) => {
    setSelectedPost(post);
    setCurrentPostImageIndex(0);
  };

  // Handle closing the post view
  const handleClosePostView = () => {
    setSelectedPost(null);
    setCurrentPostImageIndex(0);
  };

  // Navigate to previous image in post view
  const handlePrevImage = () => {
    if (currentPostImageIndex > 0) {
      setCurrentPostImageIndex(currentPostImageIndex - 1);
    }
  };

  // Navigate to next image in post view
  const handleNextImage = () => {
    if (selectedPost && currentPostImageIndex < selectedPost.images.length - 1) {
      setCurrentPostImageIndex(currentPostImageIndex + 1);
    }
  };

  // Add state for window size
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  
  // Add effect to update window height on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Settings Modal Component
  const SettingsModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={handleCloseSettings}>
      <div className="bg-[#1A1A2F] rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-white text-xl font-bold mb-4">Settings</h3>
        <div className="space-y-3">
          <button 
            onClick={handleEditProfile}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#242440] text-white flex items-center gap-2"
          >
            <FaPen /> Edit Profile
          </button>
          <button 
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#242440] text-white flex items-center gap-2"
          >
            <FaCamera /> Change Profile Picture
          </button>
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#242440] text-red-400 flex items-center gap-2"
          >
            <FaSignOutAlt /> Log Out
          </button>
        </div>
        <div className="mt-6 text-right">
          <button 
            onClick={handleCloseSettings}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Edit Profile Modal Component
  const EditProfileModal = () => {
    const [name, setName] = useState(user.fullName);
    const [username, setUsername] = useState(user.username);
    const [bio, setBio] = useState(user.bio);

    const handleSubmit = (e) => {
      e.preventDefault();
      handleUpdateProfile({ name, username, bio });
    };

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={handleCloseEditProfile}>
        <div className="bg-[#1A1A2F] rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-white text-xl font-bold mb-4">Edit Profile</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white mb-1 block">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#121225] border border-gray-700 rounded-lg p-3 text-white focus:border-[#f67a45] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-white mb-1 block">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#121225] border border-gray-700 rounded-lg p-3 text-white focus:border-[#f67a45] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-white mb-1 block">Bio</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#121225] border border-gray-700 rounded-lg p-3 text-white resize-none h-24 focus:border-[#f67a45] focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button 
                type="button"
                onClick={handleCloseEditProfile}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-[#f67a45] text-white px-4 py-2 rounded-lg hover:bg-[#e56d3d] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Create Post Modal Component with multiple images
  const CreatePostModal = () => {
    const [caption, setCaption] = useState('');
    const [images, setImages] = useState([]);
    const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
    const fileInputRef = useRef(null);
    
    const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;
      
      // Limit to 5 images total
      const remainingSlots = 5 - images.length;
      const filesToProcess = files.slice(0, remainingSlots);
      
      const newImages = [];
      
      // Process each file
      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            file,
            preview: reader.result
          });
          
          // Update state after all images are processed
          if (newImages.length === filesToProcess.length) {
            setImages([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    };
    
    const handleRemoveImage = (index) => {
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
      
      if (currentPreviewIndex >= newImages.length && newImages.length > 0) {
        setCurrentPreviewIndex(newImages.length - 1);
      }
    };
    
    const handleNextImage = () => {
      if (currentPreviewIndex < images.length - 1) {
        setCurrentPreviewIndex(currentPreviewIndex + 1);
      }
    };
    
    const handlePrevImage = () => {
      if (currentPreviewIndex > 0) {
        setCurrentPreviewIndex(currentPreviewIndex - 1);
      }
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      if (images.length === 0 && !caption.trim()) return;
      
      handleAddPost({
        caption,
        images: images.map(img => img.preview)
      });
    };
    
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowPostModal(false)}>
        <div className="bg-[#1A1A2F] rounded-lg p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-white text-xl font-bold mb-4">Create New Post</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {images.length > 0 ? (
              <div className="relative border border-gray-700 rounded-lg overflow-hidden">
                <div className="relative">
                  <img 
                    src={images[currentPreviewIndex].preview} 
                    alt="Preview" 
                    className="max-h-80 w-full object-contain bg-black"
                  />
                  
                  {/* Image counter */}
                  <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                    {currentPreviewIndex + 1}/{images.length}
                  </div>
                  
                  {/* Navigation arrows */}
                  {images.length > 1 && (
                    <>
                      <button 
                        type="button"
                        onClick={handlePrevImage}
                        className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full ${currentPreviewIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/80'}`}
                        disabled={currentPreviewIndex === 0}
                      >
                        <FaChevronLeft />
                      </button>
                      <button 
                        type="button"
                        onClick={handleNextImage}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full ${currentPreviewIndex === images.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/80'}`}
                        disabled={currentPreviewIndex === images.length - 1}
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  )}
                  
                  {/* Remove current image button */}
                  <button 
                    type="button"
                    onClick={() => handleRemoveImage(currentPreviewIndex)}
                    className="absolute top-2 left-2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                {/* Image thumbnails */}
                {images.length > 1 && (
                  <div className="flex justify-center p-2 gap-2 bg-black/30">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentPreviewIndex(idx)}
                        className={`w-10 h-10 rounded-md overflow-hidden border-2 ${currentPreviewIndex === idx ? 'border-[#f67a45]' : 'border-transparent'}`}
                      >
                        <img 
                          src={img.preview} 
                          alt={`Thumbnail ${idx + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Add more images button */}
                {images.length < 5 && (
                  <div className="p-2 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="w-full py-2 bg-[#242440] text-white rounded-lg hover:bg-[#2a2a4a] transition-colors flex items-center justify-center gap-2"
                    >
                      <FaImage />
                      <span>Add More Images ({images.length}/5)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <label className="cursor-pointer flex flex-col items-center">
                  <FaCamera className="text-gray-400 text-3xl mb-2" />
                  <span className="text-gray-400 mb-2">Upload up to 5 images</span>
                  <span className="px-4 py-2 bg-[#242440] text-white rounded-lg hover:bg-[#2a2a4a] transition-colors">
                    Choose Images
                  </span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    ref={fileInputRef}
                    onChange={handleImageChange} 
                    className="hidden" 
                  />
                </label>
              </div>
            )}
            
            <div>
              <textarea 
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full bg-[#121225] border border-gray-700 rounded-lg p-3 text-white resize-none h-24 focus:border-[#f67a45] focus:outline-none"
              />
            </div>
            
            <input 
              type="file" 
              accept="image/*" 
              multiple={images.length < 5}
              ref={fileInputRef}
              onChange={handleImageChange} 
              className="hidden" 
            />
            
            <div className="flex justify-end gap-2">
              <button 
                type="button"
                onClick={() => setShowPostModal(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={images.length === 0 && !caption.trim()}
                className={`px-4 py-2 rounded-lg ${
                  images.length === 0 && !caption.trim()
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    : 'bg-[#f67a45] text-white hover:bg-[#e56d3d] transition-colors'
                }`}
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Post View Modal Component with multiple images support
  const PostViewModal = ({ post }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(currentPostImageIndex);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes);
    
    const handleLikeToggle = () => {
      if (isLiked) {
        setLikesCount(likesCount - 1);
      } else {
        setLikesCount(likesCount + 1);
      }
      setIsLiked(!isLiked);
    };
    
    const handlePrevImage = () => {
      if (currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
    };
    
    const handleNextImage = () => {
      if (currentImageIndex < post.images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={handleClosePostView}>
        <div className="bg-[#1A1A2F] rounded-lg overflow-hidden w-full max-w-3xl flex flex-col md:flex-row" onClick={(e) => e.stopPropagation()}>
          <div className="w-full md:w-1/2 bg-black relative">
            <img 
              src={post.images[currentImageIndex]} 
              alt={`Post ${currentImageIndex + 1}`} 
              className="w-full h-full object-contain max-h-[500px]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/src/assets/posts/default.jpg';
              }}
            />
            
            {post.images.length > 1 && (
              <>
                {/* Image counter */}
                <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                  {currentImageIndex + 1}/{post.images.length}
                </div>
                
                {/* Navigation arrows */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full ${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/80'}`}
                  disabled={currentImageIndex === 0}
                >
                  <FaChevronLeft />
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full ${currentImageIndex === post.images.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/80'}`}
                  disabled={currentImageIndex === post.images.length - 1}
                >
                  <FaChevronRight />
                </button>
                
                {/* Image indicators */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {post.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-[#f67a45]' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="w-full md:w-1/2 p-6 flex flex-col">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img 
                  src={user.profileImageUrl} 
                  alt={user.fullName} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-white font-medium">{user.fullName}</p>
                <p className="text-gray-400 text-sm">{user.username}</p>
              </div>
            </div>
            
            <div className="border-b border-gray-700 pb-4 mb-4">
              <p className="text-white whitespace-pre-wrap">{post.caption}</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center text-white/70">
                <button 
                  onClick={handleLikeToggle}
                  className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-white/70 hover:text-white'}`}
                >
                  <FaHeart size={18} />
                </button>
                <span className="ml-2">{likesCount} likes</span>
                <span className="mx-4">•</span>
                <span>{post.comments} comments</span>
              </div>
              
              <div className="text-gray-400 text-sm">
                Posted 3 hours ago
              </div>
            </div>
            
            <div className="flex-grow">
              {/* Comments would go here */}
            </div>
            
            <div className="mt-auto">
              <button 
                onClick={handleClosePostView}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-[#1A1A2F] to-[#0A0A1F] relative">
          <button 
            onClick={handleEditProfile}
            className="absolute top-4 right-4 bg-[#1A1A2F]/50 p-2 rounded-full text-white hover:bg-[#1A1A2F]/80"
          >
            <FaUserEdit size={18} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pt-16 pb-6 border-b border-gray-700">
          {/* Profile Picture */}
          <div className="absolute -top-14 left-6 w-28 h-28 rounded-full border-4 border-[#121225] overflow-hidden">
            <img 
              src={user.profileImageUrl ? `${BASE_URL}/${user.profileImageUrl}` : '/src/assets/profile1.png'}
              alt={user.fullName} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Settings Button */}
          <div className="flex justify-end mb-4">
            <button 
              onClick={handleOpenSettings}
              className="bg-[#1A1A2F] p-2 rounded-full text-white hover:bg-[#f67a45]/10 transition-colors"
            >
              <FaCog size={18} />
            </button>
          </div>
          
          {/* User Info */}
          <div>
            <h1 className="text-white text-2xl font-bold">{user.fullName}</h1>
            <p className="text-gray-400 mb-4">{`@${user.username}`}</p>
            
            <p className="text-white mb-6">{user.bio}</p>
            
            <div className="flex gap-6">
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
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex">
            <button 
              className={`flex-1 py-4 text-center ${activeTab === 'posts' 
                ? 'text-[#f67a45] border-b-2 border-[#f67a45]' 
                : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('posts')}
            >
              <FaTh className="inline-block mr-2" />
              Posts
            </button>
            <button 
              className={`flex-1 py-4 text-center ${activeTab === 'saved' 
                ? 'text-[#f67a45] border-b-2 border-[#f67a45]' 
                : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('saved')}
            >
              <FaBookmark className="inline-block mr-2" />
              Saved
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <AnimatePresence mode="wait">
            {activeTab === 'posts' && (
              posts.length > 0 ? (
                <motion.div 
                  key="posts"
                  className="grid grid-cols-3 gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {posts.map(post => (
                    <motion.div 
                      key={post._id} 
                      className="aspect-square overflow-hidden rounded-md cursor-pointer relative group"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleViewPost(post)}
                    >
                      <img 
                        key={post.id}
                        src={`${BASE_URL}/${post.content[0]}`}
                        alt="Post" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/src/assets/posts/default.jpg';
                        }}
                      />
                      {post.content.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-md text-xs">
                          <FaImage size={12} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="no-posts"
                  className="py-10 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-gray-400">No posts yet.</p>
                  <button 
                    onClick={handleCreatePost}
                    className="mt-4 bg-[#f67a45] text-white px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors"
                  >
                    Create Your First Post
                  </button>
                </motion.div>
              )
            )}
            
            {activeTab === 'saved' && (
              savedPosts.length > 0 ? (
                <motion.div 
                  key="saved"
                  className="grid grid-cols-3 gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {savedPosts.map(post => (
                    <motion.div 
                      key={post.id} 
                      className="aspect-square overflow-hidden rounded-md cursor-pointer relative group"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleViewPost(post)}
                    >
                      <img 
                        src={post.images[0]} 
                        alt="Saved Post" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/src/assets/posts/default.jpg';
                        }}
                      />
                      {post.images.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-md text-xs">
                          <FaImage size={12} />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 text-white">
                        <FaBookmark size={14} />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="no-saved"
                  className="py-10 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-gray-400">No saved posts.</p>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
        
        {/* Create Post Button */}
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleCreatePost}
            className="w-full bg-[#f67a45] text-white py-3 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-2"
          >
            <FaImage />
            <span>Create New Post</span>
          </button>
        </div>
        
        {/* Log Out Button */}
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="w-full py-3 text-[#f67a45] flex items-center justify-center gap-2 hover:bg-[#f67a45]/10 rounded-lg transition-colors"
          >
            <FaSignOutAlt />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {showSettingsModal && <SettingsModal />}
      {showEditProfileModal && <EditProfileModal />}
      {showPostModal && <CreatePostModal />}
      {selectedPost && <PostViewModal post={selectedPost} />}
    </div>
  );
};

export default Profile;