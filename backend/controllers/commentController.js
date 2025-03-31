import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

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