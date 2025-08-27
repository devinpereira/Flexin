import express from "express";
import { optionalAuth } from "../../middleware/authMiddleware.js";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus,
    bulkUpdateProducts,
    bulkDeleteProducts,
    getProductAnalytics,
    exportProducts,
    searchProducts,
    getFeaturedProducts,
    updateFeaturedStatus,
    uploadProductImages,
    deleteProductImage,
    getProductVariants,
    createProductVariant,
    updateProductVariant,
    deleteProductVariant,
    updateInventoryStock,
    bulkUpdateStock,
    cloneProduct,
    getProductReviews
} from "../../controllers/adminstore/storeProductController.js";
import upload from "../../middleware/uploadMiddleware.js";

const router = express.Router();

// Product CRUD Routes
router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/featured", optionalAuth, getFeaturedProducts);
router.get("/analytics", getProductAnalytics);
router.get("/export", exportProducts);
router.get("/:id", getProductById);
router.post("/", upload.array("images", 10), createProduct);
router.put("/:id", upload.array("images", 10), updateProduct);
router.delete("/:id", deleteProduct);

// Product Status Management
router.patch("/:id/status", updateProductStatus);
router.patch("/:id/featured", updateFeaturedStatus);

// Bulk Operations
router.post("/bulk-update", bulkUpdateProducts);
router.post("/bulk-delete", bulkDeleteProducts);
router.post("/bulk-stock", bulkUpdateStock);

// Product Images
router.post("/:id/images", upload.array("images", 10), uploadProductImages);
router.delete("/:id/images/:imageId", deleteProductImage);

// Product Variants (if needed)
router.get("/:id/variants", getProductVariants);
router.post("/:id/variants", createProductVariant);
router.put("/:id/variants/:variantId", updateProductVariant);
router.delete("/:id/variants/:variantId", deleteProductVariant);

// Inventory Management
router.patch("/:id/stock", updateInventoryStock);

// Product Cloning
router.post("/:id/clone", cloneProduct);

// Product Reviews
router.get("/:id/reviews", getProductReviews);

export default router;
