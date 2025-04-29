import express from "express";
import User from "../models/User.js";
import ProfileData from "../models/ProfileData.js";

export const registerProfile = async (req, res) => {
  const userId = req.user._id;
  const { username, bio = "", coverImageUrl = null } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Please choose a username" });
  }

  try {
    // Check if username already exists
    const existingUsername = await ProfileData.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already in use" });
    }

    // Prevent duplicate profile creation
    const existingProfile = await ProfileData.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists for this user" });
    }

    // Create the profile
    const profile = await ProfileData.create({
      userId,
      username,
      bio,
      coverImageUrl,
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile,
    });
  } catch (err) {
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
