import express from "express";
import {
    getAllCoupons,
    getCouponById,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    activateCoupon,
    deactivateCoupon,
    bulkUpdateCoupons,
    bulkDeleteCoupons,
    getCouponAnalytics,
    exportCoupons,
    searchCoupons,
    validateCoupon,
    applyCoupon,
    getCouponUsage,
    getCouponsByType,
    getCouponsByStatus,
    getCouponsExpiringeSoon,
    duplicateCoupon,
    generateCouponCode,
    scheduleCopon,
    getCouponStatistics,
    getActiveCoupons,
    getExpiredCoupons,
    extendCouponValidity,
    limitCouponUsage,
    trackCouponPerformance
} from "../../controllers/adminstore/storeCouponController.js";

const router = express.Router();

// Coupon CRUD Routes
router.get("/", getAllCoupons);
router.get("/search", searchCoupons);
router.get("/analytics", getCouponAnalytics);
router.get("/statistics", getCouponStatistics);
router.get("/export", exportCoupons);
router.get("/active", getActiveCoupons);
router.get("/expired", getExpiredCoupons);
router.get("/expiring-soon", getCouponsExpiringeSoon);
router.get("/type/:type", getCouponsByType);
router.get("/status/:status", getCouponsByStatus);
router.get("/:id", getCouponById);
router.post("/", createCoupon);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

// Coupon Status Management
router.patch("/:id/activate", activateCoupon);
router.patch("/:id/deactivate", deactivateCoupon);
router.patch("/:id/extend", extendCouponValidity);
router.patch("/:id/limit-usage", limitCouponUsage);

// Bulk Operations
router.post("/bulk-update", bulkUpdateCoupons);
router.post("/bulk-delete", bulkDeleteCoupons);

// Coupon Validation and Application
router.post("/validate", validateCoupon);
router.post("/apply", applyCoupon);

// Coupon Usage and Analytics
router.get("/:id/usage", getCouponUsage);
router.get("/:id/performance", trackCouponPerformance);

// Coupon Utilities
router.post("/generate-code", generateCouponCode);
router.post("/:id/duplicate", duplicateCoupon);
router.post("/:id/schedule", scheduleCopon);

export default router;
