import express from "express";
import { createFitnessProfile, getFitnessProfile, getFitnessProfileById } from "../controllers/Calculators/fitnessController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", protect, createFitnessProfile);
router.get("/profile", protect, getFitnessProfile);
router.get("/profile/:userId", protect, getFitnessProfileById);

export default router;