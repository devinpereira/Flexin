import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
      // Only require password if user is not using Google OAuth
      return !this.googleId;
    },
    },
    googleId: {
    type: String,
    default: null,
    },
    profileImageUrl: {
      type: String,
      default: null,
    },
    dob: {
      type: Date,
      required: function () {
        // Required if user is not using Google OAuth
        return !this.googleId;
      },
    },
    role: {
      type: String,
      default: "user",
    },
    verifyOtp: {
      type: String,
      default: null 

    },
    verifyOtpExpireAt: {
      type: Number,
      default: 0
    },
    isAccountVerified: {
      type: Boolean,
      default: false
    },
    resetOtp: {
      type: String,
      default: null
    },
    resetOtpExpireAt: {
      type: Number,
      default: 0
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);