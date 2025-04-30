import Follow from "../models/Follow.js";
import User from "../models/User.js";
import ProfileData from "../models/ProfileData.js";

// Search for Friends
export const searchFriends = async (req, res) => {
  try {
    const { username } = req.params;
    const userId = req.user._id;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Step 1: Search matching profiles
    const profiles = await ProfileData.find({
      username: { $regex: username, $options: "i" },
      userId: { $ne: userId },
    })
      .limit(10)
      .populate("userId", "fullName profileImageUrl")
      .lean();

    const followedUserIds = profiles.map((p) => p.userId._id);

    // Step 2: Get follow statuses (accepted, pending)
    const followRecords = await Follow.find({
      followerId: userId,
      followingId: { $in: followedUserIds },
    }).select("followingId status");

    const followStatusMap = {};
    followRecords.forEach((f) => {
      followStatusMap[f.followingId.toString()] = f.status;
    });

    // Step 3: Append follow status to each profile
    const result = profiles.map((p) => {
      const followingIdStr = p.userId._id.toString();
      return {
        _id: p.userId._id,
        username: p.username,
        fullName: p.userId.fullName,
        profileImageUrl: p.userId.profileImageUrl,
        bio: p.bio,
        noOfPosts: p.noOfPosts,
        followers: p.followers,
        following: p.following,
        followStatus: followStatusMap[followingIdStr] || null, // "accepted", "pending", or null
      };
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send Follow Request
export const sendFollowRequest = async (req, res) => {
  try {
    const { followingId } = req.params;
    const followerId = req.user._id;

    if (followerId.toString() === followingId.toString()) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const existingFollow = await Follow.findOne({ followerId, followingId });

    if (existingFollow) {
      return res.status(400).json({ error: "Follow request already sent" });
    }

    const newFollow = new Follow({
      followerId,
      followingId,
      status: "accepted",
    });

    await newFollow.save();

    // Update the following and followers count for both users
    await ProfileData.findOneAndUpdate(
      { userId: followerId }, 
      { $inc: { following: 1 } },  // Increment following count of the follower
      { new: true }
    );

    await ProfileData.findOneAndUpdate(
      { userId: followingId }, 
      { $inc: { followers: 1 } },  // Increment followers count of the followed user
      { new: true }
    );

    res.status(201).json({ message: "Follow request sent", follow: newFollow });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Follow Requests - need to fix
export const getFollowRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const followRequests = await Follow.find({
      followingId: userId,
      status: "pending",
    })
      .populate("followerId", "fullName profileImageUrl")
      .lean();

    res.status(200).json(followRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Unfollow User
export const unfollowUser = async (req, res) => {
  try {
    const { followingId } = req.params;
    const followerId = req.user._id;

    const follow = await Follow.findOneAndDelete({
      followerId,
      followingId,
      status: "accepted",
    });

    if (!follow) {
      return res.status(404).json({ error: "Follow relationship not found" });
    }

    // Decrement counts
    await ProfileData.findOneAndUpdate(
      { userId: followerId },
      { $inc: { following: -1 } },
      { new: true }
    );

    await ProfileData.findOneAndUpdate(
      { userId: followingId },
      { $inc: { followers: -1 } },
      { new: true }
    );

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve Request
export const approveFollowRequest = async (req, res) => {
  try {
    const { followId } = req.params;

    const follow = await Follow.findById(followId);
    if (!follow)
      return res.status(404).json({ error: "Follow request not found" });

    follow.status = "accepted";
    await follow.save();

    res.json({ message: "Follow request approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Decline Request
export const rejectFollowRequest = async (req, res) => {
  try {
    const { followId } = req.params;

    const follow = await Follow.findById(followId);
    if (!follow)
      return res.status(404).json({ error: "Follow request not found" });

    await follow.deleteOne();

    res.json({ message: "Follow request rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Friends and Following list
export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = 5;

    // 1. Get accepted followings
    const followings = await Follow.find({
      followerId: userId,
      status: 'accepted'
    });

    // 2. Get accepted followers
    const followers = await Follow.find({
      followingId: userId,
      status: 'accepted'
    });

    const followingIds = followings.map(f => f.followingId.toString());
    const followerIds = followers.map(f => f.followerId.toString());

    const friendIds = followingIds.filter(id => followerIds.includes(id));
    const otherFollowings = followingIds.filter(id => !friendIds.includes(id));

    // 3. Fetch friend and following user data
    const friends = await User.find({ _id: { $in: friendIds } })
      .select('_id fullName profileImageUrl')
      .lean();

    const others = await User.find({ _id: { $in: otherFollowings } })
      .select('_id fullName profileImageUrl')
      .lean();

    const prioritized = [
      ...friends.map(u => ({ ...u, isFriend: true })),
      ...others.map(u => ({ ...u, isFriend: false }))
    ];

    // 4. Apply limit
    const limited = prioritized.slice(0, limit);

    res.json({ success: true, friends: limited });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Followers
export const getFollowers = async (req, res) => {}

// Get Following
export const getFollowing = async (req, res) => {}

// Suggest Friends
export const suggestFriends = async (req, res) => {}