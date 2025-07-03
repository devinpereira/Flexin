import mongoose from "mongoose";

const storeMediaSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
            required: true,
        },
        originalName: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        thumbnailUrl: {
            type: String,
        },
        type: {
            type: String,
            enum: ["product", "category", "review", "banner", "logo", "icon", "other"],
            required: true,
        },
        mimeType: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true, // in bytes
        },
        dimensions: {
            width: Number,
            height: Number,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        associatedWith: {
            entityType: {
                type: String,
                enum: ["StoreProduct", "StoreCategory", "StoreProductReview", "StoreCoupon", "StoreOrder"],
            },
            entityId: {
                type: mongoose.Schema.Types.ObjectId,
            },
        },
        storage: {
            provider: {
                type: String,
                enum: ["cloudinary", "aws", "local"],
                default: "cloudinary",
            },
            providerId: String, // Cloudinary public_id, AWS key, etc.
            bucket: String, // For AWS S3
            region: String, // For AWS S3
        },
        metadata: {
            alt: String,
            caption: String,
            title: String,
            description: String,
            tags: [String],
        },
        optimization: {
            isOptimized: {
                type: Boolean,
                default: false,
            },
            compressionRatio: Number,
            formats: [{
                format: String, // webp, jpg, png
                url: String,
                size: Number,
            }],
        },
        usage: {
            isActive: {
                type: Boolean,
                default: true,
            },
            isPublic: {
                type: Boolean,
                default: true,
            },
            viewCount: {
                type: Number,
                default: 0,
            },
            downloadCount: {
                type: Number,
                default: 0,
            },
        },
        seo: {
            altText: String,
            title: String,
            description: String,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
storeMediaSchema.index({ type: 1 });
storeMediaSchema.index({ uploadedBy: 1 });
storeMediaSchema.index({ "associatedWith.entityType": 1, "associatedWith.entityId": 1 });
storeMediaSchema.index({ "storage.provider": 1, "storage.providerId": 1 });
storeMediaSchema.index({ mimeType: 1 });
storeMediaSchema.index({ "usage.isActive": 1 });

export default mongoose.model("StoreMedia", storeMediaSchema);
