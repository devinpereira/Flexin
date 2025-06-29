import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getProfileInfo, registerProfile, getPublicProfile } from "../controllers/profileController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", protect, upload.single("profileImage"), registerProfile);
router.get("/", protect, getProfileInfo);

// Public profile (for viewing other users)
router.get("/user/:userId", protect, getPublicProfile);

export default router;