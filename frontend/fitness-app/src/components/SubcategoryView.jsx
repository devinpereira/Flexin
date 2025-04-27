import React, { useState } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const SubcategoryView = ({ subcategory, favorites, onToggleFavorite, onAddToCart }) => {
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Calculate position in percentage for range sliders
  const minPos = (priceRange[0] / 1000) * 100;
  const maxPos = (priceRange[1] / 1000) * 100;

  // Function to check if product is in favorites
  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  // Function to handle price range changes
  const handlePriceChange = (e, index) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => {
      const newRange = [...prev];
      newRange[index] = value;
      // Make sure min <= max
      if (index === 0 && value > newRange[1]) newRange[1] = value;
      if (index === 1 && value < newRange[0]) newRange[0] = value;
      return newRange;
    });
  };

  // Generate sample products based on subcategory
  const createProduct = (index) => {
    return {
      id: `${subcategory}-${index}`,
      name: `${subcategory} Item ${index + 1}`,
      price: Math.floor(Math.random() * 50) + 20,
      image: `/src/assets/products/product${(index % 5) + 1}.png`,
    };
  };

  // Handle product click navigation
  const handleProductClick = (product, e) => {
    navigate(`/product/${product.id}`);
  };

  // Sample brand and categories for filters
  const brands = ['Brand A', 'Brand B', 'Brand C', 'Brand D'];
  const categories = ['Category X', 'Category Y', 'Category Z'];

  return (
    <div className="pb-12">
      {/* Page Header */}
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4">{subcategory}</h2>
      <p className="text-gray-300 mb-6">Browse our collection of premium {subcategory.toLowerCase()}</p>
      <hr className="border-gray-600 mb-6" />

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        {/* Brand Filter */}
        <div className="relative">
          <button
            className="bg-gray-700/50 px-4 py-2 rounded-full text-white hover:bg-gray-600/60 transition-colors"
            onClick={() => {
              setShowBrandDropdown(!showBrandDropdown);
              setShowPriceRange(false);
              setShowCategoryDropdown(false);
            }}
          >
            Brand
          </button>
          {showBrandDropdown && (
            <div className="absolute top-full left-0 mt-3 w-48 bg-[#121225] border border-[#f67a45]/30 rounded-md shadow-xl p-3 z-20 backdrop-blur-sm animate-fadeIn">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center gap-2 py-2 hover:bg-[#1e1e35] px-3 rounded transition-all">
                  <input 
                    type="checkbox" 
                    id={`brand-${brand}`} 
                    className="accent-[#f67a45] w-4 h-4" 
                  />
                  <label htmlFor={`brand-${brand}`} className="text-white cursor-pointer">{brand}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="relative">
          <button
            className="bg-gray-700/50 px-4 py-2 rounded-full text-white hover:bg-gray-600/60 transition-colors"
            onClick={() => {
              setShowCategoryDropdown(!showCategoryDropdown);
              setShowBrandDropdown(false);
              setShowPriceRange(false);
            }}
          >
            Category
          </button>
          {showCategoryDropdown && (
            <div className="absolute top-full left-0 mt-3 w-48 bg-[#121225] border border-[#f67a45]/30 rounded-md shadow-xl p-3 z-20 backdrop-blur-sm animate-fadeIn">
              {categories.map((category) => (
                <div key={category} className="flex items-center gap-2 py-2 hover:bg-[#1e1e35] px-3 rounded transition-all">
                  <input 
                    type="checkbox" 
                    id={`category-${category}`} 
                    className="accent-[#f67a45] w-4 h-4" 
                  />
                  <label htmlFor={`category-${category}`} className="text-white cursor-pointer">{category}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div className="relative">
          <button
            className="bg-gray-700/50 px-4 py-2 rounded-full text-white hover:bg-gray-600/60 transition-colors"
            onClick={() => {
              setShowPriceRange(!showPriceRange);
              setShowBrandDropdown(false);
              setShowCategoryDropdown(false);
            }}
          >
            Price
          </button>
          {showPriceRange && (
            <div className="absolute top-full left-0 mt-3 w-64 md:w-80 bg-[#121225] border border-[#f67a45]/30 rounded-md shadow-xl p-5 z-20 backdrop-blur-sm animate-fadeIn">
              <div className="flex justify-between text-white mb-6">
                <div className="bg-[#1e1e35] px-3 py-1 rounded">
                  <span>${priceRange[0]}</span>
                </div>
                <div className="bg-[#1e1e35] px-3 py-1 rounded">
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              
              {/* Price slider */}
              <div className="relative h-8 mb-6">
                <div className="absolute w-full h-2 bg-gray-700/70 rounded-full top-3"></div>
                <div 
                  className="absolute h-2 bg-gradient-to-r from-[#f67a45] to-[#f67a45] rounded-full top-3" 
                  style={{ left: `${minPos}%`, width: `${maxPos - minPos}%` }}
                ></div>
                
                {/* Min thumb - positioned on left */}
                <div
                  className="absolute top-1.5 w-5 h-5 bg-white rounded-full shadow-lg cursor-pointer"
                  style={{ left: `calc(${minPos}% - 10px)` }}
                >
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="absolute opacity-0 w-5 h-5 cursor-pointer"
                  />
                </div>
                
                {/* Max thumb - positioned on right */}
                <div
                  className="absolute top-1.5 w-5 h-5 bg-white rounded-full shadow-lg cursor-pointer"
                  style={{ left: `calc(${maxPos}% - 10px)` }}
                >
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="absolute opacity-0 w-5 h-5 cursor-pointer"
                  />
                </div>
              </div>
              
              {/* Apply button */}
              <button 
                className="w-full mt-3 bg-[#f67a45] text-white py-2 rounded-md hover:bg-[#e56d3d] transition-colors font-medium"
                onClick={() => setShowPriceRange(false)}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      <hr className="border-gray-600 mb-6" />

      <p className="text-center text-white mb-4">10 results shown</p>

      {/* Products Grid */}
      <div className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {[...Array(10)].map((_, i) => {
            const product = createProduct(i);
            const productIsFavorite = isFavorite(product.id);
            
            return (
              <div
                key={product.id}
                className="w-full relative rounded outline-1 outline-offset-[-1px] outline-white/30 bg-black/30 backdrop-blur-sm p-3 md:p-4 cursor-pointer"
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
                      e.stopPropagation(); // Prevent navigation when clicking this button
                      onToggleFavorite(product);
                    }}
                    className="bg-black/30 rounded-full p-1 transition-colors hover:bg-black/50"
                  >
                    {productIsFavorite ? 
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
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-medium text-sm md:text-base mb-1 truncate">{product.name}</h3>
                  <p className="text-[#f67a45] text-sm">${product.price}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 text-white">
        <button className="underline w-8 h-8 flex items-center justify-center">1</button>
        <button className="w-8 h-8 flex items-center justify-center">2</button>
        <button className="w-8 h-8 flex items-center justify-center">3</button>
        <button className="flex items-center justify-center">Next {'>'}</button>
      </div>
    </div>
  );
};

export default SubcategoryView;