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
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: null,
    },
    dob: {
      type: Date,
      required: true,
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
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);