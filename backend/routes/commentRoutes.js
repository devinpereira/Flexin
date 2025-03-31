import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { commentPost, deleteComment, getComments } from "../controllers/commentController.js";

const router = express.Router();

router.post("/:id", protect, commentPost);
router.delete("/:id/:commentId", protect, deleteComment);
router.get("/:id", protect, getComments);

export default router;