import React, { useState, useEffect } from 'react';
import Post from './Post';
import CreatePost from './CreatePost';
import { motion } from 'framer-motion';
import { API_PATHS, BASE_URL } from '../../../utils/apiPaths';
import axiosInstance from '../../../utils/axiosInstance';

const PostFeed = ({profileImage}) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`${API_PATHS.POST.GET_FEED_POSTS}`);
        const data = await res.data;
    
        const formattedPosts = data.map(post => ({
          id: post._id,
          user: {
            name: post.user.name,
            username: `@${post.user.username}`,
            profileImage: `${BASE_URL}/${post.user.profileImageUrl}`
          },
          content: post.description,
          images: post.content.map(img => ({ preview: `${BASE_URL}/${img}` })),
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

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleLikePost = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked };
      }
      return post;
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <CreatePost onPostCreated={handleNewPost} profileImage={profileImage} />
      
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
              <Post post={post} onLike={handleLikePost} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default PostFeed;