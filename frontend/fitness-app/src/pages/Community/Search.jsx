import React, { useState, useEffect } from "react";
import { FaSearch, FaUserPlus, FaUserCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import CommunityLayout from "../../layouts/CommunityLayout";
import { useNavigate } from "react-router-dom";

const CommunitySearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Fetch users from backend based on search query
  const searchFriends = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.FOLLOW.SEARCH_FOLLOWERS(searchTerm)}`
      );
      const users = response.data;

      const formattedUsers = users.map((user) => ({
        id: user._id,
        name: user.fullName,
        username: `@${user.username}`,
        profileImage: user.profileImageUrl || "/src/assets/profile1.png",
        bio: user.bio || "",
        posts: user.noOfPosts,
        followers: user.followers,
        following: user.following,
        isFollowing: user.followStatus,
      }));

      setSearchResults(formattedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFollowUser = async (userId, isFollowing, e) => {
    e.stopPropagation();

    try {
      if (isFollowing == "accepted") {
        await axiosInstance.delete(`${API_PATHS.FOLLOW.UNFOLLOW_USER(userId)}`);
      } else {
        await axiosInstance.post(
          `${API_PATHS.FOLLOW.SEND_FOLLOW_REQUEST(userId)}`
        );
      }
      // Update the local state to reflect the follow/unfollow action
      setSearchResults((prevResults) =>
        prevResults.map((user) =>
          user.id === userId
            ? {
                ...user,
                isFollowing: isFollowing === "accepted" ? false : "accepted",
              }
            : user
        )
      );
    } catch (err) {
      console.error("Error following/unfollowing user:", err);
    }
  };

  const handleUserClick = (user) => {
    navigate(`/community/profile/${user.id}`);
  };

  // Whenever searchQuery changes, trigger the search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchFriends(searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <CommunityLayout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
          <h3 className="text-white text-xl font-bold mb-6">Search Users</h3>

          {/* Search Input */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A2F] border border-gray-700 rounded-lg pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
            />
            <FaSearch
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>

          {/* Search Results */}
          <div>
            {isSearching ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#f67a45]"></div>
              </div>
            ) : searchQuery.trim() !== "" && searchResults.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-white/70">
                  No users found matching "{searchQuery}"
                </p>
              </div>
            ) : (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {searchResults.map((user) => (
                  <motion.div
                    key={user.id}
                    className="bg-[#1A1A2F] p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-[#242440] transition duration-200"
                    onClick={() => handleUserClick(user)}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
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
                        <p className="text-gray-400 text-sm">{user.username}</p>
                      </div>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-full ${
                        user.isFollowing === "accepted"
                          ? "bg-gray-700 text-white"
                          : "bg-[#f67a45] text-white hover:bg-[#e56d3d]"
                      }`}
                      onClick={(e) =>
                        handleFollowUser(user.id, user.isFollowing, e)
                      }
                    >
                      {user.isFollowing === "accepted" ? (
                        <span className="flex items-center gap-2">
                          <FaUserCheck size={14} />
                          Following
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <FaUserPlus size={14} />
                          Follow
                        </span>
                      )}
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default CommunitySearch;
