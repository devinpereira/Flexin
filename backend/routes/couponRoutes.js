import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getAllCoupons,
    getActiveCoupons,
    validateCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon
} from "../controllers/couponController.js";

const router = express.Router();

// Public routes
router.get("/active", getActiveCoupons);

// Protected user routes
router.post("/validate", protect, validateCoupon);

// Admin routes (you might want to add admin middleware here)
router.get("/", protect, getAllCoupons);
router.post("/", protect, createCoupon);
router.put("/:id", protect, updateCoupon);
router.delete("/:id", protect, deleteCoupon);

export default router;
