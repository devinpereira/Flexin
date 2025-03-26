// Create a Post
router.post('/posts', authenticate, upload.single('media'), async (req, res) => {
    try {
        const { text } = req.body;
        const media = req.file ? req.file.path : null;
        const newPost = new Post({ user: req.user.id, text, media });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a Post
router.delete('/posts/:id', authenticate, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (post.user.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
        await post.deleteOne();
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Like/Unlike a Post
router.post('/posts/:id/like', authenticate, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        const isLiked = post.likes.includes(req.user.id);
        if (isLiked) {
            post.likes = post.likes.filter(userId => userId !== req.user.id);
        } else {
            post.likes.push(req.user.id);
        }
        await post.save();
        res.json({ likes: post.likes.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a Comment
router.post('/posts/:id/comments', authenticate, async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        const newComment = new Comment({ user: req.user.id, post: post._id, text });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;