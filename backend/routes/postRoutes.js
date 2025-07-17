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
  getAllPosts,
  reportPost,
  flagPost,
  removePost,
} from "../controllers/Community/postController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/feed", protect, getFeedPosts);
router.post("/", protect, upload.array("media", 5), createPost);
router.get("/", protect, getPosts);
router.get("/all", protect, getAllPosts);
router.get("/user/:id", protect, getPostsByUserId);
router.get("/:id", protect, getPost);
router.put("/:id", protect, upload.array("media", 5), editPost);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, likePost);
router.post("/report/:id", protect, reportPost);
router.patch("/flag/:id", protect, flagPost);
router.patch("/remove/:id", protect, removePost);

export default router;