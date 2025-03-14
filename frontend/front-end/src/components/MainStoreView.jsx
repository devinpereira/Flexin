import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';

const MainStoreView = ({ favorites = [], onToggleFavorite, onAddToCart }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Helper function to check if a product is in favorites
  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };
  
  // Helper function to create product objects with consistent IDs
  const createProduct = (i, section) => ({
    id: `${section}-product-${i}`,
    name: `Product ${i + 1}`,
    price: '99.99',
    discount: 30,
    image: `/src/assets/products/product${(i % 5) + 1}.png`
  });

  // Navigate to product detail page
  const handleProductClick = (product, e) => {
    // Prevent navigation when clicking action buttons
    if (e.target.closest('button')) return;
    
    navigate(`/product/${product.id}`, { state: { product } });
  };
  
  // Handle image slider navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 5);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 5) % 5);
  };
  
  // Navigate to category pages
  const handleVisitMore = (section) => {
    if (section === 'offers') {
      navigate('/store', { state: { activeSection: 'Offers & Deals' } });
    } else {
      // You can add more navigation logic for other sections
      console.log(`Visit more for ${section}`);
    }
  };

  return (
    <div>
      {/* Image Slider - With functionality */}
      <div className="w-[1220px] h-[357px] relative rounded-xl overflow-hidden bg-black/30 backdrop-blur-sm mb-9">
        <div className="slider h-full">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`slide absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                i === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={`/src/assets/slider/slide${i + 1}.png`}
                alt={`Slide ${i + 1}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/src/assets/no-image.png';
                }}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-10"
        >
          {'<'}
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-10"
        >
          {'>'}
        </button>
      </div>

      {/* Feature Boxes - No changes */}
      <div className="grid grid-cols-3 gap-8 mb-12">
        {/* Existing feature boxes */}
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-xl">
          <div className="w-full h-40 bg-gray-700/30 mb-4 rounded-lg flex items-center justify-center">
            <img src="/src/assets/icon1.png" alt="Icon 1" className="w-16 h-16" />
          </div>
          <div className="text-white text-center font-bold">
            THE LARGEST FITNESS STORE IN SRI LANKA
          </div>
        </div>
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-xl">
          <div className="w-full h-40 bg-gray-700/30 mb-4 rounded-lg flex items-center justify-center">
            <img src="/src/assets/icon2.png" alt="Icon 2" className="w-16 h-16" />
          </div>
          <div className="text-white text-center font-bold">ISLANDWIDE DELIVERY</div>
        </div>
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-xl">
          <div className="w-full h-40 bg-gray-700/30 mb-4 rounded-lg flex items-center justify-center">
            <img src="/src/assets/icon3.png" alt="Icon 3" className="w-16 h-16" />
          </div>
          <div className="text-white text-center font-bold">CASH ON DELIVERY</div>
        </div>
      </div>

      {/* Top Sellers Section - Updated with Add to Cart button */}
      <div className="mb-12">
        <h2 className="text-white text-2xl font-bold mb-6">TOP SELLERS</h2>
        <div className="grid grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => {
            const product = createProduct(i, 'top');
            const productIsFavorite = isFavorite(product.id);
            
            return (
              <div
                key={product.id}
                className="w-[161px] h-[236px] relative origin-top-left rounded outline-1 outline-offset-[-1px] outline-white/30 bg-black/30 backdrop-blur-sm p-4 cursor-pointer"
                onClick={(e) => handleProductClick(product, e)}
              >
                <div className="w-[29px] h-[29px] absolute top-0 right-0 bg-[#e50909] rounded-tr-sm rounded-bl-[7px] flex items-center justify-center text-white text-xs">
                  30%
                </div>
                
                {/* Action buttons group */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                  {/* Favorite heart button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(product);
                    }}
                    className="bg-black/30 rounded-full p-1 transition-colors hover:bg-black/50"
                  >
                    {productIsFavorite ? 
                      <AiFillHeart size={20} className="text-[#f67a45]" /> : 
                      <AiOutlineHeart size={20} className="text-white hover:text-[#f67a45]" />
                    }
                  </button>
                  
                  {/* Add to cart button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="bg-black/30 rounded-full p-1 transition-colors hover:bg-black/50"
                    title="Add to cart"
                  >
                    <FiShoppingCart size={20} className="text-white hover:text-[#f67a45]" />
                  </button>
                </div>
                
                <div className="w-full h-32 bg-gray-700/30 mb-4 rounded-lg flex items-center justify-center">
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
            );
          })}
        </div>
        <div className="flex justify-end mt-6">
          <button 
            onClick={() => handleVisitMore('top')}
            className="bg-[#f67a45] text-white px-6 py-2 rounded-full text-sm hover:bg-[#e56d3d] transition-colors"
          >
            Visit More →
          </button>
        </div>
      </div>

      {/* Offers & Deals Section - Updated with Add to Cart button */}
      <div className="mb-12">
        <h2 className="text-white text-2xl font-bold mb-6">OFFERS & DEALS</h2>
        <div className="grid grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => {
            const product = createProduct(i, 'offers');
            const productIsFavorite = isFavorite(product.id);
            
            return (
              <div
                key={product.id}
                className="w-[161px] h-[236px] relative origin-top-left rounded outline-1 outline-offset-[-1px] outline-white/30 bg-black/30 backdrop-blur-sm p-4 cursor-pointer"
                onClick={(e) => handleProductClick(product, e)}
              >
                <div className="w-[29px] h-[29px] absolute top-0 right-0 bg-[#e50909] rounded-tr-sm rounded-bl-[7px] flex items-center justify-center text-white text-xs">
                  {30 + i}%
                </div>
                
                {/* Action buttons group */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                  {/* Favorite heart button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(product);
                    }}
                    className="bg-black/30 rounded-full p-1 transition-colors hover:bg-black/50"
                  >
                    {productIsFavorite ? 
                      <AiFillHeart size={20} className="text-[#f67a45]" /> : 
                      <AiOutlineHeart size={20} className="text-white hover:text-[#f67a45]" />
                    }
                  </button>
                  
                  {/* Add to cart button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="bg-black/30 rounded-full p-1 transition-colors hover:bg-black/50"
                    title="Add to cart"
                  >
                    <FiShoppingCart size={20} className="text-white hover:text-[#f67a45]" />
                  </button>
                </div>
                
                <div className="w-full h-32 bg-gray-700/30 mb-4 rounded-lg flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-medium mb-1">{product.name}</h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-gray-400 line-through text-xs">$129.99</span>
                    <span className="text-[#f67a45] text-sm">${product.price}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end mt-6">
          <button 
            onClick={() => handleVisitMore('offers')}
            className="bg-[#f67a45] text-white px-6 py-2 rounded-full text-sm hover:bg-[#e56d3d] transition-colors"
          >
            Visit More →
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainStoreView;