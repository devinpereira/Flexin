export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login", // Done
    SIGNUP: "/api/v1/auth/signup", // Done
    GET_USER_INFO: "/api/v1/auth/getUserInfo", // Done
  },
  POST: {
    GET_FEED_POSTS: "/api/v1/posts/feed", // Done
    GET_ALL_POSTS: "/api/v1/posts/",
    GET_POST: (postId) => `/api/v1/posts/${postId}`,
    CREATE_POST: "/api/v1/posts", // Done
    UPDATE_POST: (postId) => `/api/v1/posts/${postId}`,
    DELETE_POST: (postId) => `/api/v1/posts/${postId}`,
    LIKE_POST: (postId) => `/api/v1/posts/${postId}/like`, // Done
    GET_USER_POSTS: (userId) => `/api/v1/posts/user/${userId}`, // Done
  },
  COMMENT: {
    GET_COMMENTS: (postId) => `/api/v1/comments/${postId}`, // Done
    ADD_COMMENT: (postId) => `/api/v1/comments/${postId}`, // Done
    DELETE_COMMENT: (postId, commentId) => `/api/v1/comments/${postId}/${commentId}`,
  },
  FOLLOW: {
    UNFOLLOW_USER: (followingId) => `/api/v1/friends/unfollow/${followingId}`, // Done
    GET_FOLLOWERS: (userId) => `/api/v1/friends/followers/${userId}`, // Done
    SEARCH_FOLLOWERS: (username) => `/api/v1/friends/search/${username}`, // Done
    SEND_FOLLOW_REQUEST: (followingId) => `/api/v1/friends/follow/${followingId}`, // Done
    APPROVE_FOLLOW_REQUEST: (followId) => `/api/v1/friends/approve/${followId}`,
    REJECT_FOLLOW_REQUEST: (followId) => `/api/v1/friends/reject/${followId}`,
    GET_FRIENDS: "/api/v1/friends/", // Done
    GET_FRIENDS: "/api/v1/friends/followers",
    GET_FOLLOWING: "/api/v1/friends/following",
    GET_SUGGESTIONS: "/api/v1/friends/suggestions",
  },
  PROFILE: {
    GET_PROFILE_INFO: "/api/v1/profile",
  },
};