import mongoose from "mongoose";

const storeCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        slug: {
            type: String,
            unique: true,
        },
        description: {
            type: String,
        },
        image: {
            url: String,
            alt: String,
        },
        icon: {
            type: String, // Icon class or URL
        },
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StoreCategory",
            default: null,
        },
        subcategories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "StoreSubcategory",
        }],
        sortOrder: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        seo: {
            metaTitle: String,
            metaDescription: String,
            keywords: [String],
        },
        productCount: {
            type: Number,
            default: 0,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

// Generate slug before saving
storeCategorySchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
    next();
});

// Indexes
// Note: slug index is automatically created due to unique: true
storeCategorySchema.index({ isActive: 1 });
storeCategorySchema.index({ isFeatured: 1 });
storeCategorySchema.index({ sortOrder: 1 });

export default mongoose.model("StoreCategory", storeCategorySchema);
