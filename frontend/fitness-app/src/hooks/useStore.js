import { useState, useEffect, useCallback } from 'react';
import { productsApi, categoriesApi, cartApi } from '../api/storeApi';

// Hook for products
export const useProducts = (initialFilters = {}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState(initialFilters);

    const fetchProducts = useCallback(async (newFilters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const mergedFilters = { ...filters, ...newFilters };
            const response = await productsApi.getProducts(mergedFilters);
            setProducts(response.products || []);
            setPagination(response.pagination || {});
            setFilters(mergedFilters);
        } catch (err) {
            setError(err.message || 'Failed to fetch products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const updateFilters = (newFilters) => {
        fetchProducts(newFilters);
    };

    return {
        products,
        loading,
        error,
        pagination,
        filters,
        refetch: fetchProducts,
        updateFilters
    };
};

// Hook for single product
export const useProduct = (productId) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!productId) return;

        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await productsApi.getProduct(productId);
                setProduct(response.product);
            } catch (err) {
                setError(err.message || 'Failed to fetch product');
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    return { product, loading, error };
};

// Hook for categories
export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await categoriesApi.getCategories();
                setCategories(response.categories || []);
            } catch (err) {
                setError(err.message || 'Failed to fetch categories');
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
};

// Hook for cart
export const useCart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await cartApi.getCart();
            setCart(response.cart);
        } catch (err) {
            // If user is not logged in or cart doesn't exist, set empty cart
            if (err.status === 401 || err.status === 404) {
                setCart({ items: [], totalAmount: 0, totalItems: 0 });
            } else {
                setError(err.message || 'Failed to fetch cart');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const addToCart = async (productId, quantity = 1) => {
        try {
            setError(null);
            await cartApi.addToCart(productId, quantity);
            await fetchCart(); // Refresh cart
            return { success: true };
        } catch (err) {
            const errorMessage = err.message || 'Failed to add to cart';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            setError(null);
            await cartApi.updateCartItem(productId, quantity);
            await fetchCart(); // Refresh cart
            return { success: true };
        } catch (err) {
            const errorMessage = err.message || 'Failed to update cart';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const removeItem = async (productId) => {
        try {
            setError(null);
            await cartApi.removeFromCart(productId);
            await fetchCart(); // Refresh cart
            return { success: true };
        } catch (err) {
            const errorMessage = err.message || 'Failed to remove item';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const clearCart = async () => {
        try {
            setError(null);
            await cartApi.clearCart();
            setCart({ items: [], totalAmount: 0, totalItems: 0 });
            return { success: true };
        } catch (err) {
            const errorMessage = err.message || 'Failed to clear cart';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    return {
        cart,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refetch: fetchCart
    };
};

// Hook for product reviews
export const useProductReviews = (productId) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchReviews = useCallback(async () => {
        if (!productId) return;

        setLoading(true);
        setError(null);
        try {
            const response = await productsApi.getReviews(productId);
            setReviews(response.reviews || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch reviews');
            setReviews([]);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    const addReview = async (reviewData) => {
        try {
            setError(null);
            await productsApi.addReview(productId, reviewData);
            await fetchReviews(); // Refresh reviews
            return { success: true };
        } catch (err) {
            const errorMessage = err.message || 'Failed to add review';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    return {
        reviews,
        loading,
        error,
        addReview,
        refetch: fetchReviews
    };
};
