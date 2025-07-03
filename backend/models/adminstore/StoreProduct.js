import mongoose from "mongoose";

const storeProductSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            unique: true,
        },
        sku: {
            type: String,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        shortDescription: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        originalPrice: {
            type: Number,
        },
        discountPercentage: {
            type: Number,
            default: 0,
        },
        costPrice: {
            type: Number,
            required: true,
        },
        profitMargin: {
            type: Number,
            default: 0,
        },
        quantity: {
            type: Number,
            required: true,
            default: 0,
        },
        lowStockThreshold: {
            type: Number,
            default: 10,
        },
        images: [{
            url: String,
            alt: String,
            isPrimary: {
                type: Boolean,
                default: false,
            },
        }],
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "StoreCategory",
        },
        subcategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StoreSubcategory",
        },
        brand: {
            type: String,
        },
        manufacturer: {
            type: String,
        },
        model: {
            type: String,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        status: {
            type: String,
            enum: ["draft", "active", "inactive", "out_of_stock"],
            default: "draft",
        },
        specifications: [{
            name: String,
            value: String,
        }],
        attributes: [{
            name: String,
            value: String,
        }],
        dimensions: {
            length: Number, // in cm
            width: Number,
            height: Number,
            weight: Number, // in grams
        },
        shipping: {
            freeShipping: {
                type: Boolean,
                default: false,
            },
            shippingCost: {
                type: Number,
                default: 0,
            },
            shippingClass: {
                type: String,
                enum: ["standard", "express", "overnight"],
                default: "standard",
            },
        },
        seo: {
            metaTitle: String,
            metaDescription: String,
            keywords: [String],
        },
        tags: [String],
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
        salesCount: {
            type: Number,
            default: 0,
        },
        viewCount: {
            type: Number,
            default: 0,
        },
        wishlistCount: {
            type: Number,
            default: 0,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

// Generate slug and SKU before saving
storeProductSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = this.productName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    if (!this.sku) {
        this.sku = 'SKU-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    // Calculate profit margin
    if (this.price && this.costPrice) {
        this.profitMargin = ((this.price - this.costPrice) / this.costPrice) * 100;
    }

    // Update status based on quantity
    if (this.quantity === 0) {
        this.status = 'out_of_stock';
    } else if (this.status === 'out_of_stock' && this.quantity > 0) {
        this.status = 'active';
    }

    next();
});

// Indexes for efficient queries
// Note: slug and sku indexes are automatically created due to unique: true
storeProductSchema.index({ categoryId: 1 });
storeProductSchema.index({ subcategoryId: 1 });
storeProductSchema.index({ isActive: 1 });
storeProductSchema.index({ isFeatured: 1 });
storeProductSchema.index({ status: 1 });
storeProductSchema.index({ price: 1 });
storeProductSchema.index({ averageRating: -1 });
storeProductSchema.index({ salesCount: -1 });
storeProductSchema.index({ quantity: 1 });

export default mongoose.model("StoreProduct", storeProductSchema);
