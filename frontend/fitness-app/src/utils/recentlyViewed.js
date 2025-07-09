// Utility functions for managing recently viewed products
const RECENTLY_VIEWED_KEY = 'fitness_app_recently_viewed';
const MAX_RECENTLY_VIEWED = 5;

export const recentlyViewedUtils = {
    // Get recently viewed products from localStorage
    getRecentlyViewed: () => {
        try {
            const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error getting recently viewed products:', error);
            return [];
        }
    },

    // Add a product to recently viewed
    addToRecentlyViewed: (product) => {
        try {
            if (!product || !product.id) return;

            const recentlyViewed = recentlyViewedUtils.getRecentlyViewed();

            // Remove if already exists to avoid duplicates
            const filtered = recentlyViewed.filter(item => item.id !== product.id);

            // Add to beginning of array
            const updated = [product, ...filtered];

            // Keep only the most recent items
            const limited = updated.slice(0, MAX_RECENTLY_VIEWED);

            localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(limited));

            // Dispatch custom event to notify components
            window.dispatchEvent(new CustomEvent('recentlyViewedUpdated', {
                detail: { recentlyViewed: limited }
            }));

        } catch (error) {
            console.error('Error adding to recently viewed:', error);
        }
    },

    // Remove a product from recently viewed
    removeFromRecentlyViewed: (productId) => {
        try {
            const recentlyViewed = recentlyViewedUtils.getRecentlyViewed();
            const filtered = recentlyViewed.filter(item => item.id !== productId);

            localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(filtered));

            // Dispatch custom event to notify components
            window.dispatchEvent(new CustomEvent('recentlyViewedUpdated', {
                detail: { recentlyViewed: filtered }
            }));

        } catch (error) {
            console.error('Error removing from recently viewed:', error);
        }
    },

    // Clear all recently viewed products
    clearRecentlyViewed: () => {
        try {
            localStorage.removeItem(RECENTLY_VIEWED_KEY);

            // Dispatch custom event to notify components
            window.dispatchEvent(new CustomEvent('recentlyViewedUpdated', {
                detail: { recentlyViewed: [] }
            }));

        } catch (error) {
            console.error('Error clearing recently viewed:', error);
        }
    }
};
