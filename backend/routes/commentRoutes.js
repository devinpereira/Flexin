import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { commentPost, deleteComment, getComments } from "../controllers/Community/commentController.js";

const router = express.Router();

router.post("/:id", protect, commentPost);
router.delete("/:id/:commentId", protect, deleteComment);
router.get("/:id", protect, getComments);

export default router;