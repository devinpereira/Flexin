import User from "../models/User.js";
import ProfileData from "../models/ProfileData.js";
import jwt from "jsonwebtoken";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../utils/emailTemplates.js";
import transporter from "../config/nodemailer.js";

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

// Generate and send verification OTP
export const sendVerifyOtp = async (req, res) => {
    try{
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (user.isAccountVerified) {
            return res.status(404).json({ message: "User already verified" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Verify your account",
            // text: `Your OTP for account verification is ${otp}. It is valid for 10 minutes.`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{email}}", user.email).replace("{{otp}}", otp),
        };
        await transporter.sendMail(mailOption);

        return res.status(200).json({ message: "Verification OTP sent to your email" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Verify Email
export const verifyEmail = async (req, res) => {
    const userId = req.user.id;
    const { otp } = req.body;

    if(!userId || !otp ) {
        return res.status(400).json({ message: "Please provide userId and OTP" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(400).json({ message: `Invalid OTP ${otp}` });
        }

        if (Date.now() > user.verfiyOtpExpireAt) {
            return res.status(400).json({ message: "OTP expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.status(200).json({ data: true, message: "Email verified successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Please provide an email" });
    }

    try {
        const user = await userModel.findOne({ email})
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password reset OTP",
            // text: `Your OTP for resetting your password is ${otp}. Use this to reset your password. It is valid for 10 minutes.`,
            html: PASSWORD_RESET_TEMPLATE.replace("{{email}}", user.email).replace("{{otp}}", otp),
        };
        await transporter.sendMail(mailOption);

        return res.status(200).json({ message: "Password reset OTP sent to your email" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Reset Password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Please provide userId, OTP and new password" });
    }

    try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.status(400).json({ message: `Invalid OTP` });
        }

        if (Date.now() > user.resetOtpExpireAt) {
            return res.status(400).json({ message: "OTP expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}