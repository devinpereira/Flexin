import Product from "../models/Product.js";
import ProductReview from "../models/ProductReview.js";
import Category from "../models/Catergory.js";
import Subcategory from "../models/Subcategory.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Address from "../models/Address.js";
import PaymentMethod from "../models/PaymentMethod.js";
import Coupon from "../models/Coupon.js";
import User from "../models/User.js";

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const { 
      category, 
      subcategory, 
      search, 
      minPrice, 
      maxPrice, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 20,
      isFeatured,
      isActive = true
    } = req.query;

    // Build filter object
    const filter = { isActive };
    
    if (category) filter.categoryId = category;
    if (subcategory) filter.subcategoryId = subcategory;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    // Search filter
    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filter)
      .populate('categoryId', 'name description')
      .populate('subcategoryId', 'name description')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message
    });
  }
};

// Get Single Product
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findOne({ _id: id, isActive: true })
      .populate('categoryId', 'name description')
      .populate('subcategoryId', 'name description');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Get product reviews
    const reviews = await ProductReview.find({ productId: id })
      .populate('userId', 'fullName profileImageUrl')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      product,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message
    });
  }
};

// Add New Product
export const addProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      shortDescription,
      price,
      originalPrice,
      discountPercentage = 0,
      quantity,
      images = [],
      categoryId,
      subcategoryId,
      brand,
      isFeatured = false,
      specifications = []
    } = req.body;

    // Validation
    if (!productName || !description || !price || !quantity || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: productName, description, price, quantity, categoryId"
      });
    }

    // Validate category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID"
      });
    }

    // Validate subcategory if provided
    if (subcategoryId) {
      const subcategory = await Subcategory.findById(subcategoryId);
      if (!subcategory) {
        return res.status(400).json({
          success: false,
          message: "Invalid subcategory ID"
        });
      }
    }

    // Create new product
    const product = new Product({
      productName,
      description,
      shortDescription,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
      discountPercentage: parseFloat(discountPercentage),
      quantity: parseInt(quantity),
      images,
      categoryId,
      subcategoryId,
      brand,
      isFeatured,
      specifications
    });

    await product.save();

    // Populate the response
    await product.populate('categoryId', 'name description');
    if (subcategoryId) {
      await product.populate('subcategoryId', 'name description');
    }

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message
    });
  }
};

// Update Product
export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    // Validate category if being updated
    if (updates.categoryId) {
      const category = await Category.findById(updates.categoryId);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID"
        });
      }
    }

    // Validate subcategory if being updated
    if (updates.subcategoryId) {
      const subcategory = await Subcategory.findById(updates.subcategoryId);
      if (!subcategory) {
        return res.status(400).json({
          success: false,
          message: "Invalid subcategory ID"
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate('categoryId', 'name description')
      .populate('subcategoryId', 'name description');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message
    });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Soft delete - set isActive to false
    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message
    });
  }
};

// Add Product Review
export const addProductReview = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    // Validation
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating and comment are required"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Check if user already reviewed this product
    const existingReview = await ProductReview.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product"
      });
    }

    // Create new review
    const review = new ProductReview({
      productId,
      userId,
      rating: parseInt(rating),
      comment
    });

    await review.save();
    await review.populate('userId', 'fullName profileImageUrl');

    // Update product average rating and review count
    const reviews = await ProductReview.find({ productId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviewCount: reviews.length
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding review",
      error: error.message
    });
  }
};

// Get Product Reviews
export const getProductReviews = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await ProductReview.find({ productId })
      .populate('userId', 'fullName profileImageUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalReviews = await ProductReview.countDocuments({ productId });
    const totalPages = Math.ceil(totalReviews / parseInt(limit));

    res.status(200).json({
      success: true,
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalReviews,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message
    });
  }
};
