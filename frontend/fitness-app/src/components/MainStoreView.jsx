import React, { useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const MainStoreView = ({ favorites, onToggleFavorite, onAddToCart }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  // Mock data for banner slides
  const slides = [
    { id: 1, image: "/src/assets/banner1.png" },
    { id: 2, image: "/src/assets/banner2.png" },
    { id: 3, image: "/src/assets/banner3.png" }
  ];

  // Featured products for the grid
  const featuredProducts = [
    { id: 101, name: "Protein Powder", price: 29.99, image: "/src/assets/products/product1.png", discount: 20 },
    { id: 102, name: "Training Gloves", price: 19.99, image: "/src/assets/products/product2.png" },
    { id: 103, name: "Resistance Bands", price: 15.99, image: "/src/assets/products/product3.png", discount: 15 },
    { id: 104, name: "Shaker Bottle", price: 12.99, image: "/src/assets/products/product4.png" },
    { id: 105, name: "Pre-Workout", price: 34.99, image: "/src/assets/products/product5.png", discount: 10 },
    { id: 106, name: "Wrist Wraps", price: 9.99, image: "/src/assets/products/product2.png" },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="pb-12">
      {/* Banner Slider */}
      <div className="relative mb-10">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${
              index === currentSlide ? "block" : "hidden"
            } h-40 md:h-64 lg:h-80 w-full bg-gray-700 rounded-lg overflow-hidden`}
          >
            <img
              src={slide.image}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/src/assets/banner-placeholder.png";
              }}
            />
          </div>
        ))}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 md:p-3 rounded-full hover:bg-black/70 transition-colors z-10"
        >
          {'<'}
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 md:p-3 rounded-full hover:bg-black/70 transition-colors z-10"
        >
          {'>'}
        </button>

        {/* Banner indicator dots */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-[#f67a45]' : 'bg-white/50'}`}
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>
      </div>

      {/* Feature Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-12">
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-xl">
          <div className="w-full h-32 md:h-40 bg-gray-700/30 mb-4 rounded-lg flex items-center justify-center">
            <img src="/src/assets/icon1.png" alt="Icon 1" className="w-12 h-12 md:w-16 md:h-16" />
          </div>
          <h3 className="text-white font-medium text-center">Free shipping</h3>
        </div>
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-xl">
          <div className="w-full h-32 md:h-40 bg-gray-700/30 mb-4 rounded-lg flex items-center justify-center">
            <img src="/src/assets/icon2.png" alt="Icon 2" className="w-12 h-12 md:w-16 md:h-16" />
          </div>
          <h3 className="text-white font-medium text-center">Support 24/7</h3>
        </div>
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-xl">
          <div className="w-full h-32 md:h-40 bg-gray-700/30 mb-4 rounded-lg flex items-center justify-center">
            <img src="/src/assets/icon3.png" alt="Icon 3" className="w-12 h-12 md:w-16 md:h-16" />
          </div>
          <h3 className="text-white font-medium text-center">Money-back guarantee</h3>
        </div>
      </div>

      {/* Product Grid */}
      <div className="mb-8">
        <h2 className="text-white text-xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="relative origin-top-left rounded outline-1 outline-offset-[-1px] outline-white/30 bg-black/30 backdrop-blur-sm p-3 md:p-4 cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              {product.discount && (
                <div className="w-[29px] h-[29px] absolute top-0 right-0 bg-[#e50909] rounded-tr-sm rounded-bl-[7px] flex items-center justify-center text-white text-xs">
                  {product.discount}%
                </div>
              )}
              
              {/* Action buttons group */}
              <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                {/* Favorite heart button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation when clicking this button
                    onToggleFavorite(product);
                  }}
                  className="bg-black/30 rounded-full p-1 transition-colors hover:bg-black/50"
                >
                  {isFavorite(product.id) ? 
                    <AiFillHeart size={18} className="text-[#f67a45]" /> : 
                    <AiOutlineHeart size={18} className="text-white hover:text-[#f67a45]" />
                  }
                </button>
                
                {/* Add to cart button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation when clicking this button
                    onAddToCart(product);
                  }}
                  className="bg-black/30 rounded-full p-1 transition-colors hover:bg-black/50"
                  title="Add to cart"
                >
                  <FiShoppingCart size={18} className="text-white hover:text-[#f67a45]" />
                </button>
              </div>
              
              <div className="w-full h-24 md:h-32 bg-gray-700/30 mb-3 md:mb-4 rounded-lg flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <div className="text-center">
                <h3 className="text-white font-medium text-sm md:text-base mb-1 truncate">{product.name}</h3>
                <p className="text-[#f67a45] text-sm">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All Products Button */}
      <div className="flex justify-center">
        <button className="px-8 py-3 bg-[#f67a45] text-white rounded-full hover:bg-[#e56d3d] transition-colors">
          View All Products
        </button>
      </div>
    </div>
  );
};

export default MainStoreView;