import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getProfileInfo } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", protect, getProfileInfo);

export default router;