import User from "../models/User.js";
import ProfileData from "../models/ProfileData.js";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Register User
export const registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl, dob, role } = req.body;
    
    // validation: Check for missing fields
    if (!fullName || !email || !password || !dob) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Create new user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
            dob,
            role,
        });

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    }
    catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
};

// Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try{
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePasswords(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check for existing profile data
        const profile = await ProfileData.findOne({ userId: user._id });

        res.status(200).json({
            id: user._id,
            user: {
                ...user.toObject(),
                username: profile?.username || null, // add username if exists
            },
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ message: "Error logging in user", error: err.message });
    }
};

// Get User Info
export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await ProfileData.findOne({ userId: req.user.id }).select("username bio noOfPosts followers following");

    res.status(200).json({
      ...user.toObject(),
      ...(profile && {
        username: profile.username,
      }),
    });
  } catch (err) {
    res.status(500).json({ message: "Error getting user info", error: err.message });
  }
};