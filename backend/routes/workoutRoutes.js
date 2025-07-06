import express from "express";
import { getWorkoutPlans } from "../controllers/Calculators/workoutController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getWorkoutPlans);

export default router;