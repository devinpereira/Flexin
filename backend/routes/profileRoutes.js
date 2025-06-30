import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getProfileInfo, registerProfile, getPublicProfile, updateProfileImage, updateProfile } from "../controllers/profileController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", protect, upload.single("profileImage"), registerProfile);
router.get("/", protect, getProfileInfo);
router.get("/user/:userId", protect, getPublicProfile);
router.patch("/update", protect, upload.single("profile"),updateProfile);
router.patch("/update-pic", protect, upload.single("profileImage"),updateProfileImage);

export default router;