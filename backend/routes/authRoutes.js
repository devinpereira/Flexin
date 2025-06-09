import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/authMiddleware.js";
import { registerUser, loginUser, getUserInfo, sendVerifyOtp, resetPassword, sendResetOtp, verifyEmail } from "../controllers/authController.js";
import { googleAuthCallback } from "../controllers/oauthController.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/getUserInfo", protect, getUserInfo);

router.post('/send-verify-otp', protect, sendVerifyOtp);
router.post('/verify-otp', protect, verifyEmail);
router.post('/send-reset-otp', sendResetOtp);
router.post('/reset-password', resetPassword);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  googleAuthCallback
);

export default router;