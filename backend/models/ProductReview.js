import mongoose from "mongoose";

const productReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index to ensure one review per user per product
productReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Index for efficient product review queries
productReviewSchema.index({ productId: 1, createdAt: -1 });

export default mongoose.model("ProductReview", productReviewSchema);