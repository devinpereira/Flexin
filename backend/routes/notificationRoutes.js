import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.patch("/read/:id", protect, markNotificationAsRead);
router.patch("/read-all", protect, markNotificationAsRead);
router.delete("/delete/:id", protect, deleteNotification);
router.delete("/delete-all", protect, deleteAllNotifications);

export default router;
