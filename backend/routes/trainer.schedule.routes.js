import express from "express";
import { protect } from '../middleware/authMiddleware.js';
import {
  upsertTrainerSchedule,
  getTrainerSchedule,
  deleteTrainerSchedule,
  assignScheduleToUser,
  getTrainerSubscribers,
  getTrainerAssignedSchedules,
  getUserScheduleForTrainer,
  deleteUserScheduleByTrainer,
  getAvailableExercises,
  updateUserScheduleByTrainer
} from "../controllers/trainer.schedule.controller.js";

const router = express.Router();

// User perspective routes (existing)
router.get("/:trainerId", protect, getTrainerSchedule);
router.post("/:trainerId", protect, upsertTrainerSchedule);
router.delete("/:trainerId", protect, deleteTrainerSchedule);

// Trainer perspective routes (new)
router.get("/trainer/subscribers", protect, getTrainerSubscribers);
router.get("/trainer/assigned-schedules", protect, getTrainerAssignedSchedules);
router.get("/trainer/user/:userId", protect, getUserScheduleForTrainer);
router.post("/trainer/assign/:userId", protect, assignScheduleToUser);
router.put("/trainer/update/:userId", protect, updateUserScheduleByTrainer);
router.delete("/trainer/user/:userId", protect, deleteUserScheduleByTrainer);
router.get("/exercises", protect, getAvailableExercises);

export default router;