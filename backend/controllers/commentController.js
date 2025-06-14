import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import { deleteNotification, sendNotification } from "../utils/notificationHelper.js";
const BASE_URL = process.env.BASE_URL || "http://localhost:8000";

// Add a Comment
export const commentPost = async (req, res) => {
  try {
    const { comment } = req.body;
    const { id: postId } = req.params;
    const userId = req.user._id;
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const postOwnerId = post.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const imageUrl = post.content[0]
      ? `${BASE_URL}/${post.content[0]}`
      : "/src/assets/profile1.png";

    const newComment = new Comment({
      userId,
      postId,
      comment,
    });
    await newComment.save();
    post.comments += 1;
    await post.save();

    await sendNotification({
      io,
      onlineUsers,
      recipientId: postOwnerId,
      sender: user,
      type: "comment",
      postId,
      message: "commented on your post",
      postImage: imageUrl,
      extraData: {
        comment: comment,
        commentId: newComment._id,
      },
    });

    res.status(201).json({
      _id: newComment._id,
      user: {
        _id: userId,
        fullName: user.fullName,
        profileImageUrl: user.profileImageUrl,
      },
      postId,
      comment,
      createdAt: newComment.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a Comment
export const deleteComment = async (req, res) => {
  try {
    const { id: postId, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await comment.deleteOne();

    const post = await Post.findById(postId);
    if (post) {
      post.comments = Math.max(0, post.comments - 1);
      await post.save();
    }

    deleteNotification({
      io,
      onlineUsers,
      type: "comment",
      postId,
      fromUser: req.user._id,
      extraData: { commentId },
    });

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Comments
export const getComments = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .populate("userId", "fullName profileImageUrl");
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};