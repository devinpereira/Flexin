import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { searchFriends, sendFollowRequest, approveFollowRequest, rejectFollowRequest, unfollowUser, getFriends, getFollowers, getFollowing, suggestFriends } from "../controllers/followController.js";

const router = express.Router();

router.get("/search/:username", protect, searchFriends);
router.post("/follow/:followingId", protect, sendFollowRequest);
router.delete("/unfollow/:followingId", protect, unfollowUser);
router.post("/approve/:followId", protect, approveFollowRequest);
router.post("/reject/:followId", protect, rejectFollowRequest);
router.get("/", protect, getFriends);
router.get("/followers", protect, getFollowers);
router.get("/following", protect, getFollowing);
router.get("/suggestions", protect, suggestFriends);

export default router;