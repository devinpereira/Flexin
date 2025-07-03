// Admin Store Routes - Centralized Exports
import storeProductRoutes from './storeProductRoutes.js';
import storeCategoryRoutes from './storeCategoryRoutes.js';
import storeOrderRoutes from './storeOrderRoutes.js';
import storeInventoryRoutes from './storeInventoryRoutes.js';
import storeCouponRoutes from './storeCouponRoutes.js';
import storeReviewRoutes from './storeReviewRoutes.js';
import storeAnalyticsRoutes from './storeAnalyticsRoutes.js';
import storeMediaRoutes from './storeMediaRoutes.js';

export {
    storeProductRoutes,
    storeCategoryRoutes,
    storeOrderRoutes,
    storeInventoryRoutes,
    storeCouponRoutes,
    storeReviewRoutes,
    storeAnalyticsRoutes,
    storeMediaRoutes,
};

// Default export object for convenience
export default {
    storeProductRoutes,
    storeCategoryRoutes,
    storeOrderRoutes,
    storeInventoryRoutes,
    storeCouponRoutes,
    storeReviewRoutes,
    storeAnalyticsRoutes,
    storeMediaRoutes,
};
