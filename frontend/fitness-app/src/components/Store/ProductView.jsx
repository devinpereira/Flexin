import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';
import LeftNavigation from './LeftNavigation';
import { AiOutlineHeart, AiFillHeart, AiOutlineStar, AiFillStar, AiOutlineCheckCircle, AiOutlineClose, AiOutlineZoomIn } from 'react-icons/ai';
import { FiShoppingCart, FiExternalLink, FiShare2 } from 'react-icons/fi';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { productsApi, cartApi } from '../../api/storeApi';
import { recentlyViewedUtils } from '../../utils/recentlyViewed';

const ProductView = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  console.log('ProductView loaded with productId:', productId);
  console.log('Location state:', location.state);

  const [product, setProduct] = useState(location.state?.product || null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(!location.state?.product);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Get cart items count from localStorage
  const getCartItemsCount = () => {
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      const cartItems = JSON.parse(savedCartItems);
      return cartItems.length;
    }
    return 0;
  };

  // Update cart count on component mount and when cart changes
  useEffect(() => {
    setCartItemsCount(getCartItemsCount());

    // Set up interval to check for cart changes (in case user adds items from other pages)
    const interval = setInterval(() => {
      const currentCount = getCartItemsCount();
      if (currentCount !== cartItemsCount) {
        setCartItemsCount(currentCount);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cartItemsCount]);

  // New state for enhanced features
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // description, specifications, reviews

  // Handle navigation for LeftNavigation component
  const handleNavigation = (view) => {
    switch (view) {
      case 'main':
        navigate('/store');
        break;
      case 'cart':
        navigate('/store', { state: { activeView: 'cart' } });
        break;
      case 'deals':
        navigate('/store', { state: { activeView: 'deals' } });
        break;
      case 'orders':
        navigate('/orders');
        break;
      default:
        navigate('/store');
    }
  };

  // Helper function to get product images
  const getProductImages = (product) => {
    if (!product) return ['/public/default.jpg'];

    // If product has images array, use it
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }

    // If product has a single image property (from formatted data), convert to array
    if (product.image) {
      return [product.image];
    }

    // Fallback to default image
    return ['/public/default.jpg'];
  };

  // Helper function to get current product image
  const getCurrentImage = (product, index = 0) => {
    const images = getProductImages(product);
    return images[index] || images[0] || '/public/default.jpg';
  };

  // Fetch product data if not available from location state
  useEffect(() => {
    const fetchProduct = async () => {
      console.log('ProductView useEffect - productId:', productId, 'product:', product);

      // If we have a product from location state, add to recently viewed
      if (product) {
        console.log('Product from location state:', product);
        console.log('Product images:', product.images);
        console.log('Product image (singular):', product.image);

        // Add to recently viewed
        recentlyViewedUtils.addToRecentlyViewed(product);

        return; // No need to fetch if we already have the product
      }

      if (!product && productId) {
        try {
          setIsLoading(true);
          setError(null);

          console.log('Fetching product with ID:', productId);
          const response = await productsApi.getProduct(productId);
          console.log('API response:', response);

          if (response.success && response.product) {
            console.log('Product from API:', response.product);
            console.log('Product images from API:', response.product.images);

            const formattedProduct = {
              id: response.product._id || response.product.id,
              name: response.product.productName || response.product.name,
              price: response.product.price,
              originalPrice: response.product.originalPrice,
              discountPercentage: response.product.discountPercentage,
              description: response.product.description,
              shortDescription: response.product.shortDescription,
              images: response.product.images || ['/public/default.jpg'],
              rating: response.product.averageRating || 0,
              reviewCount: response.product.reviewCount || 0,
              brand: response.product.brand,
              category: response.product.categoryId?.name,
              subcategory: response.product.subcategoryId?.name,
              specifications: response.product.specifications || [],
              quantity: response.product.quantity || 0,
              tags: response.product.tags || [],
              features: response.product.features || []
            };

            console.log('Formatted product:', formattedProduct);
            console.log('Formatted product images:', formattedProduct.images);
            setProduct(formattedProduct);

            // Add to recently viewed
            recentlyViewedUtils.addToRecentlyViewed(formattedProduct);

            // Set related products
            if (response.relatedProducts) {
              setRelatedProducts(response.relatedProducts);
            }
          } else {
            setError('Product not found');
          }
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching product:', error);
          setError('Failed to load product. Please try again.');
          setIsLoading(false);
        }
      }
    };

    fetchProduct();
  }, [productId, product]);

  // Fetch product reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (productId) {
        try {
          setReviewsLoading(true);
          setReviewsError(null);
          const response = await productsApi.getReviews(productId);

          if (response.success) {
            // Format reviews for display
            const formattedReviews = response.reviews.map(review => ({
              id: review._id,
              name: review.userId?.fullName || 'Anonymous User',
              rating: review.rating,
              comment: review.comment,
              date: new Date(review.createdAt).toLocaleDateString(),
              userId: review.userId?._id
            }));
            setReviews(formattedReviews);
          }
        } catch (error) {
          console.error('Error fetching reviews:', error);
          setReviewsError('Failed to load reviews');
        } finally {
          setReviewsLoading(false);
        }
      }
    };

    fetchReviews();
  }, [productId]);

  // Handle the back button click
  const handleBack = () => {
    navigate(-1);
  };

  // Handle changing the current product image
  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  // Handle the favorite button click
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Handle quantity changes
  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= (product.quantity || 999)) {
      setQuantity(newQuantity);
      // Reset the "added to cart" state when quantity changes
      setIsAddedToCart(false);
    }
  };

  // Handle adding the product to the cart
  const handleAddToCart = async () => {
    try {
      // Try to add to backend cart if user is authenticated
      const token = localStorage.getItem('token');
      if (token) {
        await cartApi.addToCart(product.id, quantity);
        console.log(`Added ${quantity} of ${product.name} to backend cart`);
      }

      // Update local cart state in localStorage (same logic as Store/index.jsx)
      const savedCartItems = localStorage.getItem('cartItems');
      let cartItems = savedCartItems ? JSON.parse(savedCartItems) : [];

      // Create formatted product for cart (ensure consistent structure with MainStoreView)
      const cartProduct = {
        id: product._id || product.id,
        name: product.productName || product.name,
        category: product.categoryId?.name || product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        discountPercentage: product.discountPercentage,
        rating: product.averageRating || 0,
        reviewCount: product.reviewCount || 0,
        image: product.images?.[0] || product.image || '/public/default.jpg',
        images: product.images || [product.image] || ['/public/default.jpg'],
        description: product.description,
        shortDescription: product.shortDescription,
        brand: product.brand,
        isFeatured: product.isFeatured,
        quantity: quantity, // This is the cart quantity, not stock quantity
        stockQuantity: product.quantity, // Preserve original stock quantity
        categoryId: product.categoryId,
        subcategoryId: product.subcategoryId,
        specifications: product.specifications || [],
        tags: product.tags || [],
        averageRating: product.averageRating || 0
      };

      // Check if product already exists in cart
      const existingItemIndex = cartItems.findIndex(item => item.id === cartProduct.id);

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        cartItems.push(cartProduct);
      }

      // Save updated cart to localStorage
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      console.log(`Updated local cart: Added ${quantity} of ${product.name}`);

      // Update cart count
      setCartItemsCount(cartItems.length);

      // Set added to cart state
      setIsAddedToCart(true);

      // Show notification
      setShowNotification(true);

      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);

      // Reset the "added to cart" highlight after 2 seconds
      setTimeout(() => {
        setIsAddedToCart(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);

      // Even if backend fails, still update local cart
      try {
        const savedCartItems = localStorage.getItem('cartItems');
        let cartItems = savedCartItems ? JSON.parse(savedCartItems) : [];

        const cartProduct = {
          id: product._id || product.id,
          name: product.productName || product.name,
          category: product.categoryId?.name || product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          discountPercentage: product.discountPercentage,
          rating: product.averageRating || 0,
          reviewCount: product.reviewCount || 0,
          image: product.images?.[0] || product.image || '/public/default.jpg',
          images: product.images || [product.image] || ['/public/default.jpg'],
          description: product.description,
          shortDescription: product.shortDescription,
          brand: product.brand,
          isFeatured: product.isFeatured,
          quantity: quantity, // This is the cart quantity, not stock quantity
          stockQuantity: product.quantity, // Preserve original stock quantity
          categoryId: product.categoryId,
          subcategoryId: product.subcategoryId,
          specifications: product.specifications || [],
          tags: product.tags || [],
          averageRating: product.averageRating || 0
        };

        const existingItemIndex = cartItems.findIndex(item => item.id === cartProduct.id);

        if (existingItemIndex >= 0) {
          cartItems[existingItemIndex].quantity += quantity;
        } else {
          cartItems.push(cartProduct);
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        setCartItemsCount(cartItems.length);
        console.log(`Updated local cart (fallback): Added ${quantity} of ${product.name}`);
      } catch (localError) {
        console.error('Error updating local cart:', localError);
      }

      // Still show notification and highlight even if API fails
      setIsAddedToCart(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      setTimeout(() => setIsAddedToCart(false), 2000);
    }
  };

  // Handle new review input changes
  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({
      ...newReview,
      [name]: value
    });
  };

  // Handle setting the rating for a new review
  const handleSetRating = (rating) => {
    setNewReview({
      ...newReview,
      rating
    });
  };

  // Handle submitting a new review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    // Validation
    if (!newReview.rating || !newReview.comment.trim()) {
      alert('Please provide both rating and comment');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to submit a review');
      return;
    }

    try {
      setIsSubmittingReview(true);

      const reviewData = {
        rating: newReview.rating,
        comment: newReview.comment.trim()
      };

      const response = await productsApi.addReview(productId, reviewData);

      if (response.success) {
        // Add the new review to the list
        const newReviewFormatted = {
          id: response.review._id,
          name: response.review.userId?.fullName || 'You',
          rating: response.review.rating,
          comment: response.review.comment,
          date: new Date(response.review.createdAt).toLocaleDateString(),
          userId: response.review.userId?._id
        };

        setReviews(prev => [newReviewFormatted, ...prev]);

        // Reset the form
        setNewReview({ rating: 0, comment: '' });

        alert('Review submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.message) {
        alert(error.message);
      } else {
        alert('Failed to submit review. Please try again.');
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Handle image modal
  const handleImageModal = (index) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  // Handle share functionality
  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Handle product navigation
  const handleProductClick = (relatedProduct) => {
    navigate(`/product/${relatedProduct._id}`, {
      state: { product: relatedProduct }
    });
  };

  // Handle category navigation
  const handleCategoryNavigation = (categoryId) => {
    navigate(`/store?category=${categoryId}`);
  };

  const handleSubcategoryNavigation = (subcategoryId) => {
    navigate(`/store?subcategory=${subcategoryId}`);
  };

  // Stock status helper
  const getStockStatus = () => {
    if (product.quantity <= 0) return { status: 'out-of-stock', text: 'Out of Stock', color: 'text-red-500' };
    if (product.quantity <= 5) return { status: 'low-stock', text: `Only ${product.quantity} left`, color: 'text-yellow-500' };
    return { status: 'in-stock', text: 'In Stock', color: 'text-green-500' };
  };

  // If product data is still loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed"
        style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
        <Navigation />

        <div className="container mx-auto pt-4 sm:pt-8 px-4 pb-24 md:pb-8">
          <div className="flex flex-col lg:flex-row">
            <LeftNavigation
              activeView="main"
              setActiveView={handleNavigation}
              onCategorySelect={() => navigate('/store')}
              cartItemsCount={cartItemsCount}
              isMobileNavOpen={isMobileNavOpen}
              setIsMobileNavOpen={setIsMobileNavOpen}
              onProductClick={() => { }}
            />

            <div className="w-full lg:pl-[290px]">
              <div className="flex justify-center items-center h-64">
                <div className="loader"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If there's an error loading the product
  if (error) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed"
        style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
        <Navigation />

        <div className="container mx-auto pt-4 sm:pt-8 px-4 pb-24 md:pb-8">
          <div className="flex flex-col lg:flex-row">
            <LeftNavigation
              activeView="main"
              setActiveView={handleNavigation}
              onCategorySelect={() => navigate('/store')}
              cartItemsCount={cartItemsCount}
              isMobileNavOpen={isMobileNavOpen}
              setIsMobileNavOpen={setIsMobileNavOpen}
              onProductClick={() => { }}
            />

            <div className="w-full lg:pl-[290px]">
              <div className="flex flex-col justify-center items-center h-64">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[#f67a45] text-white px-4 py-2 rounded-lg hover:bg-[#e56d3d] transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If product data is not available
  if (!product) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed"
        style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
        <Navigation />

        <div className="container mx-auto pt-4 sm:pt-8 px-4 pb-24 md:pb-8">
          <div className="flex flex-col lg:flex-row">
            <LeftNavigation
              activeView="main"
              setActiveView={handleNavigation}
              onCategorySelect={() => navigate('/store')}
              cartItemsCount={cartItemsCount}
              isMobileNavOpen={isMobileNavOpen}
              setIsMobileNavOpen={setIsMobileNavOpen}
              onProductClick={() => { }}
            />

            <div className="w-full lg:pl-[290px]">
              <div className="text-white">
                Product not found.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />

      <div className="container mx-auto pt-4 sm:pt-8 px-4 pb-24 md:pb-8">
        <div className="flex flex-col lg:flex-row">
          {/* Left Navigation - Categories */}
          <LeftNavigation
            activeView="main"
            setActiveView={handleNavigation}
            onCategorySelect={() => navigate('/store')}
            cartItemsCount={cartItemsCount}
            isMobileNavOpen={isMobileNavOpen}
            setIsMobileNavOpen={setIsMobileNavOpen}
            onProductClick={() => { }}
          />

          {/* Main Content Area with proper spacing for fixed sidebar */}
          <div className="w-full lg:pl-[290px]">
            {/* Back button and navigation */}
            <div className="mb-6">
              <button
                onClick={handleBack}
                className="text-white flex items-center hover:text-[#f67a45] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Store
              </button>
            </div>

            {/* Product Details */}
            <div className="flex flex-col lg:flex-row gap-8 mb-12 max-w-full">
              {/* Product Images */}
              <div className="lg:w-1/2 min-w-0">
                <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
                  {/* Main product image */}
                  <div className="bg-gray-700/30 rounded-lg mb-4 overflow-hidden h-80 flex items-center justify-center max-w-full relative group hover:shadow-lg hover:shadow-[#f67a45]/20 transition-all duration-300">
                    <img
                      src={getCurrentImage(product, currentImageIndex)}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain cursor-pointer transform transition-transform duration-300 hover:scale-105"
                      onClick={() => handleImageModal(currentImageIndex)}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/public/default.jpg';
                      }}
                    />
                    {/* Zoom icon overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <AiOutlineZoomIn className="text-white text-3xl" />
                    </div>

                    {/* Image navigation arrows */}
                    {getProductImages(product).length > 1 && (
                      <>
                        <button
                          onClick={() => handleImageChange(currentImageIndex > 0 ? currentImageIndex - 1 : getProductImages(product).length - 1)}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                        >
                          <HiOutlineChevronLeft className="text-xl" />
                        </button>
                        <button
                          onClick={() => handleImageChange(currentImageIndex < getProductImages(product).length - 1 ? currentImageIndex + 1 : 0)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                        >
                          <HiOutlineChevronRight className="text-xl" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail images */}
                  {getProductImages(product).length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {getProductImages(product).map((image, index) => (
                        <div
                          key={index}
                          className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg ${currentImageIndex === index ? 'ring-2 ring-[#f67a45] shadow-lg shadow-[#f67a45]/30' : 'hover:ring-2 hover:ring-[#f67a45]/50'}`}
                          onClick={() => handleImageChange(index)}
                        >
                          <img
                            src={image}
                            alt={`${product.name} - view ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/public/default.jpg';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="lg:w-1/2 min-w-0">
                <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
                  {/* Brand and Category Navigation */}
                  <div className="flex items-center gap-2 mb-2 text-sm">
                    {product.brand && (
                      <>
                        <span className="text-[#f67a45] font-medium">{product.brand}</span>
                        <span className="text-gray-400">•</span>
                      </>
                    )}
                    {product.category && (
                      <>
                        <button
                          className="text-gray-400 hover:text-[#f67a45] transition-colors"
                          onClick={() => handleCategoryNavigation(product.categoryId?._id)}
                        >
                          {product.category.name || product.category}
                        </button>
                        {product.subcategory && (
                          <>
                            <span className="text-gray-400">
                              <HiOutlineChevronRight className="inline w-3 h-3" />
                            </span>
                            <button
                              className="text-gray-400 hover:text-[#f67a45] transition-colors"
                              onClick={() => handleSubcategoryNavigation(product.subcategoryId?._id)}
                            >
                              {product.subcategory.name || product.subcategory}
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>

                  <h1 className="text-white text-2xl font-bold mb-2">{product.name}</h1>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex text-[#f67a45]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                          {star <= Math.floor(product.rating) ? (
                            <AiFillStar />
                          ) : star - 0.5 <= product.rating ? (
                            <AiFillStar />
                          ) : (
                            <AiOutlineStar />
                          )}
                        </span>
                      ))}
                    </div>
                    <span className="text-white ml-2">{product.rating.toFixed(1)}</span>
                    <span className="text-gray-400 ml-1">({product.reviewCount} reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-[#f67a45] text-2xl font-bold">${product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <>
                          <span className="text-white/50 text-lg line-through">${product.originalPrice}</span>
                          {product.discountPercentage && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                              -{product.discountPercentage}%
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-white mb-6">{product.description}</p>

                  {/* Stock Status */}
                  <div className="mb-6">
                    <span className="text-white">Availability: </span>
                    <span className={getStockStatus().color}>
                      {getStockStatus().text}
                    </span>
                  </div>

                  {/* Quantity selector and Add to cart */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                    <div className="flex items-center bg-[#1e1e35] rounded-lg">
                      <button
                        className="px-4 py-2 text-white hover:text-[#f67a45]"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-white">{quantity}</span>
                      <button
                        className="px-4 py-2 text-white hover:text-[#f67a45]"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= (product.quantity || 0)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className={`flex-1 py-2 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${isAddedToCart
                        ? 'bg-green-500 text-white border-2 border-green-400 shadow-lg transform scale-105'
                        : 'bg-[#f67a45] text-white hover:bg-[#e56d3d]'
                        }`}
                      onClick={handleAddToCart}
                      disabled={(product.quantity || 0) <= 0}
                    >
                      {isAddedToCart ? (
                        <>
                          <AiOutlineCheckCircle />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <FiShoppingCart />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-4 mb-6">
                    <button
                      className="bg-transparent border border-[#f67a45]/50 text-white p-2 rounded-lg hover:bg-[#f67a45]/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:border-[#f67a45] group"
                      onClick={handleToggleFavorite}
                    >
                      {isFavorite ? (
                        <AiFillHeart className="text-[#f67a45] transition-transform duration-300 group-hover:scale-110" size={24} />
                      ) : (
                        <AiOutlineHeart className="transition-transform duration-300 group-hover:scale-110" size={24} />
                      )}
                    </button>

                    <button
                      className="bg-transparent border border-[#f67a45]/50 text-white p-2 rounded-lg hover:bg-[#f67a45]/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:border-[#f67a45] group"
                      onClick={handleShare}
                    >
                      <FiShare2 className="transition-transform duration-300 group-hover:scale-110" size={24} />
                    </button>
                  </div>

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-white font-semibold mb-2">Tags:</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <span key={index} className="bg-[#1e1e35] text-white px-3 py-1 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>      {/* Tabbed Content Section */}
            <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 mb-12">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-700 mb-6">
                <button
                  className={`py-2 px-4 font-medium transition-colors ${activeTab === 'description'
                    ? 'text-[#f67a45] border-b-2 border-[#f67a45]'
                    : 'text-white hover:text-[#f67a45]'
                    }`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={`py-2 px-4 font-medium transition-colors ${activeTab === 'specifications'
                    ? 'text-[#f67a45] border-b-2 border-[#f67a45]'
                    : 'text-white hover:text-[#f67a45]'
                    }`}
                  onClick={() => setActiveTab('specifications')}
                >
                  Specifications
                </button>
                <button
                  className={`py-2 px-4 font-medium transition-colors ${activeTab === 'reviews'
                    ? 'text-[#f67a45] border-b-2 border-[#f67a45]'
                    : 'text-white hover:text-[#f67a45]'
                    }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews ({product.reviewCount})
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[300px]">
                {activeTab === 'description' && (
                  <div className="space-y-4">
                    <h3 className="text-white text-lg font-semibold">Product Description</h3>
                    <div className="text-white/90 leading-relaxed">
                      {product.description ? (
                        <div className="space-y-3">
                          {product.description.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                        </div>
                      ) : (
                        <p>No detailed description available for this product.</p>
                      )}
                    </div>
                    {product.shortDescription && (
                      <div className="mt-4 p-4 bg-[#1a1a2f] rounded-lg">
                        <h4 className="text-white font-medium mb-2">Key Features:</h4>
                        <p className="text-white/80">{product.shortDescription}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="space-y-4">
                    <h3 className="text-white text-lg font-semibold">Product Specifications</h3>
                    {product.specifications && product.specifications.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.specifications.map((spec, index) => (
                          <div key={index} className="bg-[#1a1a2f] rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <span className="text-white/70 font-medium">{spec.name || spec.key}:</span>
                              <span className="text-white">{spec.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-white/70">No specifications available for this product.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <h3 className="text-white text-lg font-semibold">Customer Reviews</h3>

                    {/* Reviews list */}
                    {reviewsLoading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="w-8 h-8 border-4 border-[#f67a45] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : reviewsError ? (
                      <div className="text-center py-8">
                        <p className="text-red-400 mb-4">{reviewsError}</p>
                        <button
                          onClick={() => window.location.reload()}
                          className="bg-[#f67a45] text-white px-4 py-2 rounded-lg hover:bg-[#e56d3d] transition-colors"
                        >
                          Retry
                        </button>
                      </div>
                    ) : reviews.length > 0 ? (
                      <div className="space-y-6 mb-8">
                        {(showAllReviews ? reviews : reviews.slice(0, 3)).map(review => (
                          <div key={review.id} className="border-b border-gray-700 pb-6 last:border-b-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="text-white font-medium">{review.name}</h4>
                                <div className="flex text-[#f67a45]">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star}>
                                      {star <= review.rating ? <AiFillStar /> : <AiOutlineStar />}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <span className="text-gray-400 text-sm">{review.date}</span>
                            </div>
                            <p className="text-white">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-white/70">No reviews yet. Be the first to review this product!</p>
                      </div>
                    )}

                    {/* Show more/less reviews button */}
                    {reviews.length > 3 && (
                      <div className="text-center mb-8">
                        <button
                          className="text-[#f67a45] hover:underline"
                          onClick={() => setShowAllReviews(!showAllReviews)}
                        >
                          {showAllReviews ? 'Show Less Reviews' : 'Show All Reviews'}
                        </button>
                      </div>
                    )}

                    {/* Add a review form */}
                    <div className="mt-8 pt-8 border-t border-gray-700">
                      <h4 className="text-white font-bold mb-4">Write a Review</h4>
                      <form onSubmit={handleSubmitReview}>
                        <div className="mb-4">
                          <label className="block text-white mb-2">Rating *</label>
                          <div className="flex text-2xl">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => handleSetRating(star)}
                                className="text-gray-400 hover:text-[#f67a45] focus:outline-none"
                                disabled={isSubmittingReview}
                              >
                                {star <= newReview.rating ? (
                                  <AiFillStar className="text-[#f67a45]" />
                                ) : (
                                  <AiOutlineStar />
                                )}
                              </button>
                            ))}
                          </div>
                          {newReview.rating > 0 && (
                            <p className="text-sm text-gray-400 mt-1">
                              {newReview.rating} star{newReview.rating !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>

                        <div className="mb-4">
                          <label className="block text-white mb-2">Your Review *</label>
                          <textarea
                            name="comment"
                            value={newReview.comment}
                            onChange={handleReviewInputChange}
                            className="w-full bg-[#1a1a2f] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45] min-h-[100px]"
                            placeholder="Share your experience with this product..."
                            required
                            disabled={isSubmittingReview}
                          ></textarea>
                        </div>

                        <button
                          type="submit"
                          className="bg-[#f67a45] text-white py-2 px-6 rounded-lg hover:bg-[#e56d3d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          disabled={isSubmittingReview || !newReview.rating || !newReview.comment.trim()}
                        >
                          {isSubmittingReview ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <span>Submit Review</span>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts && relatedProducts.length > 0 && (
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 mb-12">
                <h2 className="text-white text-xl font-bold mb-6">Related Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <div
                      key={relatedProduct._id}
                      className="bg-[#1a1a2f] rounded-lg p-4 hover:bg-[#1e1e35] transition-colors cursor-pointer"
                      onClick={() => handleProductClick(relatedProduct)}
                    >
                      <div className="aspect-square bg-gray-700/30 rounded-lg mb-3 overflow-hidden">
                        <img
                          src={relatedProduct.images?.[0] || relatedProduct.image || '/public/default.jpg'}
                          alt={relatedProduct.name || relatedProduct.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/public/default.jpg';
                          }}
                        />
                      </div>
                      <h3 className="text-white font-medium mb-2 line-clamp-2">
                        {relatedProduct.name || relatedProduct.productName}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[#f67a45] font-bold">${relatedProduct.price}</span>
                        {relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.price && (
                          <span className="text-white/50 text-sm line-through">${relatedProduct.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex text-[#f67a45] text-sm">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star}>
                              {star <= Math.floor(relatedProduct.averageRating || 0) ? (
                                <AiFillStar />
                              ) : (
                                <AiOutlineStar />
                              )}
                            </span>
                          ))}
                        </div>
                        <span className="text-white/70 text-sm">({relatedProduct.reviewCount || 0})</span>
                      </div>
                      <div className="mt-2">
                        <span className={`text-sm ${relatedProduct.quantity > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {relatedProduct.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Image Modal */}
          {showImageModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="relative max-w-4xl max-h-[90vh] w-full">
                <button
                  onClick={() => setShowImageModal(false)}
                  className="absolute top-4 right-4 text-white hover:text-[#f67a45] text-2xl z-10"
                >
                  <AiOutlineClose />
                </button>
                <img
                  src={getCurrentImage(product, currentImageIndex)}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/public/default.jpg';
                  }}
                />
                {getProductImages(product).length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(currentImageIndex > 0 ? currentImageIndex - 1 : getProductImages(product).length - 1)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
                    >
                      <HiOutlineChevronLeft className="text-xl" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(currentImageIndex < getProductImages(product).length - 1 ? currentImageIndex + 1 : 0)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
                    >
                      <HiOutlineChevronRight className="text-xl" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                  {currentImageIndex + 1} / {getProductImages(product).length}
                </div>
              </div>
            </div>
          )}

          {/* Share Modal */}
          {showShareModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-lg font-bold">Share Product</h3>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="text-white hover:text-[#f67a45]"
                  >
                    <AiOutlineClose />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={window.location.href}
                      readOnly
                      className="flex-1 bg-[#1a1a2f] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(window.location.href)}
                      className="bg-[#f67a45] text-white px-4 py-2 rounded-lg hover:bg-[#e56d3d] transition-colors text-sm"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Facebook
                    </button>
                    <button
                      onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.name)}`)}
                      className="flex-1 bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors text-sm"
                    >
                      Twitter
                    </button>
                    <button
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(product.name + ' - ' + window.location.href)}`)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification */}
          {showNotification && (
            <div className="fixed bottom-4 right-4 bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 shadow-lg flex items-center gap-3 animate-fade-in-up">
              <AiOutlineCheckCircle className="text-[#f67a45] text-xl" />
              <div className="flex-1">
                <p className="text-white font-medium">Added to Cart!</p>
                <p className="text-gray-400 text-sm">{quantity} x {product.name}</p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <AiOutlineClose />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductView;
