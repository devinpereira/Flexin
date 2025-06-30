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
          postImage = post?.content?.[0] || null;
        }

        return {
          id: notification._id,
          type: notification.type,
          user: {
            name: user.fullName,
            username: profile?.username || "",
            profileImage: user.profileImageUrl
              ? user.profileImageUrl
              : "/default.jpg",
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
    res
      .status(500)
      .json({ message: "Server error while fetching notifications" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  const notificationId = req.params.id;
  const userId = req.user._id;

  try {
    const notification = await Notification.findOneAndUpdate(
      { userId, _id: notificationId, read: false },
      { $set: { read: true } }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found or already read" });
    } else {
      res.status(200).json({ message: "Notification marked as read" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while marking notification as read" });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  const userId = req.user._id;
  try {
    const result = await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "All notifications marked as read" });
    } else {
      res.status(404).json({ message: "No unread notifications found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while marking notifications as read",
        error: error.message,
      });
  }
};

export const deleteNotification = async (req, res) => {
  const notificationId = req.params.id;
  const userId = req.user._id;

  try {
    const notification = await Notification.findOneAndDelete({ userId, _id: notificationId, read: true });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found or not read" });
    } else {
      res.status(200).json({ message: "Notification deleted successfully" });
    }
  }catch (error) {
    res.status(500).json({ message: "Server error while deleting notification" });
  }
};

export const deleteAllNotifications = async (req, res) => {
  const userId = req.user._id;
  try {
    const result = await Notification.deleteMany({ userId, read: true });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "All notifications deleted" });
    } else {
      res.status(404).json({ message: "No notifications found to delete" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting notifications", error: error.message });
  }
};