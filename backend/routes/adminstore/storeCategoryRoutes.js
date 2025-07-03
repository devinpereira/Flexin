import express from "express";
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    updateCategoryStatus,
    bulkUpdateCategories,
    bulkDeleteCategories,
    uploadCategoryImage,
    deleteCategoryImage,
    getCategoryProducts,
    getAllSubcategories,
    getSubcategoryById,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    updateSubcategoryStatus,
    bulkUpdateSubcategories,
    bulkDeleteSubcategories,
    uploadSubcategoryImage,
    deleteSubcategoryImage,
    getSubcategoryProducts,
    getCategoriesWithSubcategories,
    reorderCategories,
    reorderSubcategories
} from "../../controllers/adminstore/storeCategoryController.js";
import upload from "../../middleware/uploadMiddleware.js";

const router = express.Router();

// Category Routes
router.get("/", getAllCategories);
router.get("/with-subcategories", getCategoriesWithSubcategories);
router.get("/:id", getCategoryById);
router.get("/:id/products", getCategoryProducts);
router.post("/", upload.single("image"), createCategory);
router.put("/:id", upload.single("image"), updateCategory);
router.delete("/:id", deleteCategory);

// Category Status and Management
router.patch("/:id/status", updateCategoryStatus);
router.post("/bulk-update", bulkUpdateCategories);
router.post("/bulk-delete", bulkDeleteCategories);
router.post("/reorder", reorderCategories);

// Category Images
router.post("/:id/image", upload.single("image"), uploadCategoryImage);
router.delete("/:id/image", deleteCategoryImage);

// Subcategory Routes
router.get("/subcategories/all", getAllSubcategories);
router.get("/subcategories/:id", getSubcategoryById);
router.get("/subcategories/:id/products", getSubcategoryProducts);
router.post("/subcategories", upload.single("image"), createSubcategory);
router.put("/subcategories/:id", upload.single("image"), updateSubcategory);
router.delete("/subcategories/:id", deleteSubcategory);

// Subcategory Status and Management
router.patch("/subcategories/:id/status", updateSubcategoryStatus);
router.post("/subcategories/bulk-update", bulkUpdateSubcategories);
router.post("/subcategories/bulk-delete", bulkDeleteSubcategories);
router.post("/subcategories/reorder", reorderSubcategories);

// Subcategory Images
router.post("/subcategories/:id/image", upload.single("image"), uploadSubcategoryImage);
router.delete("/subcategories/:id/image", deleteSubcategoryImage);

export default router;
