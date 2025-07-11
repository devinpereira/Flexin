import express from "express";
import { createCustomWorkoutPlan, getCustomWorkoutPlan, getCustomWorkoutPlans, getWorkoutPlans, updateWorkoutPlan, updateWorkoutPlans } from "../controllers/Calculators/workoutController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getWorkoutPlans);
router.put("/", protect, updateWorkoutPlans);
router.post("/create", protect, createCustomWorkoutPlan);
router.get("/custom", protect, getCustomWorkoutPlans);
router.get("/custom/:id", protect, getCustomWorkoutPlan);
router.patch("/custom/:id", protect, updateWorkoutPlan);

export default router;