import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  deletePost,
  likePost,
  createPost,
  getPosts,
  getPost,
  editPost,
  getFeedPosts,
  getPostsByUserId,
} from "../controllers/Community/postController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/feed", protect, getFeedPosts);
router.post("/", protect, upload.array("media", 5), createPost);
router.get("/", protect, getPosts);
router.get("/user/:id", protect, getPostsByUserId);
router.get("/:id", protect, getPost);
router.put("/:id", protect, upload.array("media", 5), editPost);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, likePost);

export default router;