import Notification from "../models/Notification.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import ProfileData from "../models/ProfileData.js";
const BASE_URL = process.env.BASE_URL || "http://localhost:8000";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get notifications for the logged-in user, sorted by most recent
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const enrichedNotifications = await Promise.all(
      notifications.map(async (notification) => {

        const user = await User.findById(notification.fromUser).lean();
        const profile = await ProfileData.findOne({ userId: user._id }).lean();

        let postImage = null;
        if (notification.postId) {
          const post = await Post.findById(notification.postId).lean();
          postImage = `${BASE_URL}/${post?.content?.[0]}` || null;
        }

        return {
          id: notification._id,
          type: notification.type,
          user: {
            name: user.fullName,
            username: profile?.username || "",
            profileImage: user.profileImageUrl ? `${BASE_URL}/${user.profileImageUrl}` : "/src/assets/profile1.png",
          },
          content: notification.message,
          postImage: postImage,
          time: notification.createdAt,
          read: notification.read,
        };
      })
    );

    res.status(200).json(enrichedNotifications);
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ message: "Server error while fetching notifications" });
  }
};