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
    FOLLOW_USER: "/api/v1/follow/followUser",
  }
};
