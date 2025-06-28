import express from "express";
import { protect } from '../middleware/authMiddleware.js';
import {
  upsertTrainerSchedule,
  getTrainerSchedule,
  deleteTrainerSchedule,
} from "../controllers/trainer.schedule.controller.js";

const router = express.Router();

// Get a user's schedule for a trainer
router.get("/:trainerId", protect, getTrainerSchedule);

// Create or update a schedule for a user and trainer
router.post("/:trainerId", protect, upsertTrainerSchedule);

// Delete a user's schedule for a trainer
router.delete("/:trainerId", protect, deleteTrainerSchedule);

export default router;