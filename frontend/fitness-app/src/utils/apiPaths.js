export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    SIGNUP: "/api/v1/auth/signup",
    GET_USER_INFO: "/api/v1/auth/getUserInfo",
  },
  POST: {
    GET_FEED_POSTS: "/api/v1/posts/feed",
    GET_ALL_POSTS: "/api/v1/posts/",
    GET_POST: (postId) => `/api/v1/posts/${postId}`,
    CREATE_POST: "/api/v1/posts",
    UPDATE_POST: (postId) => `/api/v1/posts/${postId}`,
    DELETE_POST: (postId) => `/api/v1/posts/${postId}`,
    LIKE_POST: (postId) => `/api/v1/posts/${postId}/like`,
  },
  COMMENT: {
    GET_COMMENTS: (commentId) => `/api/v1/comments/${commentId}`,
    ADD_COMMENT: (commentId) => `/api/v1/comments/${commentId}`,
    DELETE_COMMENT: (postId, commentId) => `/api/v1/comments/${postId}/${commentId}`,
  },
  FOLLOW: {
    UNFOLLOW_USER: (followingId) => `/api/v1/friends/unfollow/${followingId}`,
    GET_FOLLOWERS: (userId) => `/api/v1/friends/followers/${userId}`,
    SEARCH_FOLLOWERS: (username) => `/api/v1/friends/search/${username}`,
    SEND_FOLLOW_REQUEST: (followingId) => `/api/v1/friends/follow/${followingId}`,
    APPROVE_FOLLOW_REQUEST: (followId) => `/api/v1/friends/approve/${followId}`,
    REJECT_FOLLOW_REQUEST: (followId) => `/api/v1/friends/reject/${followId}`,

  },
  PROFILE: {
    GET_PROFILE_INFO: "/api/v1/profile",
  },
};
