import express from "express";
import User from "../models/User.js";

// Get Profile Info
export const getProfileInfo = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user profile data
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting user info", error: err.message });
  }
};