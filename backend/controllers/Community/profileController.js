import User from "../../models/User.js";
import ProfileData from "../../models/ProfileData.js";
import Post from "../../models/Post.js";
import CommunityReports from "../../models/CommunityReports.js";

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

    res.status(200).json({
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

export const updateProfile = async (req, res) => {
  const userId = req.user._id;
  const { username, bio } = req.body;
  const profileImageFile = req.file;

  try {
    // Check if profile exists
    const profile = await ProfileData.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    const user = await User.findById(userId);

    // Update fields
    if (username) {
      profile.username = username;
    }
    if (bio) {
      profile.bio = bio;
    }
    if (profileImageFile) {
      user.profileImageUrl = profileImageFile.path;
    }

    await profile.save();
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error updating profile",
      error: err.message,
    });
  }
}

export const updateProfileImage = async (req, res) => {
  const userId = req.user._id;
  const profileImageFile = req.file;

  try {
    // Check if profile exists
    const profile = await User.findById(userId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update profile image
    profile.profileImageUrl = profileImageFile.path;
    await profile.save();

    res.status(200).json({
      message: "Profile image updated successfully",
      profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error updating profile image",
      error: err.message,
    });
  }
}

export const banProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if profile exists
    const profile = await ProfileData.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update status to banned
    profile.status = "banned";
    await profile.save();

    res.status(200).json({
      message: "Profile banned successfully",
      profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error banning profile",
      error: err.message,
    });
  }
};

export const unbanProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if profile exists
    const profile = await ProfileData.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update status to active
    profile.status = "active";
    await profile.save();

    res.status(200).json({
      message: "Profile unbanned successfully",
      profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error unbanning profile",
      error: err.message,
    });
  }
};

export const flagProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if profile exists
    const profile = await ProfileData.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update status to flagged
    profile.status = "flagged";
    await profile.save();

    res.status(200).json({
      message: "Profile flagged successfully",
      profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error flagging profile",
      error: err.message,
    });
  }
};

export const unflagProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if profile exists
    const profile = await ProfileData.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update status to active
    profile.status = "active";
    await profile.save();

    res.status(200).json({
      message: "Profile unflagged successfully",
      profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error unflagging profile",
      error: err.message,
    });
  }
};

export const suspendProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if profile exists
    const profile = await ProfileData.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update status to suspended
    profile.status = "suspended";
    await profile.save();

    res.status(200).json({
      message: "Profile suspended successfully",
      profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error suspending profile",
      error: err.message,
    });
  }
};

export const unsuspendProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if profile exists
    const profile = await ProfileData.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update status to active
    profile.status = "active";
    await profile.save();

    res.status(200).json({
      message: "Profile unsuspended successfully",
      profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error unsuspending profile",
      error: err.message,
    });
  }
};

export const reportProfile = async (req, res) => {
  const Id = req.user.id;
  const { userId, reason } = req.body;

  try {
    // Check if profile exists
    const profile = await ProfileData.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Increment reports count
    profile.reports += 1;
    await profile.save();

    // Create a report entry
    await CommunityReports.create({
      userId: Id,
      profileId: userId,
      type: "PROFILE",
      reason: reason ? reason : "Inappropriate content",
    });

    res.status(200).json({
      message: "Profile reported successfully",
      profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error reporting profile",
      error: err.message,
    });
  }
};