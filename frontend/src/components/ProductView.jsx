import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { AiOutlineHeart, AiFillHeart, AiOutlineStar, AiFillStar, AiOutlineCheckCircle, AiOutlineClose } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';

const ProductView = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '', name: '' });
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  
  // Product images (in a real app, these would come from the product data)
  const productImages = [
    `/src/assets/products/product${(parseInt(productId) % 5) + 1}.png`,
    `/src/assets/products/product${((parseInt(productId) + 1) % 5) + 1}.png`,
    `/src/assets/products/product${((parseInt(productId) + 2) % 5) + 1}.png`,
  ];
  
  // Sample product data (in a real app, you would fetch this based on the productId)
  useEffect(() => {
    if (!product) {
      // If product wasn't passed in location state, create a sample one
      setProduct({
        id: productId,
        name: `Product ${productId}`,
        price: '99.99',
        discount: 30,
        originalPrice: '129.99',
        description: 'This premium fitness product is designed to enhance your workout experience. Made with high-quality materials that ensure durability and performance. Suitable for all fitness levels from beginners to professionals.',
        features: [
          'High-quality construction',
          'Ergonomic design',
          'Durable materials',
          'Easy to use and maintain',
          'Perfect for home and gym use'
        ],
        image: `/src/assets/products/product${(parseInt(productId) % 5) + 1}.png`,
      });
    }
    
    // Check if product is in favorites
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(savedFavorites.some(item => item.id === productId));
  }, [productId, product]);
  
  // Sample reviews (in a real app, you would fetch these)
  const [reviews, setReviews] = useState([
    { id: 1, name: 'John D.', rating: 5, comment: 'Excellent product! Exactly what I needed for my workouts.', date: '2025-02-15' },
    { id: 2, name: 'Sarah M.', rating: 4, comment: 'Great quality, but shipping took longer than expected.', date: '2025-02-10' },
    { id: 3, name: 'Mike R.', rating: 5, comment: 'Perfect addition to my home gym setup.', date: '2025-02-05' },
    { id: 4, name: 'Emma L.', rating: 3, comment: 'Good product but a bit expensive compared to similar options.', date: '2025-01-30' },
    { id: 5, name: 'Alex T.', rating: 4, comment: 'Very satisfied with the purchase. Would recommend!', date: '2025-01-25' },
  ]);
  
  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  
  // Related products (You May Also Like)
  const relatedProducts = [
    {
      id: `related-${parseInt(productId) + 1}`,
      name: `Related Product ${parseInt(productId) + 1}`,
      price: '89.99',
      image: `/src/assets/products/product${((parseInt(productId) + 1) % 5) + 1}.png`,
    },
    {
      id: `related-${parseInt(productId) + 2}`,
      name: `Related Product ${parseInt(productId) + 2}`,
      price: '109.99',
      image: `/src/assets/products/product${((parseInt(productId) + 2) % 5) + 1}.png`,
    },
    {
      id: `related-${parseInt(productId) + 3}`,
      name: `Related Product ${parseInt(productId) + 3}`,
      price: '79.99',
      image: `/src/assets/products/product${((parseInt(productId) + 3) % 5) + 1}.png`,
    },
    {
      id: `related-${parseInt(productId) + 4}`,
      name: `Related Product ${parseInt(productId) + 4}`,
      price: '119.99',
      image: `/src/assets/products/product${((parseInt(productId) + 4) % 5) + 1}.png`,
    },
  ];
  
  // Toggle favorite status
  const toggleFavorite = () => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      const updatedFavorites = savedFavorites.filter(item => item.id !== product.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      const updatedFavorites = [...savedFavorites, product];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(true);
    }
  };
  
  // Add to cart with custom notification
  const addToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      const updatedCart = cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cartItems, { ...product, quantity }];
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    }
    
    // Show notification
    setShowNotification(true);
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };
  
  // Buy now - Add to cart and go to checkout
  const buyNow = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItem = cartItems.find(item => item.id === product.id);
    
    let updatedCart;
    if (existingItem) {
      updatedCart = cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity }];
    }
    
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    
    navigate('/checkout', { 
      state: { 
        items: [{ ...product, quantity }],
        total: (parseFloat(product.price) * quantity).toFixed(2)
      } 
    });
  };
  
  // Submit review
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newReview.comment && newReview.name && newReview.rating > 0) {
      const currentDate = new Date().toISOString().split('T')[0];
      const review = {
        id: reviews.length + 1,
        ...newReview,
        date: currentDate
      };
      setReviews([review, ...reviews]);
      setNewReview({ rating: 0, comment: '', name: '' });
    }
  };
  
  // Handle star rating click
  const handleStarClick = (rating) => {
    setNewReview({ ...newReview, rating });
  };
  
  // Render stars for rating display
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index}>
        {index < rating ? 
          <AiFillStar className="text-[#f67a45]" /> : 
          <AiOutlineStar className="text-gray-400" />
        }
      </span>
    ));
  };
  
  // Navigate to product page when clicking on a related product
  const handleRelatedProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };
  
  // Go to cart
  const goToCart = () => {
    setShowNotification(false);
    navigate('/store', { state: { activeSection: 'Shopping Cart' } });
  };
  
  if (!product) {
    return <div className="text-white text-center py-20">Loading product...</div>;
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />
      
      {/* Cart notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 animate-fadeIn">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg shadow-lg p-4 backdrop-blur-sm w-80">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <AiOutlineCheckCircle className="text-[#f67a45] text-xl mr-2" />
                <h3 className="text-white font-medium">Added to Cart</h3>
              </div>
              <button 
                onClick={() => setShowNotification(false)}
                className="text-gray-400 hover:text-white"
              >
                <AiOutlineClose />
              </button>
            </div>
            
            <div className="mt-3 flex items-center">
              <div className="w-12 h-12 bg-gray-700/50 rounded mr-3 flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-10 h-10 object-cover" 
                />
              </div>
              <div>
                <p className="text-white text-sm">{product.name}</p>
                <p className="text-[#f67a45] text-sm">Qty: {quantity}</p>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button 
                onClick={goToCart}
                className="flex-1 bg-[#f67a45] text-white text-sm py-2 rounded hover:bg-[#e56d3d] transition-colors"
              >
                View Cart
              </button>
              <button 
                onClick={() => setShowNotification(false)}
                className="flex-1 bg-gray-700/50 text-white text-sm py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto pt-8 px-4 mb-16">
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 text-white flex items-center gap-2 hover:text-[#f67a45]"
        >
          <span>←</span> Back to Store
        </button>
        
        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-8 mb-4">
              <img 
                src={productImages[currentImageIndex]} 
                alt={product.name} 
                className="w-full h-96 object-contain"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex gap-4">
              {productImages.map((img, index) => (
                <div 
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-24 h-24 bg-[#121225] border p-2 rounded-lg cursor-pointer ${
                    currentImageIndex === index ? 'border-[#f67a45]' : 'border-[#f67a45]/30'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-white text-3xl font-bold mb-3">{product.name}</h1>
            
            {/* Rating Summary */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-white">{averageRating.toFixed(1)}/5</span>
              <span className="text-gray-400">({reviews.length} reviews)</span>
            </div>
            
            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
              <span className="text-[#f67a45] text-3xl font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-gray-400 line-through text-lg">${product.originalPrice}</span>
              )}
              {product.discount && (
                <span className="bg-[#e50909] text-white px-2 py-1 text-xs rounded ml-2">
                  {product.discount}% OFF
                </span>
              )}
            </div>
            
            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-white mb-2">Quantity:</label>
              <div className="flex items-center">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-700/50 p-2 rounded-l-full text-white w-10 h-10 flex items-center justify-center"
                >
                  -
                </button>
                <span className="bg-gray-800/50 text-white w-12 h-10 flex items-center justify-center">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-gray-700/50 p-2 rounded-r-full text-white w-10 h-10 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button 
                onClick={toggleFavorite}
                className={`flex items-center gap-2 px-6 py-3 rounded-full ${
                  isFavorite 
                    ? 'bg-[#f67a45]/10 text-[#f67a45] border border-[#f67a45]' 
                    : 'bg-gray-700/50 text-white border border-transparent hover:border-[#f67a45]/50'
                }`}
              >
                {isFavorite ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
                {isFavorite ? 'Saved' : 'Add to Favorites'}
              </button>
              
              <button 
                onClick={addToCart}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-700/50 text-white border border-transparent hover:border-[#f67a45]/50"
              >
                <FiShoppingCart size={20} />
                Add to Cart
              </button>
              
              <button 
                onClick={buyNow}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#f67a45] text-white hover:bg-[#e56d3d]"
              >
                Buy Now
              </button>
            </div>
            
            {/* Product Description */}
            <div className="mb-8">
              <h2 className="text-white text-xl font-bold mb-4">Description</h2>
              <p className="text-white/80 mb-4">{product.description}</p>
              
              {product.features && (
                <div>
                  <h3 className="text-white text-lg font-medium mb-2">Features:</h3>
                  <ul className="list-disc pl-5">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-white/80 mb-1">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Ratings & Reviews Section */}
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-8 mb-16">
          <h2 className="text-white text-xl font-bold mb-6">Ratings & Reviews</h2>
          
          {/* Rating Summary */}
          <div className="flex flex-wrap gap-8 mb-8">
            <div className="text-center">
              <div className="text-[#f67a45] text-4xl font-bold mb-1">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-white/70 text-sm">{reviews.length} reviews</p>
            </div>
            
            <div className="flex-1">
              {/* Rating Distribution Bars */}
              {[5, 4, 3, 2, 1].map(rating => {
                const count = reviews.filter(review => review.rating === rating).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center gap-3 mb-2">
                    <div className="flex gap-1 w-16">
                      <span className="text-white">{rating}</span>
                      <AiFillStar className="text-[#f67a45]" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#f67a45]" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-white w-10">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <hr className="border-gray-700 mb-8" />
          
          {/* Add a Review */}
          <div className="mb-10">
            <h3 className="text-white text-lg font-bold mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-white mb-2">Your Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="text-2xl"
                    >
                      {star <= newReview.rating ? 
                        <AiFillStar className="text-[#f67a45]" /> : 
                        <AiOutlineStar className="text-gray-400" />
                      }
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-white mb-2">Your Name</label>
                <input
                  type="text"
                  value={newReview.name}
                  onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                  className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-white mb-2">Your Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white h-32"
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="px-6 py-3 bg-[#f67a45] text-white rounded-full hover:bg-[#e56d3d]"
              >
                Submit Review
              </button>
            </form>
          </div>
          
          <hr className="border-gray-700 mb-8" />
          
          {/* Reviews List */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6">Customer Reviews</h3>
            
            {reviews.length === 0 ? (
              <p className="text-white/70">No reviews yet. Be the first to review this product!</p>
            ) : (
              <>
                <div className="space-y-6">
                  {reviews
                    .slice(0, showAllReviews ? reviews.length : 3)
                    .map(review => (
                      <div key={review.id} className="border-b border-gray-700 pb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <h4 className="text-white font-medium">{review.name}</h4>
                        </div>
                        <p className="text-white/80 mb-2">{review.comment}</p>
                        <p className="text-gray-400 text-sm">{review.date}</p>
                      </div>
                    ))
                  }
                </div>
                
                {reviews.length > 3 && (
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="mt-6 text-[#f67a45] hover:underline"
                  >
                    {showAllReviews ? 'Show Less' : 'See More'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* You May Also Like Section */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-6">YOU MAY ALSO LIKE</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <div
                key={product.id}
                className="w-full relative origin-top-left rounded outline-1 outline-offset-[-1px] outline-white/30 bg-black/30 backdrop-blur-sm p-4 cursor-pointer"
                onClick={() => handleRelatedProductClick(product)}
              >
                <div className="w-full h-40 bg-gray-700/30 mb-4 rounded-lg flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-medium mb-1">{product.name}</h3>
                  <p className="text-[#f67a45] text-sm">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;