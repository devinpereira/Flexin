import mongoose from "mongoose";

const storeCouponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        type: {
            type: String,
            enum: ["percentage", "fixed_amount", "free_shipping", "buy_x_get_y"],
            required: true,
        },
        discount: {
            value: {
                type: Number,
                required: true,
            },
            maxAmount: {
                type: Number, // Maximum discount amount for percentage coupons
            },
        },
        conditions: {
            minimumAmount: {
                type: Number,
                default: 0,
            },
            maximumAmount: {
                type: Number,
            },
            applicableProducts: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "StoreProduct",
            }],
            applicableCategories: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "StoreCategory",
            }],
            excludedProducts: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "StoreProduct",
            }],
            excludedCategories: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "StoreCategory",
            }],
            firstTimeCustomers: {
                type: Boolean,
                default: false,
            },
            customerGroups: [{
                type: String,
            }],
        },
        validity: {
            startDate: {
                type: Date,
                required: true,
            },
            endDate: {
                type: Date,
                required: true,
            },
            timezone: {
                type: String,
                default: "UTC",
            },
        },
        usage: {
            totalLimit: {
                type: Number,
                default: null, // null means unlimited
            },
            perCustomerLimit: {
                type: Number,
                default: 1,
            },
            totalUsed: {
                type: Number,
                default: 0,
            },
        },
        status: {
            type: String,
            enum: ["draft", "active", "paused", "expired", "disabled"],
            default: "draft",
        },
        buyXGetY: {
            buyQuantity: Number,
            getQuantity: Number,
            getDiscount: Number, // percentage or fixed
        },
        marketing: {
            autoApply: {
                type: Boolean,
                default: false,
            },
            showOnStorefront: {
                type: Boolean,
                default: true,
            },
            emailCampaign: {
                type: Boolean,
                default: false,
            },
        },
        analytics: {
            redemptions: {
                type: Number,
                default: 0,
            },
            totalDiscount: {
                type: Number,
                default: 0,
            },
            averageOrderValue: {
                type: Number,
                default: 0,
            },
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

// Automatically update status based on dates
storeCouponSchema.pre('save', function (next) {
    const now = new Date();

    if (this.validity.endDate < now && this.status === 'active') {
        this.status = 'expired';
    } else if (this.validity.startDate <= now && this.validity.endDate > now && this.status === 'draft') {
        this.status = 'active';
    }

    // Check usage limits
    if (this.usage.totalLimit && this.usage.totalUsed >= this.usage.totalLimit) {
        this.status = 'disabled';
    }

    next();
});

// Indexes
// Note: code index is automatically created due to unique: true
storeCouponSchema.index({ status: 1 });
storeCouponSchema.index({ "validity.startDate": 1, "validity.endDate": 1 });
storeCouponSchema.index({ type: 1 });

export default mongoose.model("StoreCoupon", storeCouponSchema);
