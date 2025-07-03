import mongoose from "mongoose";

const storeCouponUsageSchema = new mongoose.Schema(
    {
        couponId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "StoreCoupon",
        },
        couponCode: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "StoreOrder",
        },
        usage: {
            discountAmount: {
                type: Number,
                required: true,
            },
            orderSubtotal: {
                type: Number,
                required: true,
            },
            orderTotal: {
                type: Number,
                required: true,
            },
            discountPercentage: {
                type: Number,
            },
        },
        customerInfo: {
            email: String,
            isFirstTime: Boolean,
            totalPreviousOrders: Number,
        },
        metadata: {
            userAgent: String,
            ipAddress: String,
            source: {
                type: String,
                enum: ["web", "mobile", "api", "admin"],
                default: "web",
            },
        },
        status: {
            type: String,
            enum: ["applied", "cancelled", "refunded"],
            default: "applied",
        },
        usedAt: {
            type: Date,
            default: Date.now,
        },
        cancelledAt: Date,
        refundedAt: Date,
    },
    {
        timestamps: true,
    }
);

// Calculate discount percentage
storeCouponUsageSchema.pre('save', function (next) {
    if (this.usage.orderSubtotal > 0) {
        this.usage.discountPercentage = (this.usage.discountAmount / this.usage.orderSubtotal) * 100;
    }
    next();
});

// Indexes
storeCouponUsageSchema.index({ couponId: 1 });
storeCouponUsageSchema.index({ userId: 1 });
storeCouponUsageSchema.index({ orderId: 1 });
storeCouponUsageSchema.index({ couponCode: 1 });
storeCouponUsageSchema.index({ usedAt: -1 });
storeCouponUsageSchema.index({ status: 1 });

export default mongoose.model("StoreCouponUsage", storeCouponUsageSchema);
