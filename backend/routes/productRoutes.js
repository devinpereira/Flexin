import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct,
  addProductReview,
  getProductReviews
} from "../controllers/productController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProduct);
router.get("/:id/reviews", getProductReviews);

// Protected user routes
router.post("/:id/reviews", protect, addProductReview);

// Admin routes (you might want to add admin middleware here)
router.post("/", protect, upload.array("images", 10), addProduct);
router.put("/:id", protect, upload.array("images", 10), editProduct);
router.delete("/:id", protect, deleteProduct);

export default router;