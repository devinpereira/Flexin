import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { addExercise, deleteExercise, updateExercise } from "../controllers/Calculators/exerciseController.js";

const router = express.Router();

router.post("/", protect, addExercise);
router.patch("/:id", protect, updateExercise);
router.delete("/:id", protect, deleteExercise);

export default router;