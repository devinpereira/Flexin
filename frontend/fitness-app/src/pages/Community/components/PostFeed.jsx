import React, { useState, useEffect } from 'react';
import Post from './Post';
import CreatePost from './CreatePost';
import { motion } from 'framer-motion';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching posts from an API
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - in a real app, this would be an API call
        const mockPosts = [
          {
            id: 1,
            user: {
              name: 'Sarah Johnson',
              username: '@sarahjohnson',
              profileImage: '/src/assets/trainers/trainer2.png'
            },
            content: 'Just finished a great workout session! 💪 Feeling energized and ready for the day. #FitnessJourney #MorningWorkout',
            image: '/src/assets/posts/workout.png',
            likes: 24,
            comments: 8,
            shares: 3,
            timestamp: '2 hours ago'
          },
          {
            id: 2,
            user: {
              name: 'Mike Chen',
              username: '@mikechen',
              profileImage: '/src/assets/trainers/trainer3.png'
            },
            content: 'Here\'s my meal prep for the week! Healthy eating is 80% of the fitness battle. What are your favorite meal prep recipes?',
            image: '/src/assets/posts/workout1.png',
            likes: 42,
            comments: 15,
            shares: 7,
            timestamp: '5 hours ago'
          },
          {
            id: 3,
            user: {
              name: 'Alex Rivera',
              username: '@alexrivera',
              profileImage: '/src/assets/trainers/trainer5.png'
            },
            content: 'New personal record on deadlifts today! 315 lbs x 5 reps. Hard work pays off! #Gains #PersonalRecord',
            image: null,
            likes: 36,
            comments: 12,
            shares: 2,
            timestamp: '1 day ago'
          }
        ];
        
        setPosts(mockPosts);
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
      <CreatePost onPostCreated={handleNewPost} />
      
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
          {posts.map(post => (
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