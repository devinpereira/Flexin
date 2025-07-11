import express from "express";
import { createCustomWorkoutPlan, deleteCustomWorkoutPlan, getCustomWorkoutPlan, getCustomWorkoutPlans, getWorkoutPlans, updateWorkoutPlan, updateWorkoutPlans } from "../controllers/Calculators/workoutController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getWorkoutPlans);
router.put("/", protect, updateWorkoutPlans);
router.post("/create", protect, createCustomWorkoutPlan);
router.get("/custom", protect, getCustomWorkoutPlans);
router.get("/custom/:id", protect, getCustomWorkoutPlan);
router.patch("/custom/:id", protect, updateWorkoutPlan);
router.delete("/custom/:id", protect, deleteCustomWorkoutPlan);

export default router;