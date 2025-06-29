export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login", // Done
    SIGNUP: "/api/v1/auth/signup", // Done
    GET_USER_INFO: "/api/v1/auth/getUserInfo", // Done
    GOOGLE_LOGIN: "/api/v1/auth/google", // Done
    GOOGLE_CALLBACK: "/api/v1/auth/google/callback", // Done
    SEND_OTP: "api/v1/auth/send-verify-otp", // Done
    VERIFY_OTP: "api/v1/auth/verify-otp", // Done
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    RESET_PASSWORD: "/api/v1/auth/reset-password",
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
    GET_FOLLOW_REQUESTS: "/api/v1/friends/requests", // Done
    GET_FRIENDS: "/api/v1/friends/", // Done
    GET_FOLLOWING: "/api/v1/friends/following",
    GET_MY_FOLLOWERS: "/api/v1/friends/followers",
    GET_SUGGESTIONS: "/api/v1/friends/suggestions",
  },
  PROFILE: {
    REGISTER_PROFILE: "/api/v1/profile/register", // Done
    GET_PROFILE_INFO: "/api/v1/profile", // Done
    GET_USER_PROFILE: (userId) => `/api/v1/profile/user/${userId}`, // Done
    UPDATE_PROFILE: "/api/v1/profile/update", // Done
    UPDATE_PROFILE_PIC: "/api/v1/profile/update-pic", // Done
  },
  NOTIFICATION: {
    GET_NOTIFICATIONS: "/api/v1/notifications", // Done
    MARK_AS_READ: (notificationId) => `/api/v1/notifications/read/${notificationId}`,
    MARK_ALL_AS_READ: "/api/v1/notifications/read-all",
    DELETE_NOTIFICATION: (notificationId) => `/api/v1/notifications/delete/${notificationId}`,
    DELETE_ALL_NOTIFICATIONS: "/api/v1/notifications/delete-all",
  },

  //  Store: Products
  STORE_PRODUCTS: {
    GET_PRODUCTS: "/api/v1/store/products",
    GET_PRODUCT: (productId) => `/api/v1/store/products/${productId}`,
    GET_FEATURED_PRODUCTS: "/api/v1/store/featured",
    GET_DEALS_AND_OFFERS: "/api/v1/store/deals",
  },

  // Store: Categories and Subcategories
  STORE_CATEGORIES: {
    GET_CATEGORIES: "/api/v1/store/categories",
    GET_SUBCATEGORIES: (categoryId) => `/api/v1/store/categories/${categoryId}/subcategories`,
    GET_PRODUCTS_BY_CATEGORY: (categoryId) => `/api/v1/store/categories/${categoryId}/products`,
    GET_PRODUCTS_BY_SUBCATEGORY: (subcategoryId) => `/api/v1/store/subcategories/${subcategoryId}/products`,
  },

  // Store: Shopping Cart
  STORE_CART: {
    GET_CART: "/api/v1/store/cart",
    ADD_TO_CART: "/api/v1/store/cart",
    UPDATE_CART_ITEM: (cartItemId) => `/api/v1/store/cart/${cartItemId}`,
    REMOVE_FROM_CART: (cartItemId) => `/api/v1/store/cart/${cartItemId}`,
  },

  // Store: Checkout (Addresses & Payment Methods)
  STORE_CHECKOUT: {
    GET_ADDRESSES: "/api/v1/users/addresses",
    ADD_ADDRESS: "/api/v1/users/addresses",
    UPDATE_ADDRESS: (addressId) => `/api/v1/users/addresses/${addressId}`,
    DELETE_ADDRESS: (addressId) => `/api/v1/users/addresses/${addressId}`,

    GET_PAYMENT_METHODS: "/api/v1/users/payment-methods",
    ADD_PAYMENT_METHOD: "/api/v1/users/payment-methods",
  },

  // Store: Orders
  STORE_ORDERS: {
    PLACE_ORDER: "/api/v1/store/orders",
    GET_ORDERS: "/api/v1/store/orders",
    GET_ORDER: (orderId) => `/api/v1/store/orders/${orderId}`,
  },

  // Store: Promotions
  STORE_PROMOTIONS: {
    APPLY_COUPON: "/api/v1/store/coupons/apply",
  },

TRAINER: {
    GET_TRAINER: (trainerId) => `/api/v1/trainers/${trainerId}`,
    GET_MY_TRAINERS: "/api/v1/trainers/my-trainers", 
    ADD_FOLLOWER: "/api/v1/trainers/add-follower",   
    REMOVE_FOLLOWER: "/api/v1/trainers/remove-follower", 
    ADD_FEEDBACK: (trainerId) => `/api/v1/trainers/${trainerId}/feedback`, // <-- Add this line

  }

};