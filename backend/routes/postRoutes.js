import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  commentPost,
  deletePost,
  likePost,
  createPost,
  getPosts,
  getPost,
  editPost,
  deleteComment,
  getFeedPosts,
  getComments,
} from "../controllers/postController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/feed", protect, getFeedPosts);
router.post("/", protect, upload.array("media", 5), createPost);
router.get("/", protect, getPosts);
router.get("/:id", protect, getPost);
router.put("/:id", protect, upload.array("media", 5), editPost);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, likePost);
router.post("/:id/comment", protect, commentPost);
router.delete("/:id/comment/:commentId", protect, deleteComment);
router.get("/:id/comment/all", protect, getComments);

export default router;