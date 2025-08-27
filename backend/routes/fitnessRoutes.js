import express from "express";
import { 
    createFitnessProfile, 
    getFitnessProfile, 
    getFitnessStats, 
    recalculateFitnessProfile,
    saveFitnessStats,
    updateFitnessStatsEntry,
    deleteFitnessStatsEntry
} from "../controllers/Calculators/fitnessController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", protect, createFitnessProfile);
router.get("/profile", protect, getFitnessProfile);
router.put("/recalculate", protect, recalculateFitnessProfile);
router.get("/fitness-stats", protect, getFitnessStats);

// New CRUD routes for fitness stats
router.post("/fitness-stats", protect, saveFitnessStats);
router.put("/fitness-stats", protect, updateFitnessStatsEntry);
router.delete("/fitness-stats/:entryType/:entryId", protect, deleteFitnessStatsEntry);

export default router;