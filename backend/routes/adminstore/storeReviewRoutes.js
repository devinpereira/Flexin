import express from "express";
import {
    getAllReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    approveReview,
    rejectReview,
    bulkUpdateReviews,
    bulkDeleteReviews,
    bulkApproveReviews,
    bulkRejectReviews,
    getReviewAnalytics,
    exportReviews,
    searchReviews,
    getReviewsByProduct,
    getReviewsByRating,
    getReviewsByStatus,
    getReviewsByDateRange,
    flagReview,
    unflagReview,
    getFlaggedReviews,
    getPendingReviews,
    getApprovedReviews,
    getRejectedReviews,
    addReviewResponse,
    updateReviewResponse,
    deleteReviewResponse,
    getReviewResponses,
    moderateReview,
    getReviewStatistics,
    syncProductRatings,
    reportReview,
    getReportedReviews
} from "../../controllers/adminstore/storeReviewController.js";
import upload from "../../middleware/uploadMiddleware.js";

const router = express.Router();

// Review CRUD Routes
router.get("/", getAllReviews);
router.get("/search", searchReviews);
router.get("/analytics", getReviewAnalytics);
router.get("/statistics", getReviewStatistics);
router.get("/export", exportReviews);
router.get("/pending", getPendingReviews);
router.get("/approved", getApprovedReviews);
router.get("/rejected", getRejectedReviews);
router.get("/flagged", getFlaggedReviews);
router.get("/reported", getReportedReviews);
router.get("/product/:productId", getReviewsByProduct);
router.get("/rating/:rating", getReviewsByRating);
router.get("/status/:status", getReviewsByStatus);
router.get("/date-range", getReviewsByDateRange);
router.get("/:id", getReviewById);
router.post("/", upload.array("media", 5), createReview);
router.put("/:id", upload.array("media", 5), updateReview);
router.delete("/:id", deleteReview);

// Review Moderation
router.patch("/:id/approve", approveReview);
router.patch("/:id/reject", rejectReview);
router.patch("/:id/flag", flagReview);
router.patch("/:id/unflag", unflagReview);
router.post("/:id/moderate", moderateReview);
router.post("/:id/report", reportReview);

// Bulk Operations
router.post("/bulk-update", bulkUpdateReviews);
router.post("/bulk-delete", bulkDeleteReviews);
router.post("/bulk-approve", bulkApproveReviews);
router.post("/bulk-reject", bulkRejectReviews);

// Review Responses
router.get("/:id/responses", getReviewResponses);
router.post("/:id/responses", addReviewResponse);
router.put("/:id/responses/:responseId", updateReviewResponse);
router.delete("/:id/responses/:responseId", deleteReviewResponse);

// Synchronization
router.post("/sync-ratings", syncProductRatings);

export default router;
