import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: [String],
    },
    description: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'flagged', 'removed'],
      default: 'active',
    },
    reports: {
      type: Number,
      default: 0,
    },
  },
  { 
    timestamps: true,
  }
);

export default mongoose.model("Post", postSchema);