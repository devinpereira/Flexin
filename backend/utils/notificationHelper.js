import Notification from "../models/Notification.js";
const BASE_URL = process.env.BASE_URL || "http://localhost:8000";

export const sendNotification = async ({
  io,
  onlineUsers,
  recipientId,
  sender,
  type,
  postId,
  message,
  postImage,
  extraData = {},
}) => {
  if (!recipientId || recipientId.toString() === sender._id.toString()) return;

  // 1. Save to Notification collection
  const notification = await Notification.create({
    userId: recipientId,
    type,
    fromUser: sender._id,
    postId,
    message,
    commentId: extraData.commentId || null,
  });

  // 2. Emit socket notification if the user is online
  const recipientSocketId = onlineUsers.get(recipientId.toString());
  if (recipientSocketId) {
    io.to(recipientSocketId).emit(`${type}PostNotify`, {
      notificationId: notification._id,
      [`${type === "like" ? "liker" : "commenter"}Name`]: sender.fullName,
      [`${type === "like" ? "liker" : "commenter"}ProfileImage`]: sender.profileImageUrl
        ? `${BASE_URL}/${sender.profileImageUrl}`
        : "/src/assets/profile1.png",
      message,
      postImage,
      ...extraData,
    });
  }
};

export const deleteNotification = async ({
  io,
  onlineUsers,
  type,
  postId,
  fromUser,
  extraData = {},
}) => {
  const deletedNotification = await Notification.findOneAndDelete({
    type,
    postId,
    commentId: extraData.commentId || null,
    fromUser,
  });

  if (!deletedNotification) return;

  const recipientSocketId = onlineUsers.get(deletedNotification.userId.toString());
  if (recipientSocketId) {
    io.to(recipientSocketId).emit(`${type}DeleteNotify`, {
      notificationId: deletedNotification._id,
    });
  }
}