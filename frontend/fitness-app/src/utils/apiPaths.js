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
  FITNESS: {
    CREATE_FITNESS_PROFILE: "/api/v1/fitness/register", // Done
    GET_FITNESS_PROFILE: "/api/v1/fitness/profile", // Done
    UPDATE_FITNESS_PROFILE: "/api/v1/fitness/update-profile",
    GET_FITNESS_PROFILES: "/api/v1/fitness/profiles", // Done
    GET_FITNESS_PROFILE_BY_USER: (userId) => `/api/v1/fitness/profile/user/${userId}`, // Done
  },
  WORKOUT: {
    GET_WORKOUT_PLANS: "/api/v1/workouts", // Done
    GENERATE_WORKOUT: "/api/v1/workout/generate", // Done
    UPDATE_WORKOUT: `/api/v1/workouts`, // Done
    CREATE_WORKOUT: "/api/v1/workouts/create", // Done
    GET_CUSTOM_WORKOUTS: "/api/v1/workouts/custom", // Done
    GET_CUSTOM_WORKOUT: (workoutId) => `/api/v1/workouts/custom/${workoutId}`, // Done
    UPDATE_CUSTOM_WORKOUT: (workoutId) => `/api/v1/workouts/custom/${workoutId}`, // Done
  },
  EXERCISE: {
    GET_EXERCISES: "/api/v1/exercises", // Done
    UPDATE_EXERCISE: (exerciseId) => `/api/v1/exercises/${exerciseId}`,
    ADD_EXERCISE: "/api/v1/exercises",
    DELETE_EXERCISE: (exerciseId) => `/api/v1/exercises/${exerciseId}`,
  },

  //  Store: Products
  STORE_PRODUCTS: {
    GET_PRODUCTS: "/api/v1/store/products",
    GET_PRODUCT: (productId) => `/api/v1/store/products/${productId}`,
    ADD_REVIEW: (productId) => `/api/v1/store/products/${productId}/reviews`,
    GET_REVIEWS: (productId) => `/api/v1/store/products/${productId}/reviews`,
  },

  // Store: Categories and Subcategories
  STORE_CATEGORIES: {
    GET_CATEGORIES: "/api/v1/store/categories",
    GET_CATEGORY: (categoryId) => `/api/v1/store/categories/${categoryId}`,
    GET_SUBCATEGORIES: (categoryId) => `/api/v1/store/categories/${categoryId}/subcategories`,
  },

  // Store: Shopping Cart
  STORE_CART: {
    GET_CART: "/api/v1/store/cart",
    ADD_TO_CART: "/api/v1/store/cart/add",
    UPDATE_CART: "/api/v1/store/cart/update",
    REMOVE_FROM_CART: (productId) => `/api/v1/store/cart/remove/${productId}`,
    CLEAR_CART: "/api/v1/store/cart/clear",
  },

  // Store: Addresses
  STORE_ADDRESSES: {
    GET_ADDRESSES: "/api/v1/store/addresses",
    ADD_ADDRESS: "/api/v1/store/addresses",
    UPDATE_ADDRESS: (addressId) => `/api/v1/store/addresses/${addressId}`,
    DELETE_ADDRESS: (addressId) => `/api/v1/store/addresses/${addressId}`,
  },

  // Store: Orders
  STORE_ORDERS: {
    CREATE_ORDER: "/api/v1/store/orders",
    GET_ORDERS: "/api/v1/store/orders",
    GET_ORDER: (orderId) => `/api/v1/store/orders/${orderId}`,
    CANCEL_ORDER: (orderId) => `/api/v1/store/orders/${orderId}/cancel`,
  },

  // Store: Coupons
  STORE_COUPONS: {
    GET_ACTIVE_COUPONS: "/api/v1/store/coupons/active",
    VALIDATE_COUPON: "/api/v1/store/coupons/validate",
  },
  // Admin Store: Products Management
  ADMIN_STORE_PRODUCTS: {
    GET_ALL_PRODUCTS: "/api/v1/admin/store/products",
    GET_PRODUCT: (productId) => `/api/v1/admin/store/products/${productId}`,
    ADD_PRODUCT: "/api/v1/admin/store/products",
    UPDATE_PRODUCT: (productId) => `/api/v1/admin/store/products/${productId}`,
    DELETE_PRODUCT: (productId) => `/api/v1/admin/store/products/${productId}`,
    UPDATE_PRODUCT_STATUS: (productId) => `/api/v1/admin/store/products/${productId}/status`,
    BULK_UPDATE_PRODUCTS: "/api/v1/admin/store/products/bulk-update",
    GET_PRODUCT_ANALYTICS: (productId) => `/api/v1/admin/store/products/${productId}/analytics`,
  },

  // Admin Store: Inventory Management
  ADMIN_STORE_INVENTORY: {
    GET_INVENTORY: "/api/v1/admin/store/inventory",
    UPDATE_STOCK: (productId) => `/api/v1/admin/store/inventory/${productId}/stock`,
    BULK_UPDATE_STOCK: "/api/v1/admin/store/inventory/bulk-update",
    GET_LOW_STOCK_ALERTS: "/api/v1/admin/store/inventory/low-stock",
    UPDATE_REORDER_POINT: (productId) => `/api/v1/admin/store/inventory/${productId}/reorder-point`,
    GET_STOCK_HISTORY: (productId) => `/api/v1/admin/store/inventory/${productId}/history`,
    SEARCH_INVENTORY: "/api/v1/admin/store/inventory/search",
    GET_ANALYTICS: "/api/v1/admin/store/inventory/analytics",
    EXPORT_INVENTORY: "/api/v1/admin/store/inventory/export",
    GET_ALERTS: "/api/v1/admin/store/inventory/alerts",
    ADJUST_STOCK: (productId) => `/api/v1/admin/store/inventory/${productId}/adjust`,
    BULK_ADJUST: "/api/v1/admin/store/inventory/bulk-adjust",
    IMPORT_INVENTORY: "/api/v1/admin/store/inventory/import",
    SYNC_PRODUCTS: "/api/v1/admin/store/inventory/sync-products",
    GENERATE_REPORT: "/api/v1/admin/store/inventory/report",
  },

  // Admin Store: Orders Management
  ADMIN_STORE_ORDERS: {
    GET_ALL_ORDERS: "/api/v1/admin/store/orders",
    GET_ORDER: (orderId) => `/api/v1/admin/store/orders/${orderId}`,
    GET_ORDER_DETAILS: (orderId) => `/api/v1/admin/store/orders/${orderId}`,
    UPDATE_ORDER_STATUS: (orderId) => `/api/v1/admin/store/orders/${orderId}/status`,
    UPDATE_PAYMENT_STATUS: (orderId) => `/api/v1/admin/store/orders/${orderId}/payment-status`,
    GET_ORDERS_BY_STATUS: (status) => `/api/v1/admin/store/orders/status/${status}`,
    GET_ORDER_ANALYTICS: "/api/v1/admin/store/orders/analytics",
    SEARCH_ORDERS: "/api/v1/admin/store/orders/search",
    BULK_UPDATE_ORDERS: "/api/v1/admin/store/orders/bulk-update",
    EXPORT_ORDERS: "/api/v1/admin/store/orders/export",
    CANCEL_ORDER: (orderId) => `/api/v1/admin/store/orders/${orderId}/cancel`,
    MARK_SHIPPED: (orderId) => `/api/v1/admin/store/orders/${orderId}/mark-shipped`,
    MARK_DELIVERED: (orderId) => `/api/v1/admin/store/orders/${orderId}/mark-delivered`,
    PROCESS_REFUND: (orderId) => `/api/v1/admin/store/orders/${orderId}/refund`,
    GENERATE_INVOICE: (orderId) => `/api/v1/admin/store/orders/${orderId}/invoice`,
    GET_SHIPPING_LABELS: (orderId) => `/api/v1/admin/store/orders/${orderId}/shipping-label`,
  },

  // Admin Store: Categories Management
  ADMIN_STORE_CATEGORIES: {
    GET_ALL_CATEGORIES: "/api/v1/admin/store/categories",
    GET_CATEGORY: (categoryId) => `/api/v1/admin/store/categories/${categoryId}`,
    ADD_CATEGORY: "/api/v1/admin/store/categories",
    UPDATE_CATEGORY: (categoryId) => `/api/v1/admin/store/categories/${categoryId}`,
    DELETE_CATEGORY: (categoryId) => `/api/v1/admin/store/categories/${categoryId}`,
    ADD_SUBCATEGORY: (categoryId) => `/api/v1/admin/store/categories/${categoryId}/subcategories`,
    UPDATE_SUBCATEGORY: (categoryId, subcategoryId) => `/api/v1/admin/store/categories/${categoryId}/subcategories/${subcategoryId}`,
    DELETE_SUBCATEGORY: (categoryId, subcategoryId) => `/api/v1/admin/store/categories/${categoryId}/subcategories/${subcategoryId}`,
  },

  // Admin Store: Coupons Management
  ADMIN_STORE_COUPONS: {
    GET_ALL_COUPONS: "/api/v1/admin/store/coupons",
    GET_COUPON: (couponId) => `/api/v1/admin/store/coupons/${couponId}`,
    CREATE_COUPON: "/api/v1/admin/store/coupons",
    UPDATE_COUPON: (couponId) => `/api/v1/admin/store/coupons/${couponId}`,
    DELETE_COUPON: (couponId) => `/api/v1/admin/store/coupons/${couponId}`,
    ACTIVATE_COUPON: (couponId) => `/api/v1/admin/store/coupons/${couponId}/activate`,
    DEACTIVATE_COUPON: (couponId) => `/api/v1/admin/store/coupons/${couponId}/deactivate`,
    GET_COUPON_USAGE: (couponId) => `/api/v1/admin/store/coupons/${couponId}/usage`,
  },

  // Admin Store: Reviews Management
  ADMIN_STORE_REVIEWS: {
    GET_ALL_REVIEWS: "/api/v1/admin/store/reviews",
    GET_PRODUCT_REVIEWS: (productId) => `/api/v1/admin/store/reviews/product/${productId}`,
    APPROVE_REVIEW: (reviewId) => `/api/v1/admin/store/reviews/${reviewId}/approve`,
    REJECT_REVIEW: (reviewId) => `/api/v1/admin/store/reviews/${reviewId}/reject`,
    DELETE_REVIEW: (reviewId) => `/api/v1/admin/store/reviews/${reviewId}`,
    GET_PENDING_REVIEWS: "/api/v1/admin/store/reviews/pending",
  },

  // Admin Store: Analytics & Reports
  ADMIN_STORE_ANALYTICS: {
    GET_SALES_ANALYTICS: "/api/v1/admin/store/analytics/sales",
    GET_REVENUE_ANALYTICS: "/api/v1/admin/store/analytics/revenue",
    GET_PRODUCT_PERFORMANCE: "/api/v1/admin/store/analytics/products",
    GET_CUSTOMER_ANALYTICS: "/api/v1/admin/store/analytics/customers",
    GET_INVENTORY_REPORTS: "/api/v1/admin/store/analytics/inventory",
    GET_TOP_SELLING_PRODUCTS: "/api/v1/admin/store/analytics/top-products",
    GET_SALES_BY_CATEGORY: "/api/v1/admin/store/analytics/sales-by-category",
    EXPORT_ANALYTICS: "/api/v1/admin/store/analytics/export",
  },

  // File Upload for Store
  STORE_UPLOADS: {
    UPLOAD_PRODUCT_IMAGE: "/api/v1/store/uploads/product-image",
    UPLOAD_CATEGORY_IMAGE: "/api/v1/store/uploads/category-image",
    DELETE_IMAGE: (imageId) => `/api/v1/store/uploads/delete/${imageId}`,
  },

  TRAINER: {
    GET_TRAINER: (trainerId) => `/api/v1/trainers/${trainerId}`,
    GET_MY_TRAINERS: "/api/v1/trainers/my-trainers",
    ADD_FOLLOWER: "/api/v1/trainers/add-follower",
    REMOVE_FOLLOWER: "/api/v1/trainers/remove-follower",
    ADD_FEEDBACK: (trainerId) => `/api/v1/trainers/${trainerId}/feedback`,
    GET_TRAINER_SCHEDULE: (trainerId) => `/api/v1/trainer-schedules/${trainerId}`,
  },

  MEAL_PLAN: {
    GET_MEAL_PLAN: (trainerId, userId) => `/api/v1/meal-plans/${trainerId}/${userId}`,
  },
};