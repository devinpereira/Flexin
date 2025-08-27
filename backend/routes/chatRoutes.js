import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createOrAddMessage, getChat, updateMessage, getTrainerChats } from "../controllers/chatController.js";

const router = express.Router();

// Create or add message to chat
router.post("/", protect, createOrAddMessage);
router.get("/", protect, getChat);
router.put("/message", protect, updateMessage);
router.get("/trainer/:trainerId", protect, getTrainerChats);

export default router;