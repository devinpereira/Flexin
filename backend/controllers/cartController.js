import Cart from "../models/Cart.js";
// Import admin store models for correct product source
import StoreProduct from "../models/adminstore/StoreProduct.js";

// Get Cart Items
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ userId })
            .populate({
                path: 'items.productId',
                select: 'productName price originalPrice discountPercentage images quantity isActive'
            });

        if (!cart || cart.items.length === 0) {
            return res.status(200).json({
                success: true,
                cart: { items: [] },
                message: "Cart is empty"
            });
        }

        // Filter out inactive products
        cart.items = cart.items.filter(item => item.productId && item.productId.isActive);
        await cart.save();

        res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching cart",
            error: error.message
        });
    }
};

// Add Item to Cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0"
            });
        }

        // Check if product exists and is active
        const product = await StoreProduct.findOne({
            _id: productId,
            isActive: true,
            status: 'active'
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found or unavailable"
            });
        }

        // Check if enough stock available
        if (product.quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.quantity} items available in stock`
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if product already in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update quantity if product already in cart
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;

            if (newQuantity > product.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot add more items. Only ${product.quantity} available in stock`
                });
            }

            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            // Add new item to cart
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        await cart.populate({
            path: 'items.productId',
            select: 'productName price originalPrice discountPercentage images quantity isActive'
        });

        res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding item to cart",
            error: error.message
        });
    }
};

// Update Cart Item Quantity
export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: "Product ID and quantity are required"
            });
        }

        if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        if (quantity < 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity cannot be negative"
            });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        if (quantity === 0) {
            // Remove item from cart
            cart.items.splice(itemIndex, 1);
        } else {
            // Check stock availability
            const product = await StoreProduct.findById(productId);
            if (!product || !product.isActive || product.status !== 'active') {
                return res.status(404).json({
                    success: false,
                    message: "Product not found or unavailable"
                });
            }

            if (quantity > product.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.quantity} items available in stock`
                });
            }

            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        await cart.populate({
            path: 'items.productId',
            select: 'productName price originalPrice discountPercentage images quantity isActive'
        });

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating cart",
            error: error.message
        });
    }
};

// Remove Item from Cart
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();

        await cart.populate({
            path: 'items.productId',
            select: 'productName price originalPrice discountPercentage images quantity isActive'
        });

        res.status(200).json({
            success: true,
            message: "Item removed from cart successfully",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error removing item from cart",
            error: error.message
        });
    }
};

// Clear Cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error clearing cart",
            error: error.message
        });
    }
};

// Get Cart Item Count
export const getCartItemCount = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(200).json({
                success: true,
                itemCount: 0
            });
        }

        const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

        res.status(200).json({
            success: true,
            itemCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching cart item count",
            error: error.message
        });
    }
};
