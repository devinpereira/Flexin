import express from "express";
import { getWorkoutPlan } from "../controllers/workoutController.js";

const router = express.Router();

router.post("/", getWorkoutPlan);

export default router;