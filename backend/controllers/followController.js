import Follow from "../models/Follow.js";
import User from "../models/User.js";


export const searchFriends = async (req, res) => {
  try {
    const { username } = req.params;
    const userId = req.user._id;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const users = await User.aggregate([
      {
        $match: {
          username: { $regex: username, $options: "i" },
          _id: { $ne: userId },
        },
      },
      { $limit: 10 },
      {
        $lookup: {
          from: "follows",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$followerId", userId] },
                    { $eq: ["$followingId", "$$userId"] },
                    { $eq: ["$status", "accepted"] },
                  ],
                },
              },
            },
          ],
          as: "followInfo",
        },
      },
      {
        $addFields: {
          isFollowing: { $gt: [{ $size: "$followInfo" }, 0] },
        },
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          profileImageUrl: 1,
          username: 1,
          isFollowing: 1,
        },
      },
    ]);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

    res.status(201).json({ message: "Follow request sent", follow: newFollow });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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