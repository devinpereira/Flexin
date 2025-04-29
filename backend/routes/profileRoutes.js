import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getProfileInfo, registerProfile } from "../controllers/profileController.js";

const router = express.Router();

router.post("/register", protect, registerProfile);
router.get("/", protect, getProfileInfo);

export default router;