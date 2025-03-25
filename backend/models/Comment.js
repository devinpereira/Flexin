import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);