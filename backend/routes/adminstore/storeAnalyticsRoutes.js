import express from "express";
import {
    getSalesAnalytics,
    getRevenueAnalytics,
    getProductAnalytics,
    getCustomerAnalytics,
    getInventoryAnalytics,
    getOrderAnalytics,
    getCategoryAnalytics,
    getCouponAnalytics,
    getReviewAnalytics,
    getDashboardStats,
    getTopSellingProducts,
    getTopPerformingCategories,
    getCustomerSegments,
    getSalesByRegion,
    getSalesByChannel,
    getRevenueByPeriod,
    getOrderTrends,
    getInventoryTurnover,
    getProductPerformance,
    getCustomerLifetimeValue,
    exportAnalyticsReport,
    generateCustomReport,
    getComparisonReport,
    getProfitabilityAnalysis,
    getSeasonalTrends,
    getForecastData,
    getAbandonedCartAnalytics,
    getConversionFunnelAnalytics,
    getCohortAnalysis,
    getRFMAnalysis,
    getABTestResults
} from "../../controllers/adminstore/storeAnalyticsController.js";

const router = express.Router();

// Main Analytics Routes
router.get("/dashboard", getDashboardStats);
router.get("/sales", getSalesAnalytics);
router.get("/revenue", getRevenueAnalytics);
router.get("/products", getProductAnalytics);
router.get("/customers", getCustomerAnalytics);
router.get("/inventory", getInventoryAnalytics);
router.get("/orders", getOrderAnalytics);
router.get("/categories", getCategoryAnalytics);
router.get("/coupons", getCouponAnalytics);
router.get("/reviews", getReviewAnalytics);

// Top Performers
router.get("/top-selling-products", getTopSellingProducts);
router.get("/top-categories", getTopPerformingCategories);
router.get("/customer-segments", getCustomerSegments);

// Geographic and Channel Analysis
router.get("/sales-by-region", getSalesByRegion);
router.get("/sales-by-channel", getSalesByChannel);

// Time-based Analysis
router.get("/revenue-by-period", getRevenueByPeriod);
router.get("/order-trends", getOrderTrends);
router.get("/seasonal-trends", getSeasonalTrends);

// Performance Metrics
router.get("/inventory-turnover", getInventoryTurnover);
router.get("/product-performance", getProductPerformance);
router.get("/customer-lifetime-value", getCustomerLifetimeValue);
router.get("/profitability", getProfitabilityAnalysis);

// Advanced Analytics
router.get("/forecast", getForecastData);
router.get("/abandoned-cart", getAbandonedCartAnalytics);
router.get("/conversion-funnel", getConversionFunnelAnalytics);
router.get("/cohort-analysis", getCohortAnalysis);
router.get("/rfm-analysis", getRFMAnalysis);
router.get("/ab-test-results", getABTestResults);

// Reports
router.get("/export", exportAnalyticsReport);
router.post("/custom-report", generateCustomReport);
router.get("/comparison", getComparisonReport);

export default router;
