import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getSubcategories,
    createSubcategory
} from "../controllers/categoryController.js";

const router = express.Router();

// Public routes
router.get("/", getCategories);
router.get("/:id", getCategory);

// Subcategory routes
router.get("/:categoryId/subcategories", getSubcategories);
router.get("/subcategories/all", (req, res, next) => {
    req.params.categoryId = null;
    next();
}, getSubcategories);

// Admin routes (you might want to add admin middleware here)
router.post("/", protect, createCategory);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);
router.post("/subcategories", protect, createSubcategory);

export default router;
