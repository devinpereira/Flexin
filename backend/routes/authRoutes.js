import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { registerUser, loginUser, getUserInfo } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/getUserInfo", protect, getUserInfo);

export default router;