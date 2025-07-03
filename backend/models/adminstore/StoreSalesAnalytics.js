import mongoose from "mongoose";

const storeSalesAnalyticsSchema = new mongoose.Schema(
    {
        period: {
            type: {
                type: String,
                enum: ["daily", "weekly", "monthly", "quarterly", "yearly"],
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
            year: Number,
            month: Number,
            week: Number,
            day: Number,
        },
        sales: {
            totalOrders: {
                type: Number,
                default: 0,
            },
            totalRevenue: {
                type: Number,
                default: 0,
            },
            totalProfit: {
                type: Number,
                default: 0,
            },
            averageOrderValue: {
                type: Number,
                default: 0,
            },
            totalItemsSold: {
                type: Number,
                default: 0,
            },
        },
        orders: {
            completed: {
                type: Number,
                default: 0,
            },
            pending: {
                type: Number,
                default: 0,
            },
            cancelled: {
                type: Number,
                default: 0,
            },
            refunded: {
                type: Number,
                default: 0,
            },
        },
        customers: {
            total: {
                type: Number,
                default: 0,
            },
            new: {
                type: Number,
                default: 0,
            },
            returning: {
                type: Number,
                default: 0,
            },
            uniqueCustomers: {
                type: Number,
                default: 0,
            },
        },
        products: {
            topSelling: [{
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "StoreProduct",
                },
                productName: String,
                quantitySold: Number,
                revenue: Number,
                profit: Number,
            }],
            totalProductsSold: {
                type: Number,
                default: 0,
            },
        },
        categories: {
            salesByCategory: [{
                categoryId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "StoreCategory",
                },
                categoryName: String,
                revenue: Number,
                orderCount: Number,
                itemsSold: Number,
            }],
        },
        geography: {
            salesByCountry: [{
                country: String,
                revenue: Number,
                orderCount: Number,
            }],
            salesByState: [{
                state: String,
                country: String,
                revenue: Number,
                orderCount: Number,
            }],
        },
        payment: {
            methodBreakdown: [{
                method: String,
                count: Number,
                revenue: Number,
            }],
        },
        shipping: {
            methodBreakdown: [{
                method: String,
                count: Number,
                revenue: Number,
            }],
            averageShippingCost: {
                type: Number,
                default: 0,
            },
        },
        coupons: {
            totalDiscount: {
                type: Number,
                default: 0,
            },
            couponsUsed: {
                type: Number,
                default: 0,
            },
            topCoupons: [{
                couponCode: String,
                usageCount: Number,
                totalDiscount: Number,
            }],
        },
        performance: {
            conversionRate: {
                type: Number,
                default: 0,
            },
            cartAbandonmentRate: {
                type: Number,
                default: 0,
            },
            refundRate: {
                type: Number,
                default: 0,
            },
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
storeSalesAnalyticsSchema.index({ "period.type": 1, "period.date": 1 }, { unique: true });
storeSalesAnalyticsSchema.index({ "period.type": 1, "period.year": 1, "period.month": 1 });

export default mongoose.model("StoreSalesAnalytics", storeSalesAnalyticsSchema);
