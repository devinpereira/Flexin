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
// Admin store models for integration
import StoreProduct from "../models/adminstore/StoreProduct.js";
import StoreCategory from "../models/adminstore/StoreCategory.js";
import StoreProductReview from "../models/adminstore/StoreProductReview.js";
import { cloudinary } from "../config/cloudinary.js";

// Helper function to process Cloudinary images
const processCloudinaryImage = (imageUrl) => {
  if (!imageUrl) return null;

  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // If it's a Cloudinary public_id, construct the URL
  if (typeof imageUrl === 'string' && !imageUrl.startsWith('http')) {
    return cloudinary.url(imageUrl, {
      secure: true,
      quality: 'auto:good',
      fetch_format: 'auto',
      crop: 'scale'
    });
  }

  return imageUrl;
};

// Helper function to transform product images
const transformProductImages = (images) => {
  if (!images || !Array.isArray(images)) {
    return ['/public/default.jpg'];
  }

  return images.map(img => {
    if (typeof img === 'string') {
      return processCloudinaryImage(img);
    }

    if (img && typeof img === 'object' && img.url) {
      return processCloudinaryImage(img.url);
    }

    return '/public/default.jpg';
  }).filter(Boolean);
};

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

    // Build filter object - using admin store model structure
    const filter = { isActive: true, status: 'active' }; // Ensure both conditions

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

    // Fetch from admin store products
    const products = await StoreProduct.find(filter)
      .populate('categoryId', 'name description')
      .populate('subcategoryId', 'name description')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalProducts = await StoreProduct.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    // Transform admin store product format to match expected user store format
    const transformedProducts = products.map(product => ({
      _id: product._id,
      productName: product.productName,
      name: product.productName,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      discountPercentage: product.discountPercentage || 0,
      brand: product.brand,
      // Transform images using Cloudinary processing
      images: transformProductImages(product.images),
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      category: product.categoryId,
      subcategory: product.subcategoryId,
      stock: product.quantity || 0,
      quantity: product.quantity || 0,
      isActive: product.status === 'active' && product.isActive,
      isFeatured: product.isFeatured,
      averageRating: product.averageRating || 0,
      reviewCount: product.reviewCount || 0,
      tags: product.tags || [],
      specifications: product.specifications || [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }));

    res.status(200).json({
      success: true,
      products: transformedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
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

    // Fetch from admin store product
    const product = await StoreProduct.findOne({
      _id: id,
      isActive: true,
      status: 'active'
    })
      .populate('categoryId', 'name description')
      .populate('subcategoryId', 'name description');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Get product reviews from admin store
    const reviews = await StoreProductReview.find({ productId: id })
      .populate('userId', 'fullName profileImageUrl')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get related products based on category or tags
    const relatedProducts = await StoreProduct.find({
      _id: { $ne: id },
      $or: [
        { categoryId: product.categoryId },
        { tags: { $in: product.tags || [] } }
      ],
      isActive: true,
      status: 'active'
    })
      .populate('categoryId', 'name description')
      .limit(4);

    // Transform admin store product format to match expected user store format
    const transformedProduct = {
      _id: product._id,
      productName: product.productName,
      name: product.productName,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      discountPercentage: product.discountPercentage || 0,
      brand: product.brand,
      // Transform images using Cloudinary processing
      images: transformProductImages(product.images),
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      category: product.categoryId,
      subcategory: product.subcategoryId,
      stock: product.quantity || 0,
      quantity: product.quantity || 0,
      isActive: product.status === 'active' && product.isActive,
      isFeatured: product.isFeatured,
      averageRating: product.averageRating || 0,
      reviewCount: product.reviewCount || 0,
      tags: product.tags || [],
      specifications: product.specifications || [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };

    // Transform related products
    const transformedRelatedProducts = relatedProducts.map(relatedProduct => ({
      _id: relatedProduct._id,
      productName: relatedProduct.productName,
      name: relatedProduct.productName,
      price: relatedProduct.price,
      originalPrice: relatedProduct.originalPrice || relatedProduct.price,
      discountPercentage: relatedProduct.discountPercentage || 0,
      brand: relatedProduct.brand,
      images: transformProductImages(relatedProduct.images),
      categoryId: relatedProduct.categoryId,
      averageRating: relatedProduct.averageRating || 0,
      reviewCount: relatedProduct.reviewCount || 0,
      quantity: relatedProduct.quantity || 0
    }));

    res.status(200).json({
      success: true,
      product: transformedProduct,
      reviews,
      relatedProducts: transformedRelatedProducts
    });
  } catch (error) {
    console.error('Error fetching product:', error);
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

    // Check if product exists using admin store model
    const product = await StoreProduct.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Check if user already reviewed this product using admin store model
    const existingReview = await StoreProductReview.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product"
      });
    }

    // Create new review using admin store model
    const review = new StoreProductReview({
      productId,
      userId,
      review: {
        rating: parseInt(rating),
        title: comment && comment.length > 10 ? comment.substring(0, 30) + '...' : "Product Review",
        comment
      },
      moderation: {
        status: "approved" // Auto-approve user reviews
      },
      customer: {
        name: req.user.fullName || req.user.username || "Customer",
        isVerifiedPurchase: false
      }
    });

    await review.save();
    await review.populate('userId', 'fullName profileImageUrl');

    // Update product average rating and review count using admin store model
    const reviews = await StoreProductReview.find({ productId });
    const totalRating = reviews.reduce((sum, review) => sum + (review.review?.rating || 0), 0);
    const averageRating = totalRating / reviews.length;

    await StoreProduct.findByIdAndUpdate(productId, {
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

    // Fetch reviews from admin store instead of regular product reviews
    const reviews = await StoreProductReview.find({ productId })
      .populate('userId', 'fullName profileImageUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalReviews = await StoreProductReview.countDocuments({ productId });
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
