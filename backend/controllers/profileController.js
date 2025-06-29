import express from "express";
import User from "../models/User.js";
import ProfileData from "../models/ProfileData.js";
import Post from "../models/Post.js";

export const registerProfile = async (req, res) => {
  const userId = req.user._id;
  const { username, bio = "" } = req.body;
  const profileImageFile = req.file;

  if (!username) {
    return res.status(400).json({ message: "Please choose a username" });
  }

  try {
    // Prevent duplicate profile creation
    const existingProfile = await ProfileData.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists for this user" });
    }

    // Check if username already exists
    const existingUsername = await ProfileData.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already in use" });
    }

    const profileImageUrl = profileImageFile.path || "";

    // Create the profile
    const profile = await ProfileData.create({
      userId,
      username,
      bio,
    });

    await User.findByIdAndUpdate(userId, { profileImageUrl });

    res.status(201).json({
      message: "Profile created successfully",
      profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error registering profile",
      error: err.message,
    });
  }
};

// Get Profile Info
export const getProfileInfo = async (req, res) => {
  const userId = req.user._id;

  try {
    // Fetch base user info
    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch profile info
    const profile = await ProfileData.findOne({ userId }).select("-__v -userId");
    if (!profile) {
      return res.status(404).json({ message: "Profile data not found" });
    }

    // Merge profile fields into user object
    const mergedUser = {
      ...user.toObject(),
      ...profile.toObject(),
    };

    res.status(200).json({ user: mergedUser });
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving profile info",
      error: err.message,
    });
  }
};

// Get Public Profile Info (for viewing other users)
export const getPublicProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    // Fetch user base info
    const user = await User.findById(userId).select("fullName profileImageUrl");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch profile info
    const profile = await ProfileData.findOne({ userId }).select("-_id username bio noOfPosts followers following");
    if (!profile) {
      return res.status(404).json({ message: "Profile data not found" });
    }

    // Fetch posts
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });

    // Merge and return
    res.status(200).json({
      user: {
        id: userId,
        name: user.fullName,
        username: profile.username,
        profileImageUrl: user.profileImageUrl,
        bio: profile.bio,
        noOfPosts: profile.noOfPosts,
        followers: profile.followers,
        following: profile.following,
      },
      posts,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving public profile",
      error: err.message,
    });
  }
};
