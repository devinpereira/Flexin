import express from "express";
import {
    getAllInventory,
    getInventoryById,
    createInventory,
    updateInventory,
    deleteInventory,
    updateStock,
    bulkUpdateStock,
    bulkDeleteInventory,
    getInventoryAlerts,
    getLowStockItems,
    getOutOfStockItems,
    getStockHistory,
    generateStockReport,
    exportInventory,
    searchInventory,
    adjustStock,
    reserveStock,
    releaseStock,
    transferStock,
    auditInventory,
    getInventoryAnalytics,
    setStockAlerts,
    updateStockAlerts,
    deleteStockAlerts,
    getStockMovements,
    bulkStockAdjustment,
    importInventory,
    syncInventoryWithProducts
} from "../../controllers/adminstore/storeInventoryController.js";
import upload from "../../middleware/uploadMiddleware.js";

const router = express.Router();

// Inventory CRUD Routes
router.get("/", getAllInventory);
router.get("/search", searchInventory);
router.get("/analytics", getInventoryAnalytics);
router.get("/export", exportInventory);
router.get("/low-stock", getLowStockItems);
router.get("/out-of-stock", getOutOfStockItems);
router.get("/alerts", getInventoryAlerts);
router.get("/report", generateStockReport);
router.get("/:id", getInventoryById);
router.post("/", createInventory);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

// Stock Management
router.patch("/:id/stock", updateStock);
router.post("/:id/adjust", adjustStock);
router.post("/:id/reserve", reserveStock);
router.post("/:id/release", releaseStock);
router.post("/:id/transfer", transferStock);

// Bulk Operations
router.post("/bulk-update", bulkUpdateStock);
router.post("/bulk-delete", bulkDeleteInventory);
router.post("/bulk-adjust", bulkStockAdjustment);
router.post("/import", upload.single("file"), importInventory);

// Stock History and Tracking
router.get("/:id/history", getStockHistory);
router.get("/:id/movements", getStockMovements);
router.post("/:id/audit", auditInventory);

// Stock Alerts
router.post("/:id/alerts", setStockAlerts);
router.put("/:id/alerts", updateStockAlerts);
router.delete("/:id/alerts", deleteStockAlerts);

// Synchronization
router.post("/sync-products", syncInventoryWithProducts);

export default router;
