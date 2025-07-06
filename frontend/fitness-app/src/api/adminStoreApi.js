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

// Admin Products API
export const adminProductsApi = {
    // Get all products with filters
    getProducts: async (params = {}) => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_PRODUCTS.GET_ALL_PRODUCTS, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single product
    getProduct: async (productId) => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_PRODUCTS.GET_PRODUCT(productId));
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create new product
    createProduct: async (productData) => {
        try {
            // Create FormData for file upload
            const formData = new FormData();

            // Append all product data
            Object.keys(productData).forEach(key => {
                if (key === 'images' && productData[key]) {
                    // Handle multiple images
                    if (Array.isArray(productData[key])) {
                        productData[key].forEach(image => {
                            formData.append('images', image);
                        });
                    } else {
                        formData.append('images', productData[key]);
                    }
                } else if (key === 'attributes' || key === 'tags') {
                    // Handle arrays and objects by stringifying
                    formData.append(key, JSON.stringify(productData[key]));
                } else if (productData[key] !== null && productData[key] !== undefined) {
                    formData.append(key, productData[key]);
                }
            });

            const response = await api.post(API_PATHS.ADMIN_STORE_PRODUCTS.ADD_PRODUCT, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update product
    updateProduct: async (productId, productData) => {
        try {
            // Create FormData for file upload
            const formData = new FormData();

            // Append all product data
            Object.keys(productData).forEach(key => {
                if (key === 'images' && productData[key]) {
                    // Handle multiple images
                    if (Array.isArray(productData[key])) {
                        productData[key].forEach(image => {
                            formData.append('images', image);
                        });
                    } else {
                        formData.append('images', productData[key]);
                    }
                } else if (key === 'attributes' || key === 'tags') {
                    // Handle arrays and objects by stringifying
                    formData.append(key, JSON.stringify(productData[key]));
                } else if (productData[key] !== null && productData[key] !== undefined) {
                    formData.append(key, productData[key]);
                }
            });

            const response = await api.put(API_PATHS.ADMIN_STORE_PRODUCTS.UPDATE_PRODUCT(productId), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete product
    deleteProduct: async (productId) => {
        try {
            const response = await api.delete(API_PATHS.ADMIN_STORE_PRODUCTS.DELETE_PRODUCT(productId));
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get product reviews
    getProductReviews: async (productId, params = {}) => {
        try {
            const response = await api.get(`${API_PATHS.ADMIN_STORE_PRODUCTS.GET_PRODUCT(productId)}/reviews`, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update product status
    updateProductStatus: async (productId, status) => {
        try {
            const response = await api.patch(API_PATHS.ADMIN_STORE_PRODUCTS.UPDATE_PRODUCT_STATUS(productId), { status });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Bulk update products
    bulkUpdateProducts: async (productIds, updateData) => {
        try {
            const response = await api.post(API_PATHS.ADMIN_STORE_PRODUCTS.BULK_UPDATE_PRODUCTS, {
                productIds,
                updateData
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get product analytics
    getProductAnalytics: async (productId, period = 'monthly') => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_PRODUCTS.GET_PRODUCT_ANALYTICS(productId), {
                params: { period }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

// Admin Categories API (for the dropdown in product forms)
export const adminCategoriesApi = {
    // Get all categories
    getCategories: async (params = {}) => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_CATEGORIES.GET_ALL_CATEGORIES, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single category
    getCategory: async (categoryId) => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_CATEGORIES.GET_CATEGORY(categoryId));
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create new category
    createCategory: async (categoryData) => {
        try {
            // Create FormData for file upload
            const formData = new FormData();

            // Append all category data
            Object.keys(categoryData).forEach(key => {
                if (key === 'image' && categoryData[key]) {
                    formData.append('image', categoryData[key]);
                } else if (categoryData[key] !== null && categoryData[key] !== undefined) {
                    formData.append(key, categoryData[key]);
                }
            });

            const response = await api.post(API_PATHS.ADMIN_STORE_CATEGORIES.ADD_CATEGORY, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update category
    updateCategory: async (categoryId, categoryData) => {
        try {
            // Create FormData for file upload
            const formData = new FormData();

            // Append all category data
            Object.keys(categoryData).forEach(key => {
                if (key === 'image' && categoryData[key]) {
                    formData.append('image', categoryData[key]);
                } else if (categoryData[key] !== null && categoryData[key] !== undefined) {
                    formData.append(key, categoryData[key]);
                }
            });

            const response = await api.put(API_PATHS.ADMIN_STORE_CATEGORIES.UPDATE_CATEGORY(categoryId), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete category
    deleteCategory: async (categoryId) => {
        try {
            const response = await api.delete(API_PATHS.ADMIN_STORE_CATEGORIES.DELETE_CATEGORY(categoryId));
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create subcategory
    createSubcategory: async (categoryId, subcategoryData) => {
        try {
            const formData = new FormData();
            Object.keys(subcategoryData).forEach(key => {
                if (key === 'image' && subcategoryData[key]) {
                    formData.append('image', subcategoryData[key]);
                } else if (subcategoryData[key] !== null && subcategoryData[key] !== undefined) {
                    formData.append(key, subcategoryData[key]);
                }
            });

            const response = await api.post(API_PATHS.ADMIN_STORE_CATEGORIES.ADD_SUBCATEGORY(categoryId), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update subcategory
    updateSubcategory: async (categoryId, subcategoryId, subcategoryData) => {
        try {
            const formData = new FormData();
            Object.keys(subcategoryData).forEach(key => {
                if (key === 'image' && subcategoryData[key]) {
                    formData.append('image', subcategoryData[key]);
                } else if (subcategoryData[key] !== null && subcategoryData[key] !== undefined) {
                    formData.append(key, subcategoryData[key]);
                }
            });

            const response = await api.put(API_PATHS.ADMIN_STORE_CATEGORIES.UPDATE_SUBCATEGORY(categoryId, subcategoryId), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete subcategory
    deleteSubcategory: async (categoryId, subcategoryId) => {
        try {
            const response = await api.delete(API_PATHS.ADMIN_STORE_CATEGORIES.DELETE_SUBCATEGORY(categoryId, subcategoryId));
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

// Admin Orders API
export const adminOrdersApi = {
    // Get all orders with filters
    getOrders: async (params = {}) => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_ORDERS.GET_ALL_ORDERS, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single order
    getOrder: async (orderId) => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_ORDERS.GET_ORDER(orderId));
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update order status
    updateOrderStatus: async (orderId, status, notes = '') => {
        try {
            const response = await api.patch(API_PATHS.ADMIN_STORE_ORDERS.UPDATE_ORDER_STATUS(orderId), {
                status,
                notes
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update payment status
    updatePaymentStatus: async (orderId, paymentStatus) => {
        try {
            const response = await api.patch(API_PATHS.ADMIN_STORE_ORDERS.UPDATE_PAYMENT_STATUS(orderId), {
                paymentStatus
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get orders by status
    getOrdersByStatus: async (status, params = {}) => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_ORDERS.GET_ORDERS_BY_STATUS(status), { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get order analytics
    getOrderAnalytics: async (period = '30') => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_ORDERS.GET_ORDER_ANALYTICS, {
                params: { period }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Search orders
    searchOrders: async (params = {}) => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_ORDERS.SEARCH_ORDERS, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Export orders
    exportOrders: async (format = 'csv', filters = {}) => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_ORDERS.EXPORT_ORDERS, {
                params: { format, ...filters },
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Cancel order
    cancelOrder: async (orderId, reason = '') => {
        try {
            const response = await api.patch(API_PATHS.ADMIN_STORE_ORDERS.CANCEL_ORDER(orderId), {
                reason
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Mark order as shipped
    markAsShipped: async (orderId, shippingInfo = {}) => {
        try {
            const response = await api.patch(API_PATHS.ADMIN_STORE_ORDERS.MARK_SHIPPED(orderId), shippingInfo);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Mark order as delivered
    markAsDelivered: async (orderId) => {
        try {
            const response = await api.patch(API_PATHS.ADMIN_STORE_ORDERS.MARK_DELIVERED(orderId));
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Process refund
    processRefund: async (orderId, refundData) => {
        try {
            const response = await api.post(API_PATHS.ADMIN_STORE_ORDERS.PROCESS_REFUND(orderId), refundData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Generate invoice
    generateInvoice: async (orderId) => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_ORDERS.GENERATE_INVOICE(orderId), {
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Bulk update orders
    bulkUpdateOrders: async (orderIds, updateData) => {
        try {
            const response = await api.post(API_PATHS.ADMIN_STORE_ORDERS.BULK_UPDATE_ORDERS, {
                orderIds,
                updateData
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

// Admin Inventory API
export const adminInventoryApi = {
    // Get all inventory with filters
    getInventory: async (params = {}) => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_INVENTORY.GET_INVENTORY, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update stock quantity
    updateStock: async (productId, stockData) => {
        try {
            const response = await api.patch(API_PATHS.ADMIN_STORE_INVENTORY.UPDATE_STOCK(productId), stockData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Bulk update stock
    bulkUpdateStock: async (updates) => {
        try {
            const response = await api.post(API_PATHS.ADMIN_STORE_INVENTORY.BULK_UPDATE_STOCK, { updates });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get low stock alerts
    getLowStockAlerts: async () => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_INVENTORY.GET_LOW_STOCK_ALERTS);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update reorder point
    updateReorderPoint: async (productId, reorderData) => {
        try {
            const response = await api.patch(API_PATHS.ADMIN_STORE_INVENTORY.UPDATE_REORDER_POINT(productId), reorderData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get stock history
    getStockHistory: async (productId, params = {}) => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_INVENTORY.GET_STOCK_HISTORY(productId), { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Search inventory
    searchInventory: async (params = {}) => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_INVENTORY.SEARCH_INVENTORY, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get inventory analytics
    getInventoryAnalytics: async (period = 'monthly') => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_INVENTORY.GET_ANALYTICS, {
                params: { period }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Export inventory
    exportInventory: async (format = 'csv') => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_INVENTORY.EXPORT_INVENTORY, {
                params: { format },
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Adjust stock (manual adjustment)
    adjustStock: async (productId, adjustmentData) => {
        try {
            const response = await api.post(API_PATHS.ADMIN_STORE_INVENTORY.ADJUST_STOCK(productId), adjustmentData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get inventory alerts (low stock, out of stock, reorder)
    getInventoryAlerts: async () => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_INVENTORY.GET_ALERTS);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Generate stock report
    generateStockReport: async (params = {}) => {
        try {
            const response = await api.get(API_PATHS.ADMIN_STORE_INVENTORY.GENERATE_REPORT, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Bulk stock adjustment
    bulkStockAdjustment: async (adjustments) => {
        try {
            const response = await api.post(API_PATHS.ADMIN_STORE_INVENTORY.BULK_ADJUST, { adjustments });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Import inventory from file
    importInventory: async (fileData) => {
        try {
            const formData = new FormData();
            formData.append('file', fileData);

            const response = await api.post(API_PATHS.ADMIN_STORE_INVENTORY.IMPORT_INVENTORY, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Sync inventory with products
    syncWithProducts: async () => {
        try {
            const response = await api.post(API_PATHS.ADMIN_STORE_INVENTORY.SYNC_PRODUCTS);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default api;
