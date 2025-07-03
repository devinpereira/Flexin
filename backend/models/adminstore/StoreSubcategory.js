import mongoose from "mongoose";

const storeSubcategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            unique: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "StoreCategory",
        },
        description: {
            type: String,
        },
        image: {
            url: String,
            alt: String,
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
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
storeSubcategorySchema.pre('save', function (next) {
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
storeSubcategorySchema.index({ categoryId: 1 });
// Note: slug index is automatically created due to unique: true
storeSubcategorySchema.index({ isActive: 1 });
storeSubcategorySchema.index({ sortOrder: 1 });

export default mongoose.model("StoreSubcategory", storeSubcategorySchema);
