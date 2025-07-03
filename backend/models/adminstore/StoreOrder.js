import mongoose from "mongoose";

const storeOrderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            unique: true,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        customerInfo: {
            name: String,
            email: String,
            phone: String,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: "StoreProduct",
                },
                productName: String,
                sku: String,
                price: {
                    type: Number,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                totalPrice: {
                    type: Number,
                    required: true,
                },
                productImage: String,
            },
        ],
        shippingAddress: {
            fullName: String,
            addressLine1: String,
            addressLine2: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
            phoneNumber: String,
        },
        billingAddress: {
            fullName: String,
            addressLine1: String,
            addressLine2: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
            phoneNumber: String,
        },
        pricing: {
            subtotal: {
                type: Number,
                required: true,
            },
            shippingCost: {
                type: Number,
                default: 0,
            },
            taxAmount: {
                type: Number,
                default: 0,
            },
            discountAmount: {
                type: Number,
                default: 0,
            },
            totalPrice: {
                type: Number,
                required: true,
            },
        },
        coupon: {
            code: String,
            discountAmount: Number,
            discountType: String,
        },
        orderStatus: {
            type: String,
            enum: ["pending", "confirmed", "processing", "picked", "shipped", "delivered", "canceled", "refunded", "returned"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded", "partially_refunded"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            enum: ["card", "paypal", "bank_transfer", "cash_on_delivery", "wallet"],
        },
        paymentInfo: {
            transactionId: String,
            paymentGateway: String,
            paymentDate: Date,
        },
        shipping: {
            method: {
                type: String,
                enum: ["standard", "express", "overnight", "pickup"],
                default: "standard",
            },
            provider: String,
            trackingNumber: String,
            trackingUrl: String,
            shippedAt: Date,
            estimatedDelivery: Date,
            deliveredAt: Date,
        },
        fulfillment: {
            pickedAt: Date,
            packedAt: Date,
            shippedAt: Date,
            deliveredAt: Date,
            pickedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            packedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        },
        refund: {
            amount: Number,
            reason: String,
            refundedAt: Date,
            refundedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        },
        notes: {
            customerNotes: String,
            adminNotes: String,
            internalNotes: String,
        },
        statusHistory: [{
            status: String,
            timestamp: {
                type: Date,
                default: Date.now,
            },
            updatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            notes: String,
        }],
    },
    {
        timestamps: true,
    }
);

// Generate order number before saving
storeOrderSchema.pre('save', function (next) {
    if (!this.orderNumber) {
        this.orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    next();
});

// Add status to history when status changes
storeOrderSchema.pre('save', function (next) {
    if (this.isModified('orderStatus')) {
        this.statusHistory.push({
            status: this.orderStatus,
            timestamp: new Date(),
        });
    }
    next();
});

// Indexes
// Note: orderNumber index is automatically created due to unique: true
storeOrderSchema.index({ userId: 1, createdAt: -1 });
storeOrderSchema.index({ orderStatus: 1 });
storeOrderSchema.index({ paymentStatus: 1 });
storeOrderSchema.index({ createdAt: -1 });
storeOrderSchema.index({ "shipping.trackingNumber": 1 });

export default mongoose.model("StoreOrder", storeOrderSchema);
