import React, { useContext, useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShare,
  FaEllipsisH,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { formatDistanceToNow } from 'date-fns';
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../../../utils/apiPaths";

const Post = ({ post, onLike }) => {
  const [liked, setLiked] = useState(post.isliked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(post.comments);

  const handleLike = async () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      await axiosInstance.post(`${API_PATHS.POST.LIKE_POST(post.id)}`);
      if (onLike) onLike(post.id);
    } catch (err) {
      setLiked(liked);
      setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
      console.error("Failed to like/unlike post:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await axiosInstance.post(
        `${API_PATHS.COMMENT.ADD_COMMENT(post.id)}`,
        {
          comment: commentText,
        }
      );

      const newComment = {
        _id: res.data._id,
        userId: {
          fullName: res.data.user.fullName,
          profileImageUrl: res.data.user.profileImageUrl,
        },
        comment: res.data.comment,
        createdAt: new Date(res.data.createdAt).toISOString(),
      };

      setCommentCount((prev) => prev + 1);
      setComments([newComment, ...comments]);
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  // Fetch comments on button click
  const handleCommentClick = async () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      try {
        const response = await axiosInstance.get(
          `${API_PATHS.COMMENT.GET_COMMENTS(post.id)}`
        );
        setComments(response.data);
      } catch (err) {
        console.error("Error fetching comments:", err.message);
      }
    }
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => {
      if (post.images && Array.isArray(post.images)) {
        return prev < post.images.length - 1 ? prev + 1 : prev;
      }
      return prev;
    });
  };

  React.useEffect(() => {
    const handleClickOutside = () => setShowMenu(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Check if we have multiple images
  const hasMultipleImages =
    post.images && Array.isArray(post.images) && post.images.length > 0;

  return (
    <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
      {/* Post Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
            <img
              src={post.user.profileImage}
              alt={post.user.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/src/assets/profile1.png";
              }}
            />
          </div>
          <div>
            <h4 className="text-white font-medium">{post.user.name}</h4>
            <div className="flex items-center">
              <span className="text-gray-400 text-sm">
                {post.user.username} • {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            className="text-white/70 p-2 rounded-full hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <FaEllipsisH />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 bg-[#1A1A2F] border border-gray-700 rounded shadow-lg py-2 min-w-[150px] z-10">
              <button className="w-full text-left px-4 py-2 text-white hover:bg-[#f67a45]/10 text-sm">
                Save Post
              </button>
              <button className="w-full text-left px-4 py-2 text-white hover:bg-[#f67a45]/10 text-sm">
                Report Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <p className="text-white mb-4">{post.content}</p>

      {/* Post Image(s) */}
      {hasMultipleImages ? (
        <div className="rounded-lg overflow-hidden mb-4 relative">
          <img
            src={post.images[currentImageIndex].preview}
            alt={`Post ${currentImageIndex + 1}`}
            className="w-full h-auto max-h-[500px] object-contain bg-black"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/src/assets/posts/default.jpg";
            }}
          />

          {post.images.length > 1 && (
            <>
              {/* Image Counter */}
              <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                {currentImageIndex + 1}/{post.images.length}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevImage();
                }}
                className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full ${currentImageIndex === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-black/80"
                  }`}
                disabled={currentImageIndex === 0}
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextImage();
                }}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full ${currentImageIndex === post.images.length - 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-black/80"
                  }`}
                disabled={currentImageIndex === post.images.length - 1}
              >
                <FaChevronRight />
              </button>

              {/* Thumbnail Indicators */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {post.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? "bg-[#f67a45]" : "bg-white/50"
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        post.image && (
          <div className="rounded-lg overflow-hidden mb-4">
            <img
              src={post.images[0].preview}
              alt="Post"
              className="w-full h-auto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/src/assets/posts/default.jpg";
              }}
            />
          </div>
        )
      )}

      {/* Post Stats */}
      <div className="flex text-white/70 text-sm mb-4">
        <span className="mr-4">{likesCount} likes</span>
        <button
          className="mr-4 hover:text-white"
          onClick={() => setShowComments(!showComments)}
        >
          {commentCount} comments
        </button>
      </div>

      {/* Post Actions */}
      <div className="flex border-t border-gray-700 pt-4">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10 flex-1 justify-center ${liked ? "text-[#f67a45]" : "text-white"
            }`}
          onClick={handleLike}
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
          <span>Like</span>
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10 text-white flex-1 justify-center"
          onClick={handleCommentClick}
        >
          <FaComment />
          <span>Comment</span>
        </button>
        {/* <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10 text-white flex-1 justify-center">
          <FaShare />
          <span>Share</span>
        </button> */}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-gray-700 pt-4">
          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="flex mb-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-[#1A1A2F] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className={`ml-2 px-4 py-2 rounded-lg ${!commentText.trim()
                  ? "bg-gray-600 text-gray-400"
                  : "bg-[#f67a45] text-white hover:bg-[#e56d3d]"
                }`}
            >
              Post
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="flex">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
                  <img
                    src={
                      comment.userId?.profileImageUrl
                        ? `${BASE_URL}/${comment.userId.profileImageUrl}`
                        : "/src/assets/profile1.png"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-[#1A1A2F] rounded-lg p-3 flex-1">
                  <div className="flex justify-between">
                    <span className="text-white font-medium">
                      {comment.userId.fullName}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-white/90">{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
