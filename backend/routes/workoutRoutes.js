import express from "express";
import { generateWorkout } from "../controllers/Calculators/workoutController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, generateWorkout);

export default router;