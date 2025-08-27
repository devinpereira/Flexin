import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    createOrder,
    getUserOrders,
    getOrder,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
    syncProductInventory
} from "../controllers/orderController.js";

const router = express.Router();

// All order routes require authentication
router.use(protect);

// User routes
router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/:id", getOrder);
router.put("/:id/cancel", cancelOrder);

// Admin routes (you might want to add admin middleware here)
router.get("/admin/all", getAllOrders);
router.put("/admin/:id/status", updateOrderStatus);
router.post("/admin/sync/:productId", syncProductInventory);

export default router;
