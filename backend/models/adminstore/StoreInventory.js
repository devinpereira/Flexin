import mongoose from "mongoose";

const storeInventorySchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "StoreProduct",
            unique: true,
        },
        sku: {
            type: String,
            required: true,
        },
        stock: {
            currentStock: {
                type: Number,
                required: true,
                default: 0,
            },
            reservedStock: {
                type: Number,
                default: 0,
            },
            availableStock: {
                type: Number,
                default: 0,
            },
            damagedStock: {
                type: Number,
                default: 0,
            },
        },
        thresholds: {
            lowStockThreshold: {
                type: Number,
                default: 10,
            },
            reorderPoint: {
                type: Number,
                default: 5,
            },
            maxStock: {
                type: Number,
                default: 1000,
            },
        },
        location: {
            warehouse: {
                type: String,
                default: "Main Warehouse",
            },
            zone: String,
            aisle: String,
            shelf: String,
            bin: String,
        },
        supplier: {
            name: String,
            contact: String,
            email: String,
            leadTimeDays: {
                type: Number,
                default: 7,
            },
            minimumOrderQuantity: {
                type: Number,
                default: 1,
            },
        },
        pricing: {
            costPrice: {
                type: Number,
                required: true,
            },
            averageCost: {
                type: Number,
                default: 0,
            },
            lastCostPrice: {
                type: Number,
                default: 0,
            },
            totalValue: {
                type: Number,
                default: 0,
            },
        },
        tracking: {
            lastRestocked: Date,
            lastSold: Date,
            turnoverRate: {
                type: Number,
                default: 0,
            },
            daysInStock: {
                type: Number,
                default: 0,
            },
        },
        alerts: {
            lowStockAlert: {
                type: Boolean,
                default: false,
            },
            outOfStockAlert: {
                type: Boolean,
                default: false,
            },
            reorderAlert: {
                type: Boolean,
                default: false,
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastUpdatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

// Calculate derived fields before saving
storeInventorySchema.pre('save', function (next) {
    // Calculate available stock
    this.stock.availableStock = Math.max(0, this.stock.currentStock - this.stock.reservedStock);

    // Calculate total value
    this.pricing.totalValue = this.stock.currentStock * this.pricing.costPrice;

    // Set alerts
    this.alerts.lowStockAlert = this.stock.currentStock <= this.thresholds.lowStockThreshold;
    this.alerts.outOfStockAlert = this.stock.currentStock === 0;
    this.alerts.reorderAlert = this.stock.currentStock <= this.thresholds.reorderPoint;

    // Calculate days in stock
    if (this.tracking.lastRestocked) {
        this.tracking.daysInStock = Math.floor((Date.now() - this.tracking.lastRestocked) / (1000 * 60 * 60 * 24));
    }

    next();
});

// Indexes
// Note: productId index is automatically created due to unique: true
storeInventorySchema.index({ sku: 1 });
storeInventorySchema.index({ "stock.currentStock": 1 });
storeInventorySchema.index({ "alerts.lowStockAlert": 1 });
storeInventorySchema.index({ "alerts.outOfStockAlert": 1 });
storeInventorySchema.index({ "alerts.reorderAlert": 1 });

export default mongoose.model("StoreInventory", storeInventorySchema);
