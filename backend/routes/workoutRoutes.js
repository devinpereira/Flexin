import express from "express";
import { getWorkoutPlans, updateWorkoutPlans } from "../controllers/Calculators/workoutController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getWorkoutPlans);
router.put("/", protect, updateWorkoutPlans);

export default router;