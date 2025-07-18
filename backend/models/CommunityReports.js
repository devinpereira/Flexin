import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    type: {
      type: String,
      required: true,
      enum: ["POST", "PROFILE"],
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProfileData",
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true }
);

// Custom validation logic
reportSchema.pre("validate", function (next) {
  if (this.type === "POST") {
    if (!this.postId) {
      return next(new Error("postId is required when type is POST"));
    }
    this.profileId = undefined;
    this.reason = undefined;
  } else if (this.type === "PROFILE") {
    if (!this.profileId || !this.reason) {
      return next(new Error("profileId and reason are required when type is PROFILE"));
    }
    this.postId = undefined;
  }
  next();
});

export default mongoose.model("CommunityReport", reportSchema);