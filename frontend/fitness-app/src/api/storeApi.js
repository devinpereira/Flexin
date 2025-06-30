import axios from 'axios';
import { BASE_URL, API_PATHS } from '../utils/apiPaths';

// Create axios instance with default config
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Products API
export const productsApi = {
    // Get all products with filters
    getProducts: async (params = {}) => {
        try {
            const response = await api.get(API_PATHS.STORE_PRODUCTS.GET_PRODUCTS, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single product
    getProduct: async (productId) => {
        try {
            const response = await api.get(API_PATHS.STORE_PRODUCTS.GET_PRODUCT(productId));
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Add product review
    addReview: async (productId, reviewData) => {
        try {
            const response = await api.post(API_PATHS.STORE_PRODUCTS.ADD_REVIEW(productId), reviewData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get product reviews
    getReviews: async (productId, params = {}) => {
        try {
            const response = await api.get(API_PATHS.STORE_PRODUCTS.GET_REVIEWS(productId), { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

// Categories API
export const categoriesApi = {
    // Get all categories
    getCategories: async () => {
        try {
            const response = await api.get(API_PATHS.STORE_CATEGORIES.GET_CATEGORIES);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get category with subcategories
    getCategory: async (categoryId) => {
        try {
            const response = await api.get(API_PATHS.STORE_CATEGORIES.GET_CATEGORY(categoryId));
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

// Cart API
export const cartApi = {
    // Get user's cart
    getCart: async () => {
        try {
            const response = await api.get(API_PATHS.STORE_CART.GET_CART);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Add item to cart
    addToCart: async (productId, quantity = 1) => {
        try {
            const response = await api.post(API_PATHS.STORE_CART.ADD_TO_CART, { productId, quantity });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update cart item quantity
    updateCartItem: async (productId, quantity) => {
        try {
            const response = await api.put(API_PATHS.STORE_CART.UPDATE_CART, { productId, quantity });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Remove item from cart
    removeFromCart: async (productId) => {
        try {
            const response = await api.delete(API_PATHS.STORE_CART.REMOVE_FROM_CART(productId));
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Clear entire cart
    clearCart: async () => {
        try {
            const response = await api.delete(API_PATHS.STORE_CART.CLEAR_CART);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

// Orders API
export const ordersApi = {
    // Create new order
    createOrder: async (orderData) => {
        try {
            const response = await api.post(API_PATHS.STORE_ORDERS.CREATE_ORDER, orderData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get user's orders
    getOrders: async (params = {}) => {
        try {
            const response = await api.get(API_PATHS.STORE_ORDERS.GET_ORDERS, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single order
    getOrder: async (orderId) => {
        try {
            const response = await api.get(API_PATHS.STORE_ORDERS.GET_ORDER(orderId));
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Cancel order
    cancelOrder: async (orderId) => {
        try {
            const response = await api.put(API_PATHS.STORE_ORDERS.CANCEL_ORDER(orderId));
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

// Addresses API
export const addressesApi = {
    // Get user's addresses
    getAddresses: async () => {
        try {
            const response = await api.get(API_PATHS.STORE_ADDRESSES.GET_ADDRESSES);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create new address
    createAddress: async (addressData) => {
        try {
            const response = await api.post(API_PATHS.STORE_ADDRESSES.ADD_ADDRESS, addressData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update address
    updateAddress: async (addressId, addressData) => {
        try {
            const response = await api.put(API_PATHS.STORE_ADDRESSES.UPDATE_ADDRESS(addressId), addressData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete address
    deleteAddress: async (addressId) => {
        try {
            const response = await api.delete(API_PATHS.STORE_ADDRESSES.DELETE_ADDRESS(addressId));
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

// Coupons API
export const couponsApi = {
    // Get active coupons
    getActiveCoupons: async () => {
        try {
            const response = await api.get(API_PATHS.STORE_COUPONS.GET_ACTIVE_COUPONS);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Validate coupon
    validateCoupon: async (code, cartTotal) => {
        try {
            const response = await api.post(API_PATHS.STORE_COUPONS.VALIDATE_COUPON, { code, cartTotal });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default api;
