import mongoose from "mongoose";

const storeProductReviewSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "StoreProduct",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StoreOrder",
        },
        review: {
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
            },
            title: {
                type: String,
                required: true,
                maxlength: 100,
            },
            comment: {
                type: String,
                required: true,
                minlength: 10,
                maxlength: 2000,
            },
            pros: [String],
            cons: [String],
        },
        customer: {
            name: String,
            email: String,
            isVerifiedPurchase: {
                type: Boolean,
                default: false,
            },
            purchaseDate: Date,
        },
        media: {
            images: [{
                url: String,
                caption: String,
            }],
            videos: [{
                url: String,
                caption: String,
            }],
        },
        moderation: {
            status: {
                type: String,
                enum: ["pending", "approved", "rejected", "spam"],
                default: "pending",
            },
            moderatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            moderatedAt: Date,
            moderatorNotes: String,
            autoModerated: {
                type: Boolean,
                default: false,
            },
            spamScore: {
                type: Number,
                default: 0,
            },
        },
        engagement: {
            helpfulVotes: {
                type: Number,
                default: 0,
            },
            notHelpfulVotes: {
                type: Number,
                default: 0,
            },
            reportCount: {
                type: Number,
                default: 0,
            },
            replies: [{
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                message: String,
                isStoreOwner: {
                    type: Boolean,
                    default: false,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            }],
        },
        metadata: {
            source: {
                type: String,
                enum: ["web", "mobile", "email", "import"],
                default: "web",
            },
            userAgent: String,
            ipAddress: String,
            language: String,
        },
        visibility: {
            isPublic: {
                type: Boolean,
                default: true,
            },
            isFeatured: {
                type: Boolean,
                default: false,
            },
            showOnStorefront: {
                type: Boolean,
                default: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

// Ensure one review per user per product
storeProductReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Other indexes
storeProductReviewSchema.index({ productId: 1, "moderation.status": 1, createdAt: -1 });
storeProductReviewSchema.index({ "review.rating": 1 });
storeProductReviewSchema.index({ "customer.isVerifiedPurchase": 1 });
storeProductReviewSchema.index({ "moderation.status": 1 });

export default mongoose.model("StoreProductReview", storeProductReviewSchema);
