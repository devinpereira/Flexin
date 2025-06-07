import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
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
    '/src/assets/products/product1.png',
    '/src/assets/products/product2.png',
    '/src/assets/products/product3.png',
    '/src/assets/products/product4.png'
  ];
  
  // Fetch product data if not available from location state
  useEffect(() => {
    if (!product) {
      // In a real app, you'd fetch the product data from your API using the productId
      // For this demo, we'll use some static data
      setProduct({
        id: productId,
        name: "Premium Protein Powder",
        price: "49.99",
        description: "High-quality protein powder for muscle recovery and growth. Our premium blend contains 25g of protein per serving, with minimal carbs and fats. Perfect for post-workout recovery or as a protein-rich snack between meals. Made with 100% whey protein isolate for maximum absorption.",
        features: [
          "25g protein per serving",
          "Low in carbs and fat",
          "Added BCAAs for muscle recovery",
          "No artificial flavors or sweeteners",
          "30 servings per container"
        ],
        specifications: {
          "Weight": "2.5 lbs (1.13 kg)",
          "Flavor": "Chocolate",
          "Protein Source": "Whey Isolate",
          "Protein per Serving": "25g",
          "Servings": "30"
        },
        rating: 4.5,
        reviewCount: 128,
        stock: 15,
        images: productImages
      });
    } else if (!product.images) {
      // If the product doesn't have images from the location state, add some
      setProduct({
        ...product,
        images: productImages
      });
    }
  }, [productId, product]);
  
  // Sample reviews data
  const reviews = [
    { id: 1, name: "John Doe", rating: 5, comment: "Great product! I've been using it for a month and seeing good results.", date: "2023-03-15" },
    { id: 2, name: "Jane Smith", rating: 4, comment: "Good flavor and mixes well. I wish it had a bit more protein per serving.", date: "2023-02-28" },
    { id: 3, name: "Mike Johnson", rating: 5, comment: "Best protein powder I've tried. No clumps and tastes great!", date: "2023-01-10" },
    { id: 4, name: "Sarah Williams", rating: 3, comment: "It's okay. The flavor is a bit too sweet for my taste.", date: "2022-12-05" },
    { id: 5, name: "Chris Brown", rating: 5, comment: "Perfect post-workout supplement. I've noticed faster recovery times.", date: "2022-11-22" }
  ];
  
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
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };
  
  // Handle adding the product to the cart
  const handleAddToCart = () => {
    // In a real app, you'd update your cart state or send the data to your API
    console.log(`Added ${quantity} of ${product.name} to cart`);
    
    // Show notification
    setShowNotification(true);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
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
  const handleSubmitReview = (e) => {
    e.preventDefault();
    // In a real app, you'd send this to your API
    console.log("New review:", newReview);
    
    // Reset the form
    setNewReview({ rating: 0, comment: '', name: '' });
  };
  
  // If product data is still loading
  if (!product) {
    return (
      <div className="container mx-auto mt-10 px-4 text-white">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      
      {/* Back button and navigation */}
      <div className="container mx-auto pt-6 px-4">
        <button
          onClick={handleBack}
          className="text-white mb-6 flex items-center hover:text-[#f67a45] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Store
        </button>
        
        {/* Product Details */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Product Images */}
          <div className="lg:w-1/2">
            <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
              {/* Main product image */}
              <div className="bg-gray-700/30 rounded-lg mb-4 overflow-hidden h-80 flex items-center justify-center">
                <img 
                  src={product.images[currentImageIndex]} 
                  alt={product.name} 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              
              {/* Thumbnail images */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden cursor-pointer ${currentImageIndex === index ? 'ring-2 ring-[#f67a45]' : ''}`}
                    onClick={() => handleImageChange(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - view ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="lg:w-1/2">
            <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
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
                <span className="text-white ml-2">{product.rating}</span>
                <span className="text-gray-400 ml-1">({product.reviewCount} reviews)</span>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                <span className="text-[#f67a45] text-2xl font-bold">${product.price}</span>
              </div>
              
              {/* Description */}
              <p className="text-white mb-6">{product.description}</p>
              
              {/* Features */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-2">Key Features:</h3>
                <ul className="text-white space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <AiOutlineCheckCircle className="text-[#f67a45] mt-1 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Stock */}
              <div className="mb-6">
                <span className="text-white">Availability: </span>
                <span className={product.stock > 0 ? "text-green-500" : "text-red-500"}>
                  {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
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
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                
                <button 
                  className="flex-1 bg-[#f67a45] text-white py-2 px-6 rounded-lg hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-2"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  <FiShoppingCart />
                  <span>Add to Cart</span>
                </button>
                
                <button 
                  className="bg-transparent border border-[#f67a45]/50 text-white p-2 rounded-lg hover:bg-[#f67a45]/10 transition-colors"
                  onClick={handleToggleFavorite}
                >
                  {isFavorite ? (
                    <AiFillHeart className="text-[#f67a45]" size={24} />
                  ) : (
                    <AiOutlineHeart size={24} />
                  )}
                </button>
              </div>
              
              {/* Specifications */}
              <div>
                <h3 className="text-white font-semibold mb-2">Specifications:</h3>
                <div className="bg-[#1a1a2f] rounded-lg overflow-hidden">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <div 
                      key={key}
                      className={`flex py-2 px-4 ${index % 2 === 0 ? 'bg-[#1e1e35]' : ''}`}
                    >
                      <span className="text-gray-400 w-1/3">{key}</span>
                      <span className="text-white w-2/3">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 mb-12">
          <h2 className="text-white text-xl font-bold mb-6">Customer Reviews</h2>
          
          {/* Reviews list */}
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
          <div>
            <h3 className="text-white font-bold mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-white mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={newReview.name}
                  onChange={handleReviewInputChange}
                  className="w-full bg-[#1a1a2f] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-white mb-2">Rating</label>
                <div className="flex text-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleSetRating(star)}
                      className="text-gray-400 hover:text-[#f67a45] focus:outline-none"
                    >
                      {star <= newReview.rating ? (
                        <AiFillStar className="text-[#f67a45]" />
                      ) : (
                        <AiOutlineStar />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-white mb-2">Your Review</label>
                <textarea
                  name="comment"
                  value={newReview.comment}
                  onChange={handleReviewInputChange}
                  className="w-full bg-[#1a1a2f] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45] min-h-[100px]"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="bg-[#f67a45] text-white py-2 px-6 rounded-lg hover:bg-[#e56d3d] transition-colors"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
      
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
  );
};

export default ProductView;
