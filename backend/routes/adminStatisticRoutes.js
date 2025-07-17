import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getGenderDistribution, getStatistics, getUserRegistrationInfo } from "../controllers/Admin/getAdminInfo.js";

const router = express.Router();

router.get("/getStatistics", protect, getStatistics);
router.get("/userCount", protect, getUserRegistrationInfo);
router.get("/genderInfo", protect, getGenderDistribution);

export default router;