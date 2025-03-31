import express from "express";
import Post from "../models/Post.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";

const router = express.Router();

// Get feed Posts
export const getFeedPosts = async (req, res) => {};

// Get User Posts
export const getPosts = async (req, res) => {
  const userId = req.user._id;

  try {
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  }
  catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get a Post
export const getPost = async (req, res) => {
  const { id: postId } = req.params;

  // Validate ObjectId (optional but recommended)
  if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting post", error: err.message });
  }
};

// Create a Post
export const createPost = async (req, res) => {
  try {
    const { description, content } = req.body;
    const mediaFiles = req.files ? req.files.map((file) => file.path) : [];
    const newPost = new Post({
      userId: req.user._id,
      description,
      content: mediaFiles.length > 0 ? mediaFiles : content,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a Post
export const editPost = async (req, res) => {
  try {
    const { description, content } = req.body;
    const mediaFiles = req.files ? req.files.map((file) => file.path) : [];

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    post.description = description || post.description;
    post.content = mediaFiles.length > 0 ? mediaFiles : content || post.content;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a Post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Check if the user is the owner of the post
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Like.deleteMany({ postId: post._id });
    await Comment.deleteMany({ postId: post._id });
    await post.deleteOne();

    res.json({ message: "Post and associated likes/comments deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Like/Unlike a Post
export const likePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const existingLike = await Like.findOne({ postId, userId });

    if (existingLike) {
      // Unlike the post
      await Like.deleteOne({ postId, userId });
      await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } }); // Decrease like count
      return res.json({ message: "Post unliked" });
    }

    // Like the post
    await new Like({ postId, userId }).save();
    await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } }); // Increase like count

    res.json({ message: "Post liked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a Comment
export const commentPost = async (req, res) => {
  try {
    const { comment } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const newComment = new Comment({
      userId: req.user._id,
      postId: post._id,
      comment,
    });
    await newComment.save();
    post.comments += 1;
    await post.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a Comment
export const deleteComment = async (req, res) => {
  try {
    const { id: postId, commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await comment.deleteOne();

    const post = await Post.findById(postId);
    if (post) {
      post.comments -= 1;
      await post.save();
    }

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Comments
export const getComments = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};