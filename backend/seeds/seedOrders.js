import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import StoreOrder from "../models/adminstore/StoreOrder.js";
import StoreProduct from "../models/adminstore/StoreProduct.js";
import StoreCategory from "../models/adminstore/StoreCategory.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectToDB = async () => {
    await mongoose
        .connect(process.env.API_KEY)
        .then(() => console.log("MongoDB Connected for seeding..."))
        .catch((err) => console.log(err));
};

// Sample data
const sampleUsers = [
    {
        fullName: "John Smith",
        email: "john.smith@example.com",
        password: "password123",
        dob: new Date("1990-05-15"),
        role: "user"
    },
    {
        fullName: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        password: "password123",
        dob: new Date("1988-03-22"),
        role: "user"
    },
    {
        fullName: "Mike Wilson",
        email: "mike.wilson@example.com",
        password: "password123",
        dob: new Date("1992-11-08"),
        role: "user"
    },
    {
        fullName: "Emma Davis",
        email: "emma.davis@example.com",
        password: "password123",
        dob: new Date("1995-07-14"),
        role: "user"
    },
    {
        fullName: "Admin User",
        email: "admin@pulseplus.com",
        password: "admin123",
        dob: new Date("1985-01-01"),
        role: "admin"
    }
];

const sampleCategories = [
    {
        name: "Fitness Equipment",
        slug: "fitness-equipment",
        description: "Professional fitness equipment for home and gym use",
        isActive: true,
        isFeatured: true
    },
    {
        name: "Supplements",
        slug: "supplements",
        description: "Nutritional supplements for fitness and health",
        isActive: true,
        isFeatured: true
    },
    {
        name: "Workout Apparel",
        slug: "workout-apparel",
        description: "High-quality workout clothing and accessories",
        isActive: true,
        isFeatured: false
    },
    {
        name: "Health Accessories",
        slug: "health-accessories",
        description: "Various health and wellness accessories",
        isActive: true,
        isFeatured: false
    }
];

const sampleProducts = [
    {
        productName: "Premium Protein Powder - Vanilla",
        slug: "premium-protein-powder-vanilla",
        sku: "PPP-VAN-001",
        description: "High-quality whey protein powder with vanilla flavor. Perfect for post-workout recovery and muscle building.",
        shortDescription: "Premium whey protein powder - Vanilla flavor",
        price: 49.99,
        originalPrice: 59.99,
        discountPercentage: 17,
        costPrice: 25.00,
        quantity: 150,
        lowStockThreshold: 20,
    isActive: true,
    isFeatured: true,
    images: [{
      url: "https://via.placeholder.com/400x400/87CEEB/000000?text=Protein+Powder",
      alt: "Premium Protein Powder Vanilla",
      isPrimary: true
    }],
    tags: ["protein", "supplement", "vanilla", "whey"]
    },
    {
        productName: "Adjustable Dumbbells Set",
        slug: "adjustable-dumbbells-set",
        sku: "ADS-001",
        description: "Professional adjustable dumbbells set with quick-change plates. Perfect for home workouts.",
        shortDescription: "Adjustable dumbbells with quick-change system",
        price: 299.99,
        originalPrice: 349.99,
        discountPercentage: 14,
        costPrice: 150.00,
        quantity: 25,
        lowStockThreshold: 5,
    isActive: true,
    isFeatured: true,
    images: [{
      url: "https://via.placeholder.com/400x400/FF6347/FFFFFF?text=Dumbbells",
      alt: "Adjustable Dumbbells Set",
      isPrimary: true
    }],
    tags: ["dumbbells", "weights", "adjustable", "fitness"]
    },
    {
        productName: "Yoga Mat - Premium Non-Slip",
        slug: "yoga-mat-premium-non-slip",
        sku: "YM-PNS-001",
        description: "Premium non-slip yoga mat with extra thickness for comfort and stability during workouts.",
        shortDescription: "Premium non-slip yoga mat",
        price: 39.99,
        originalPrice: 49.99,
        discountPercentage: 20,
        costPrice: 15.00,
        quantity: 75,
        lowStockThreshold: 15,
    isActive: true,
    isFeatured: false,
    images: [{
      url: "https://via.placeholder.com/400x400/9370DB/FFFFFF?text=Yoga+Mat",
      alt: "Premium Yoga Mat",
      isPrimary: true
    }],
    tags: ["yoga", "mat", "non-slip", "exercise"]
    },
    {
        productName: "Fitness Tracker Watch",
        slug: "fitness-tracker-watch",
        sku: "FTW-001",
        description: "Advanced fitness tracker with heart rate monitoring, GPS, and smartphone connectivity.",
        shortDescription: "Advanced fitness tracker with GPS",
        price: 199.99,
        originalPrice: 249.99,
        discountPercentage: 20,
        costPrice: 80.00,
        quantity: 40,
        lowStockThreshold: 10,
    isActive: true,
    isFeatured: true,
    images: [{
      url: "https://via.placeholder.com/400x400/32CD32/000000?text=Fitness+Watch",
      alt: "Fitness Tracker Watch",
      isPrimary: true
    }],
    tags: ["fitness", "tracker", "watch", "gps", "heart-rate"]
    },
    {
        productName: "Pre-Workout Energy Boost",
        slug: "pre-workout-energy-boost",
        sku: "PWEB-001",
        description: "Powerful pre-workout supplement for enhanced energy, focus, and performance.",
        shortDescription: "Pre-workout supplement for energy boost",
        price: 34.99,
        originalPrice: 39.99,
        discountPercentage: 13,
        costPrice: 18.00,
        quantity: 100,
        lowStockThreshold: 25,
    isActive: true,
    isFeatured: false,
    images: [{
      url: "https://via.placeholder.com/400x400/FF4500/FFFFFF?text=Pre+Workout",
      alt: "Pre-Workout Energy Boost",
      isPrimary: true
    }],
    tags: ["pre-workout", "energy", "supplement", "performance"]
    },
    {
        productName: "Resistance Bands Set",
        slug: "resistance-bands-set",
        sku: "RBS-001",
        description: "Complete resistance bands set with multiple resistance levels and accessories.",
        shortDescription: "Complete resistance bands set",
        price: 24.99,
        originalPrice: 29.99,
        discountPercentage: 17,
        costPrice: 10.00,
        quantity: 60,
        lowStockThreshold: 12,
    isActive: true,
    isFeatured: false,
    images: [{
      url: "https://via.placeholder.com/400x400/FFD700/000000?text=Resistance+Bands",
      alt: "Resistance Bands Set",
      isPrimary: true
    }],
    tags: ["resistance", "bands", "exercise", "portable"]
    }
];

// Generate sample orders
const generateSampleOrders = (users, products) => {
    const orderStatuses = ["pending", "confirmed", "processing", "picked", "shipped", "delivered", "canceled"];
    const paymentStatuses = ["pending", "paid", "failed", "refunded"];
    const paymentMethods = ["card", "paypal", "bank_transfer", "cash_on_delivery"];
    const shippingMethods = ["standard", "express", "overnight"];

    const orders = [];

    // Generate 15 sample orders
    for (let i = 0; i < 15; i++) {
        const user = users[Math.floor(Math.random() * (users.length - 1))]; // Exclude admin
        const orderStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
        const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        const shippingMethod = shippingMethods[Math.floor(Math.random() * shippingMethods.length)];

        // Random number of items (1-4)
        const numItems = Math.floor(Math.random() * 4) + 1;
        const orderItems = [];
        let subtotal = 0;

        for (let j = 0; j < numItems; j++) {
            const product = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            const itemTotal = product.price * quantity;
            subtotal += itemTotal;

            orderItems.push({
                productId: product._id,
                productName: product.productName,
                sku: product.sku,
                price: product.price,
                quantity: quantity,
                totalPrice: itemTotal,
                productImage: product.images[0]?.url || ""
            });
        }

        const shippingCost = shippingMethod === "express" ? 15.99 : shippingMethod === "overnight" ? 25.99 : 7.99;
        const taxAmount = subtotal * 0.08; // 8% tax
        const discountAmount = Math.random() > 0.7 ? subtotal * 0.1 : 0; // 10% discount for 30% of orders
        const totalPrice = subtotal + shippingCost + taxAmount - discountAmount;

        // Create order date within last 30 days
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));

    const order = {
      orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userId: user._id,
            customerInfo: {
                name: user.fullName,
                email: user.email,
                phone: `+1${Math.floor(Math.random() * 900000000) + 100000000}`
            },
            items: orderItems,
            shippingAddress: {
                fullName: user.fullName,
                addressLine1: `${Math.floor(Math.random() * 9999) + 1} Main Street`,
                addressLine2: Math.random() > 0.5 ? `Apt ${Math.floor(Math.random() * 100) + 1}` : "",
                city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][Math.floor(Math.random() * 5)],
                state: ["NY", "CA", "IL", "TX", "AZ"][Math.floor(Math.random() * 5)],
                postalCode: `${Math.floor(Math.random() * 90000) + 10000}`,
                country: "USA",
                phoneNumber: `+1${Math.floor(Math.random() * 900000000) + 100000000}`
            },
            billingAddress: {
                fullName: user.fullName,
                addressLine1: `${Math.floor(Math.random() * 9999) + 1} Main Street`,
                city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][Math.floor(Math.random() * 5)],
                state: ["NY", "CA", "IL", "TX", "AZ"][Math.floor(Math.random() * 5)],
                postalCode: `${Math.floor(Math.random() * 90000) + 10000}`,
                country: "USA",
                phoneNumber: `+1${Math.floor(Math.random() * 900000000) + 100000000}`
            },
            pricing: {
                subtotal: Math.round(subtotal * 100) / 100,
                shippingCost: shippingCost,
                taxAmount: Math.round(taxAmount * 100) / 100,
                discountAmount: Math.round(discountAmount * 100) / 100,
                totalPrice: Math.round(totalPrice * 100) / 100
            },
            orderStatus: orderStatus,
            paymentStatus: paymentStatus,
            paymentMethod: paymentMethod,
            paymentInfo: paymentStatus === "paid" ? {
                transactionId: `txn_${Math.random().toString(36).substr(2, 12)}`,
                paymentGateway: paymentMethod === "card" ? "stripe" : paymentMethod,
                paymentDate: orderDate
            } : {},
            shipping: {
                method: shippingMethod,
                provider: shippingMethod === "standard" ? "USPS" : "FedEx",
                trackingNumber: orderStatus === "shipped" || orderStatus === "delivered" ?
                    `TRK${Math.random().toString(36).substr(2, 10).toUpperCase()}` : null,
                estimatedDelivery: new Date(orderDate.getTime() + (shippingMethod === "overnight" ? 1 : shippingMethod === "express" ? 2 : 5) * 24 * 60 * 60 * 1000),
                shippedAt: orderStatus === "shipped" || orderStatus === "delivered" ?
                    new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000) : null,
                deliveredAt: orderStatus === "delivered" ?
                    new Date(orderDate.getTime() + 4 * 24 * 60 * 60 * 1000) : null
            },
            notes: {
                customerNotes: Math.random() > 0.7 ? "Please handle with care" : "",
                adminNotes: Math.random() > 0.8 ? "Priority customer" : "",
                internalNotes: ""
            },
            createdAt: orderDate,
            updatedAt: orderDate
        };

        if (discountAmount > 0) {
            order.coupon = {
                code: "SAVE10",
                discountAmount: Math.round(discountAmount * 100) / 100,
                discountType: "percentage"
            };
        }

        orders.push(order);
    }

    return orders;
};

const seedDatabase = async () => {
    try {
        // Connect to database
        await connectToDB();

        console.log("🧹 Cleaning existing data...");

        // Clean existing data
        await User.deleteMany({ email: { $in: sampleUsers.map(u => u.email) } });
        await StoreOrder.deleteMany({});
        await StoreProduct.deleteMany({});
        await StoreCategory.deleteMany({});

        console.log("👥 Creating sample users...");

        // Hash passwords and create users
        const hashedUsers = await Promise.all(
            sampleUsers.map(async (user) => {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(user.password, salt);
                return {
                    ...user,
                    password: hashedPassword
                };
            })
        );

        const createdUsers = await User.insertMany(hashedUsers);
        console.log(`✅ Created ${createdUsers.length} users`);

        console.log("🏷️ Creating sample categories...");
        const createdCategories = await StoreCategory.insertMany(sampleCategories);
        console.log(`✅ Created ${createdCategories.length} categories`);

        console.log("📦 Creating sample products...");

    // Add category references to products
    const productsWithCategories = sampleProducts.map((product, index) => ({
      ...product,
      categoryId: createdCategories[index % createdCategories.length]._id
    }));

        const createdProducts = await StoreProduct.insertMany(productsWithCategories);
        console.log(`✅ Created ${createdProducts.length} products`);

        console.log("🛒 Creating sample orders...");

        // Generate and create orders
        const sampleOrders = generateSampleOrders(createdUsers, createdProducts);
        const createdOrders = await StoreOrder.insertMany(sampleOrders);
        console.log(`✅ Created ${createdOrders.length} orders`);

        console.log("\n🎉 Database seeding completed successfully!");
        console.log(`
📊 Summary:
- Users: ${createdUsers.length}
- Categories: ${createdCategories.length}
- Products: ${createdProducts.length}
- Orders: ${createdOrders.length}

🔑 Sample admin login:
Email: admin@pulseplus.com
Password: admin123

🔑 Sample user login:
Email: john.smith@example.com
Password: password123
    `);

        // Close database connection
        await mongoose.connection.close();
        console.log("🔌 Database connection closed");

    } catch (error) {
        console.error("❌ Error seeding database:", error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

// Run the seeding script
if (process.argv[2] === '--run') {
    seedDatabase();
} else {
    console.log("To run the seeding script, use: node seedOrders.js --run");
}

export default seedDatabase;
