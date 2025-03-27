import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { commentPost, deletePost, likePost, createPost } from "../controllers/postController.js";

const router = express.Router();

router.post("/", protect, upload.array("media", 5), createPost);
router.get("/", getPosts);
router.get("/:id", getPost);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, likePost);
router.post("/:id/comment", protect, commentPost);

export default router;