import mongoose from "mongoose";

const storeCustomerAnalyticsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        customer: {
            email: String,
            firstName: String,
            lastName: String,
            joinDate: Date,
        },
        orderHistory: {
            totalOrders: {
                type: Number,
                default: 0,
            },
            totalSpent: {
                type: Number,
                default: 0,
            },
            averageOrderValue: {
                type: Number,
                default: 0,
            },
            firstOrderDate: Date,
            lastOrderDate: Date,
            daysBetweenOrders: {
                type: Number,
                default: 0,
            },
        },
        behavior: {
            segment: {
                type: String,
                enum: ["new", "regular", "vip", "at_risk", "inactive", "churned"],
                default: "new",
            },
            lifetimeValue: {
                type: Number,
                default: 0,
            },
            predictedLifetimeValue: {
                type: Number,
                default: 0,
            },
            churnProbability: {
                type: Number,
                default: 0,
            },
            loyaltyScore: {
                type: Number,
                default: 0,
            },
        },
        engagement: {
            lastActivity: Date,
            sessionCount: {
                type: Number,
                default: 0,
            },
            pageViews: {
                type: Number,
                default: 0,
            },
            timeOnSite: {
                type: Number,
                default: 0, // in minutes
            },
            emailOpens: {
                type: Number,
                default: 0,
            },
            emailClicks: {
                type: Number,
                default: 0,
            },
        },
        preferences: {
            favoriteCategories: [{
                categoryId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "StoreCategory",
                },
                categoryName: String,
                orderCount: Number,
                totalSpent: Number,
            }],
            favoriteBrands: [{
                brand: String,
                orderCount: Number,
                totalSpent: Number,
            }],
            preferredPaymentMethod: String,
            preferredShippingMethod: String,
            averageOrderFrequency: Number, // days
        },
        demographics: {
            country: String,
            state: String,
            city: String,
            ageGroup: String,
            gender: String,
        },
        marketing: {
            acquisitionSource: String,
            acquisitionMedium: String,
            acquisitionCampaign: String,
            referralCount: {
                type: Number,
                default: 0,
            },
            couponUsage: {
                totalCouponsUsed: {
                    type: Number,
                    default: 0,
                },
                totalSavings: {
                    type: Number,
                    default: 0,
                },
                favoriteCoupons: [String],
            },
        },
        support: {
            supportTickets: {
                type: Number,
                default: 0,
            },
            supportResolution: {
                averageDays: Number,
                satisfactionRating: Number,
            },
            returns: {
                totalReturns: {
                    type: Number,
                    default: 0,
                },
                returnRate: {
                    type: Number,
                    default: 0,
                },
                returnValue: {
                    type: Number,
                    default: 0,
                },
            },
        },
        scoring: {
            recencyScore: {
                type: Number,
                default: 0,
            },
            frequencyScore: {
                type: Number,
                default: 0,
            },
            monetaryScore: {
                type: Number,
                default: 0,
            },
            rfmScore: String, // RFM analysis result
        },
    },
    {
        timestamps: true,
    }
);

// Calculate derived metrics before saving
storeCustomerAnalyticsSchema.pre('save', function (next) {
    // Calculate average order value
    if (this.orderHistory.totalOrders > 0) {
        this.orderHistory.averageOrderValue = this.orderHistory.totalSpent / this.orderHistory.totalOrders;
    }

    // Calculate days between orders
    if (this.orderHistory.firstOrderDate && this.orderHistory.lastOrderDate && this.orderHistory.totalOrders > 1) {
        const daysDiff = (this.orderHistory.lastOrderDate - this.orderHistory.firstOrderDate) / (1000 * 60 * 60 * 24);
        this.preferences.averageOrderFrequency = daysDiff / (this.orderHistory.totalOrders - 1);
    }

    // Set lifetime value
    this.behavior.lifetimeValue = this.orderHistory.totalSpent;

    // Calculate return rate
    if (this.orderHistory.totalOrders > 0) {
        this.support.returns.returnRate = (this.support.returns.totalReturns / this.orderHistory.totalOrders) * 100;
    }

    next();
});

// Indexes
storeCustomerAnalyticsSchema.index({ userId: 1 }, { unique: true });
storeCustomerAnalyticsSchema.index({ "behavior.segment": 1 });
storeCustomerAnalyticsSchema.index({ "behavior.lifetimeValue": -1 });
storeCustomerAnalyticsSchema.index({ "orderHistory.lastOrderDate": -1 });

export default mongoose.model("StoreCustomerAnalytics", storeCustomerAnalyticsSchema);
