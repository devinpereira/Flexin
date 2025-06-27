import React, { useState, useEffect } from 'react';
import Post from '../../../components/Community/shared/Post';
import CreatePost from '../../../components/Community/shared/CreatePost';
import { motion } from 'framer-motion';
import { API_PATHS, BASE_URL } from '../../../utils/apiPaths';
import axiosInstance from '../../../utils/axiosInstance';

/**
 * Home - The main feed component for the Community module
 * 
 * This component renders the user's post feed, including a form to create new posts
 * and a list of existing posts from the user and their connections.
 * 
 * Features:
 * - Post creation interface
 * - Infinite scrolling post feed (could be implemented)
 * - Post interaction handlers (like, comment, etc.)
 * - Animated post loading with framer-motion
 * - Loading states and error handling
 * 
 * @param {string} profileImage - URL for the current user's profile image
 * @param {boolean} createMode - If true, focuses on the create post component
 */
const Home = ({ profileImage, createMode = false }) => {
  // State for posts loaded from the API
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts from the API on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`${API_PATHS.POST.GET_FEED_POSTS}`);
        const data = await res.data;

        // Transform API data to match component's expected format
        const formattedPosts = data.map(post => ({
          id: post._id,
          user: {
            name: post.user.name,
            username: `@${post.user.username}`,
            profileImage: post.user.profileImageUrl?.startsWith('http')
              ? post.user.profileImageUrl
              : `${BASE_URL}/${post.user.profileImageUrl}`
          },
          content: post.description,
          images: post.content.map(img => ({
            preview: img.startsWith('http') ? img : `${BASE_URL}/${img}`
          })),
          likes: post.likes,
          isliked: post.liked,
          comments: post.comments,
          timestamp: new Date(post.createdAt).toLocaleString()
        }));

        setPosts(formattedPosts);
        setError(null);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  /**
   * Handle a new post being created
   * Adds the new post to the beginning of the posts list
   * 
   * @param {Object} newPost - The newly created post data from the API
   */
  const handleNewPost = (newPost) => {
    // Format the new post to match the structure of other posts
    const formattedNewPost = {
      id: newPost.id || newPost._id,
      user: {
        name: newPost.user?.name,
        username: newPost.user?.username?.startsWith('@')
          ? newPost.user.username
          : `@${newPost.user?.username}`,
        profileImage: newPost.user?.profileImage?.startsWith('http')
          ? newPost.user.profileImage
          : newPost.user?.profileImageUrl?.startsWith('http')
            ? newPost.user.profileImageUrl
            : newPost.user?.profileImage
              ? `${BASE_URL}/${newPost.user.profileImage}`
              : newPost.user?.profileImageUrl
                ? `${BASE_URL}/${newPost.user.profileImageUrl}`
                : "/src/assets/profile1.png"
      },
      content: newPost.content || newPost.description,
      images: (newPost.images && newPost.images.length > 0)
        ? newPost.images
        : (newPost.content && Array.isArray(newPost.content))
          ? newPost.content.map(img => ({
            preview: img.startsWith('http') ? img : `${BASE_URL}/${img}`
          }))
          : [],
      likes: newPost.likes || 0,
      isliked: newPost.isliked || false,
      comments: newPost.comments || 0,
      timestamp: new Date().toLocaleString()
    };

    setPosts(prevPosts => [formattedNewPost, ...prevPosts]);
  };

  /**
   * Handle liking/unliking a post
   * Updates the UI optimistically before API confirmation
   * 
   * @param {string} postId - ID of the post being liked
   * @param {boolean} isLiked - New like state
   */
  const handleLikePost = (postId, isLiked) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: isLiked ? post.likes + 1 : post.likes - 1,
          isliked: isLiked
        };
      }
      return post;
    }));
  };

  /**
   * Handle post deletion
   * Removes the post from the UI and optionally calls API
   * 
   * @param {string} postId - ID of the post to delete
   */
  const handleDeletePost = async (postId) => {
    try {
      // For development purposes, just update the UI
      setPosts(posts.filter(post => post.id !== postId));

      // In production, this would call the API
      // await axiosInstance.delete(`${API_PATHS.POST.DELETE_POST(postId)}`);
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  /**
   * Handle updating post content
   * Updates post data in the UI
   * 
   * @param {string} postId - ID of the post to update
   * @param {Object} updatedData - New post data
   */
  const handleUpdatePost = (postId, updatedData) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, ...updatedData };
      }
      return post;
    }));
  };

  // If createMode is true, focus on the create post component
  useEffect(() => {
    if (createMode) {
      // Scroll to the top of the page to focus on the create post form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [createMode]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Post Creation Component */}
      <CreatePost onPostCreated={handleNewPost} profileImage={profileImage} />

      {/* Loading State */}
      {isLoading ? (
        <div className="my-8 flex justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-[#1A1A2F] h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-[#1A1A2F] rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-[#1A1A2F] rounded"></div>
                <div className="h-4 bg-[#1A1A2F] rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : error ? (
        // Error State
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 my-6 text-center text-white">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        // Posts List with Animation
        <motion.div
          className="space-y-6 my-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Post
                post={post}
                onLike={handleLikePost}
                onDelete={handleDeletePost}
                onUpdate={handleUpdatePost}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Home;
