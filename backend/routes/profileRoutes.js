import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getProfileInfo, registerProfile, getPublicProfile } from "../controllers/profileController.js";

const router = express.Router();

router.post("/register", protect, registerProfile);
router.get("/", protect, getProfileInfo);

// Public profile (for viewing other users)
router.get("/user/:userId", protect, getPublicProfile);

export default router;