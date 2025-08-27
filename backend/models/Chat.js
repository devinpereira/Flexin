import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create a compound unique index for trainerId and userId combination
chatSchema.index({ trainerId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Chat", chatSchema);