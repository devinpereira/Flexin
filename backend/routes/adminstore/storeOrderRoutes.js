import express from "express";
import {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    bulkUpdateOrders,
    bulkDeleteOrders,
    getOrderAnalytics,
    exportOrders,
    searchOrders,
    getOrdersByStatus,
    getOrdersByDateRange,
    processRefund,
    generateInvoice,
    sendOrderConfirmation,
    trackOrder,
    addOrderNote,
    updateOrderNote,
    deleteOrderNote,
    getOrderNotes,
    updateShippingInfo,
    updatePaymentStatus,
    markOrderAsPaid,
    markOrderAsShipped,
    markOrderAsDelivered,
    cancelOrder,
    fulfillOrder
} from "../../controllers/adminstore/storeOrderController.js";

const router = express.Router();

// Order CRUD Routes
router.get("/", getAllOrders);
router.get("/search", searchOrders);
router.get("/analytics", getOrderAnalytics);
router.get("/export", exportOrders);
router.get("/status/:status", getOrdersByStatus);
router.get("/date-range", getOrdersByDateRange);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

// Order Status Management
router.patch("/:id/status", updateOrderStatus);
router.patch("/:id/payment-status", updatePaymentStatus);
router.patch("/:id/mark-paid", markOrderAsPaid);
router.patch("/:id/mark-shipped", markOrderAsShipped);
router.patch("/:id/mark-delivered", markOrderAsDelivered);
router.patch("/:id/cancel", cancelOrder);
router.patch("/:id/fulfill", fulfillOrder);

// Bulk Operations
router.post("/bulk-update", bulkUpdateOrders);
router.post("/bulk-delete", bulkDeleteOrders);

// Order Processing
router.post("/:id/refund", processRefund);
router.get("/:id/invoice", generateInvoice);
router.post("/:id/send-confirmation", sendOrderConfirmation);
router.get("/:id/track", trackOrder);

// Order Notes
router.get("/:id/notes", getOrderNotes);
router.post("/:id/notes", addOrderNote);
router.put("/:id/notes/:noteId", updateOrderNote);
router.delete("/:id/notes/:noteId", deleteOrderNote);

// Shipping Information
router.patch("/:id/shipping", updateShippingInfo);

export default router;
