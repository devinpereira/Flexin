import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  addProduct,
  deleteProduct,
  editProduct,
  getProduct,
  getProducts,
  rateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.delete("/:id", protect, deleteProduct);
router.put("/:id", protect, upload.array("media", 5), editProduct);
router.post("/", protect, upload.array("media", 5), addProduct);
router.post("/:id/like", protect, rateProduct);

export default router;