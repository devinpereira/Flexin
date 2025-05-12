import Post from "../models/Post.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import Follow from "../models/Follow.js";
import ProfileData from "../models/ProfileData.js";
import User from "../models/User.js";
const BASE_URL = process.env.BASE_URL || "http://localhost:8000";

// Get Feed Posts
export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get list of followed user IDs
    const following = await Follow.find({
      followerId: userId,
      status: "accepted",
    }).select("followingId");
    const followedUserIds = following.map((f) => f.followingId);

    // Aggregate posts with user and profile data and liked status
    const feedPosts = await Post.aggregate([
      { $match: { userId: { $in: followedUserIds } } },
      { $sort: { createdAt: -1 } },

      // Join user info
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

      // Check if this post is liked by the current user
      {
        $lookup: {
          from: "likes",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    { $eq: ["$userId", userId] },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: "likedByUser",
        },
      },

      { $unwind: "$userInfo" },
      { $unwind: "$profileInfo" },

      // Add user info and liked status
      {
        $addFields: {
          user: {
            name: "$userInfo.fullName",
            username: "$profileInfo.username",
            profileImageUrl: "$userInfo.profileImageUrl",
          },
          liked: { $gt: [{ $size: "$likedByUser" }, 0] },
        },
      },

      {
        $project: {
          userInfo: 0,
          profileInfo: 0,
          likedByUser: 0,
          __v: 0,
        },
      },
    ]);

    res.status(200).json(feedPosts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get feed posts", error: err.message });
  }
};

// Get User Posts
export const getPosts = async (req, res) => {
  const userId = req.user._id;

  try {
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
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
    res
      .status(500)
      .json({ message: "Error getting posts", error: err.message });
  }
};

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
    res.status(500).json({ message: "Error getting post", error: err.message });
  }
};

// Create a Post
export const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    const mediaFiles = req.files
      ? req.files.map((file) => file.path.replace(/\\/g, "/"))
      : [];

    // 1. Create and save new post
    const newPost = new Post({
      userId: req.user._id,
      description,
      content: mediaFiles,
    });
    await newPost.save();

    // 2. Increment user's post count
    await ProfileData.findOneAndUpdate(
      { userId: req.user._id },
      { $inc: { noOfPosts: 1 } },
      { new: true }
    );

    // 3. Fetch user info and profile data
    const user = await User.findById(req.user._id).select(
      "fullName profileImageUrl"
    );
    const profile = await ProfileData.findOne({ userId: req.user._id }).select(
      "username"
    );

    if (!user || !profile) {
      return res.status(404).json({ error: "User or profile data not found" });
    }

    // 4. Construct response
    const response = {
      id: newPost._id,
      user: {
        name: user.fullName,
        username: `@${profile.username}`,
        profileImage: user.profileImageUrl
          ? `${BASE_URL}/${user.profileImageUrl}`
          : null,
      },
      content: newPost.description,
      images: newPost.content.map((img) => ({ preview: `${BASE_URL}/${img}` })),
      likes: newPost.likes || 0,
      isliked: false,
      comments: newPost.comments || 0,
      timestamp: new Date(newPost.createdAt).toLocaleString(),
    };

    res.status(201).json(response);
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

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const postOwnerId = post.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const likerName = user.fullName;

    if (existingLike) {
      // Unlike the post
      await Like.deleteOne({ postId, userId });
      await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } });

      return res.json({ message: "Post unliked" });
    }

    // Like the post
    await new Like({ postId, userId }).save();
    await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });

    socket.emit("likePost", {
      postId,
      postOwnerId,
      likerId: userId,
      likerName: likerName,
      liked: true,
    });

    res.json({ message: "Post liked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};