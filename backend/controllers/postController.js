import Post from "../models/Post.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import Follow from "../models/Follow.js";

// Get Feed Posts
export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get list of followed user IDs
    const following = await Follow.find({ followerId: userId, status: "accepted" }).select("followingId");
    const followedUserIds = following.map((f) => f.followingId);

    // Aggregate posts with user and profile data
    const feedPosts = await Post.aggregate([
      { $match: { userId: { $in: followedUserIds } } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $lookup: {
          from: "profiledatas",
          localField: "userId",
          foreignField: "userId",
          as: "profileInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $unwind: "$profileInfo",
      },
      {
        $addFields: {
          user: {
            username: "$profileInfo.username",
            profileImageUrl: "$userInfo.profileImageUrl",
          },
        },
      },
      {
        $project: {
          userInfo: 0,
          profileInfo: 0,
          __v: 0,
        },
      },
    ]);

    res.status(200).json(feedPosts);
  } catch (err) {
    res.status(500).json({ message: "Failed to get feed posts", error: err.message });
  }
};

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

// Get Posts by User ID
export const getPostsByUserId = async (req, res) => {
  const { id: userId } = req.params;

  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    if (!posts) {
      return res.status(404).json({ message: "No posts found for this user" });
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error getting posts", error: err.message });
  }
}

// Get a Post
export const getPost = async (req, res) => {
  const { id: postId } = req.params;

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
    const { description } = req.body;
    const mediaFiles = req.files ? req.files.map((file) => file.path.replace(/\\/g, '/')) : [];
    const newPost = new Post({
      userId: req.user._id,
      description,
      content: mediaFiles,
    });
    await newPost.save();

    // Increment post count for the user
    await ProfileData.findOneAndUpdate(
      { userId: req.user._id },
      { $inc: { noOfPosts: 1 } },
      { new: true }
    );
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

    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Like.deleteMany({ postId: post._id });
    await Comment.deleteMany({ postId: post._id });
    await post.deleteOne();

    // Increment post count for the user
    await ProfileData.findOneAndUpdate(
      { userId: req.user._id },
      { $inc: { noOfPosts: -1 } },
      { new: true }
    );

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
      await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } });
      return res.json({ message: "Post unliked" });
    }

    // Like the post
    await new Like({ postId, userId }).save();
    await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });

    res.json({ message: "Post liked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};