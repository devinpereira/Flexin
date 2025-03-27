import express from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

const router = express.Router();

// Get Posts
export const getPosts = async (req, res) => {}

// Get a Post
export const getPost = async (req, res) => {}

// Create a Post
export const createPost = async (req, res) => {
    try {
        const { description, content } = req.body;
        const mediaFiles = req.files ? req.files.map(file => file.path) : [];
        const newPost = new Post({ userId: req.user._id, description, content: mediaFiles.length > 0 ? mediaFiles : content });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a Post
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (post.userId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Unauthorized' });
        await post.deleteOne();
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Like/Unlike a Post
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        
        const isLiked = post.likes.includes(req.user._id);
        if (isLiked) {
            post.likes = post.likes.filter(userId => userId.toString() !== req.user._id.toString());
        } else {
            post.likes.push(req.user._id);
        }
        await post.save();
        res.json({ likes: post.likes.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a Comment
export const commentPost = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        
        const newComment = new Comment({ userId: req.user._id, postId: post._id, text });
        await newComment.save();
        post.comments += 1;
        await post.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export default router;