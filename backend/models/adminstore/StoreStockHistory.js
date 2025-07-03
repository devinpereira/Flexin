import mongoose from "mongoose";

const storeStockHistorySchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "StoreProduct",
        },
        sku: {
            type: String,
            required: true,
        },
        transaction: {
            type: {
                type: String,
                enum: ["in", "out", "adjustment", "reserved", "unreserved", "damaged", "returned"],
                required: true,
            },
            reason: {
                type: String,
                enum: [
                    "purchase", "sale", "return", "damage", "theft", "loss",
                    "adjustment", "reservation", "unreservation", "cancelled_order",
                    "supplier_return", "customer_return", "transfer_in", "transfer_out"
                ],
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
        stock: {
            previousStock: {
                type: Number,
                required: true,
            },
            newStock: {
                type: Number,
                required: true,
            },
            difference: {
                type: Number,
                required: true,
            },
        },
        reference: {
            type: String, // Order ID, Purchase ID, etc.
        },
        relatedDocument: {
            documentType: {
                type: String,
                enum: ["order", "purchase", "adjustment", "transfer"],
            },
            documentId: {
                type: mongoose.Schema.Types.ObjectId,
            },
        },
        cost: {
            unitCost: Number,
            totalCost: Number,
        },
        location: {
            from: {
                warehouse: String,
                zone: String,
                shelf: String,
            },
            to: {
                warehouse: String,
                zone: String,
                shelf: String,
            },
        },
        notes: {
            type: String,
        },
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

// Calculate difference before saving
storeStockHistorySchema.pre('save', function (next) {
    this.stock.difference = this.stock.newStock - this.stock.previousStock;

    if (this.cost.unitCost) {
        this.cost.totalCost = Math.abs(this.transaction.quantity) * this.cost.unitCost;
    }

    next();
});

// Indexes
storeStockHistorySchema.index({ productId: 1, createdAt: -1 });
storeStockHistorySchema.index({ sku: 1 });
storeStockHistorySchema.index({ "transaction.type": 1 });
storeStockHistorySchema.index({ "transaction.reason": 1 });
storeStockHistorySchema.index({ reference: 1 });
storeStockHistorySchema.index({ createdAt: -1 });

export default mongoose.model("StoreStockHistory", storeStockHistorySchema);
