import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { searchFriends, sendFollowRequest, approveFollowRequest, rejectFollowRequest } from "../controllers/followController.js";

const router = express.Router();

router.get("/search/:username", protect, searchFriends);
router.post("/follow/:followingId", protect, sendFollowRequest);
router.post("/approve/:followId", protect, approveFollowRequest);
router.post("/reject/:followId", protect, rejectFollowRequest);

export default router;