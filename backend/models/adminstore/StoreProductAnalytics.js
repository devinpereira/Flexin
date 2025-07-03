import mongoose from "mongoose";

const storeProductAnalyticsSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "StoreProduct",
        },
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
        },
        performance: {
            views: {
                type: Number,
                default: 0,
            },
            uniqueViews: {
                type: Number,
                default: 0,
            },
            clicks: {
                type: Number,
                default: 0,
            },
            addToCart: {
                type: Number,
                default: 0,
            },
            addToWishlist: {
                type: Number,
                default: 0,
            },
            purchases: {
                type: Number,
                default: 0,
            },
            conversionRate: {
                type: Number,
                default: 0,
            },
            cartAbandonmentRate: {
                type: Number,
                default: 0,
            },
        },
        sales: {
            quantitySold: {
                type: Number,
                default: 0,
            },
            revenue: {
                type: Number,
                default: 0,
            },
            profit: {
                type: Number,
                default: 0,
            },
            averageOrderValue: {
                type: Number,
                default: 0,
            },
            returnsCount: {
                type: Number,
                default: 0,
            },
            returnRate: {
                type: Number,
                default: 0,
            },
            refundsCount: {
                type: Number,
                default: 0,
            },
            refundAmount: {
                type: Number,
                default: 0,
            },
        },
        inventory: {
            stockMovement: {
                type: Number,
                default: 0,
            },
            stockTurnover: {
                type: Number,
                default: 0,
            },
            daysInStock: {
                type: Number,
                default: 0,
            },
            stockoutDays: {
                type: Number,
                default: 0,
            },
        },
        reviews: {
            newReviews: {
                type: Number,
                default: 0,
            },
            averageRating: {
                type: Number,
                default: 0,
            },
            totalReviews: {
                type: Number,
                default: 0,
            },
            ratingDistribution: {
                five: { type: Number, default: 0 },
                four: { type: Number, default: 0 },
                three: { type: Number, default: 0 },
                two: { type: Number, default: 0 },
                one: { type: Number, default: 0 },
            },
        },
        pricing: {
            averageSellingPrice: {
                type: Number,
                default: 0,
            },
            priceChanges: {
                type: Number,
                default: 0,
            },
            discountedSales: {
                type: Number,
                default: 0,
            },
            discountAmount: {
                type: Number,
                default: 0,
            },
        },
        marketing: {
            searchAppearances: {
                type: Number,
                default: 0,
            },
            searchClicks: {
                type: Number,
                default: 0,
            },
            categoryPageViews: {
                type: Number,
                default: 0,
            },
            promotionalViews: {
                type: Number,
                default: 0,
            },
        },
        competition: {
            rank: {
                overall: Number,
                category: Number,
            },
            priceComparison: {
                isLowest: Boolean,
                isHighest: Boolean,
                competitorCount: Number,
            },
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
storeProductAnalyticsSchema.index({ productId: 1, "period.type": 1, "period.date": 1 }, { unique: true });
storeProductAnalyticsSchema.index({ productId: 1 });
storeProductAnalyticsSchema.index({ "period.type": 1, "period.date": 1 });

export default mongoose.model("StoreProductAnalytics", storeProductAnalyticsSchema);
