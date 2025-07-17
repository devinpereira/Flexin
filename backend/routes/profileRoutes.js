import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getProfileInfo, registerProfile, getPublicProfile, updateProfileImage, updateProfile, reportProfile, flagProfile, unflagProfile, suspendProfile, unsuspendProfile, banProfile, unbanProfile } from "../controllers/Community/profileController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", protect, upload.single("profileImage"), registerProfile);
router.get("/", protect, getProfileInfo);
router.get("/user/:userId", protect, getPublicProfile);
router.patch("/update", protect, upload.single("profile"),updateProfile);
router.patch("/update-pic", protect, upload.single("profileImage"),updateProfileImage);
router.post("/report", protect, reportProfile);
router.patch("/flag", protect, flagProfile);
router.patch("/unflag", protect, unflagProfile);
router.patch("/suspend", protect, suspendProfile);
router.patch("/unsuspend", protect, unsuspendProfile);
router.patch("/ban", protect, banProfile);
router.patch("/unban", protect, unbanProfile);

export default router;