import express from "express";
import { createFitnessProfile, getFitnessProfile } from "../controllers/Calculators/fitnessController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", protect, createFitnessProfile);
router.get("/profile", protect, getFitnessProfile);

export default router;