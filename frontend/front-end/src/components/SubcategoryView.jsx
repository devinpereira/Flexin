import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';

const SubcategoryView = ({ subcategory, favorites = [], onToggleFavorite, onAddToCart }) => {
  const navigate = useNavigate(); // Initialize navigate
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showFlavorDropdown, setShowFlavorDropdown] = useState(false);
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]); // Default min: 0, max: 1000

  // Sample data for sort options
  const brands = ['Brand A', 'Brand B', 'Brand C'];
  const flavors = ['Flavor X', 'Flavor Y', 'Flavor Z'];

  // Helper function to check if a product is in favorites
  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  // Helper function to create product objects with consistent IDs
  const createProduct = (i) => ({
    id: `${subcategory.toLowerCase().replace(/\s+/g, '-')}-product-${i}`,
    name: `${subcategory} ${i + 1}`,
    price: '99.99',
    discount: 30,
    image: `/src/assets/products/product${(i % 5) + 1}.png`
  });

  // Add this function to handle product clicks
  const handleProductClick = (product, e) => {
    // Prevent navigation when clicking action buttons
    if (e.target.closest('button')) return;
    
    navigate(`/product/${product.id}`, { state: { product } });
  };

  // Handle price range change
  const handlePriceChange = (e, index) => {
    const newValue = Number(e.target.value);
    const newRange = [...priceRange];
    newRange[index] = newValue;

    // Ensure min is not greater than max
    if (index === 0 && newValue > priceRange[1]) {
      newRange[0] = priceRange[1];
    } else if (index === 1 && newValue < priceRange[0]) {
      newRange[1] = priceRange[0];
    }

    setPriceRange(newRange);
  };

  // Calculate the position and width of the price range track
  const minPos = (priceRange[0] / 1000) * 100;
  const maxPos = (priceRange[1] / 1000) * 100;

  return (
    <div>
      {/* Subcategory Heading */}
      <h2 className="text-white text-2xl font-bold mb-4">{subcategory}</h2>
      <hr className="border-gray-600 mb-4" />

      {/* Sort Options */}
      <div className="flex gap-8 mb-6">
        {/* Brand */}
        <div className="relative">
          <button
            className="bg-gray-700/50 px-6 py-2 rounded-full text-white hover:bg-gray-600/60 transition-colors"
            onClick={() => setShowBrandDropdown(!showBrandDropdown)}
          >
            Brand
          </button>
          {showBrandDropdown && (
            <div className="absolute top-full left-0 mt-3 w-48 bg-[#121225] border border-[#f67a45]/30 rounded-md shadow-xl p-3 z-20 backdrop-blur-sm animate-fadeIn">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center gap-2 py-2 hover:bg-[#1e1e35] px-3 rounded transition-all">
                  <input 
                    type="checkbox" 
                    id={brand} 
                    className="accent-[#f67a45] w-4 h-4" 
                  />
                  <label htmlFor={brand} className="text-white cursor-pointer">{brand}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Flavor */}
        <div className="relative">
          <button
            className="bg-gray-700/50 px-6 py-2 rounded-full text-white hover:bg-gray-600/60 transition-colors"
            onClick={() => setShowFlavorDropdown(!showFlavorDropdown)}
          >
            Flavor
          </button>
          {showFlavorDropdown && (
            <div className="absolute top-full left-0 mt-3 w-48 bg-[#121225] border border-[#f67a45]/30 rounded-md shadow-xl p-3 z-20 backdrop-blur-sm animate-fadeIn">
              {flavors.map((flavor) => (
                <div key={flavor} className="flex items-center gap-2 py-2 hover:bg-[#1e1e35] px-3 rounded transition-all">
                  <input 
                    type="checkbox" 
                    id={flavor} 
                    className="accent-[#f67a45] w-4 h-4" 
                  />
                  <label htmlFor={flavor} className="text-white cursor-pointer">{flavor}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="relative">
          <button
            className="bg-gray-700/50 px-6 py-2 rounded-full text-white hover:bg-gray-600/60 transition-colors"
            onClick={() => setShowPriceRange(!showPriceRange)}
          >
            Price
          </button>
          {showPriceRange && (
            <div className="absolute top-full left-0 mt-3 w-80 bg-[#121225] border border-[#f67a45]/30 rounded-md shadow-xl p-5 z-20 backdrop-blur-sm animate-fadeIn">
              <div className="flex justify-between text-white mb-6">
                <div className="bg-[#1e1e35] px-3 py-1 rounded">
                  <span>${priceRange[0]}</span>
                </div>
                <div className="bg-[#1e1e35] px-3 py-1 rounded">
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              
              {/* Simplified price slider */}
              <div className="relative h-8 mb-6">
                {/* Track background */}
                <div className="absolute w-full h-2 bg-gray-700/70 rounded-full top-3"></div>
                
                {/* Active range track */}
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
        <div className="grid grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => {
            const product = createProduct(i);
            const productIsFavorite = isFavorite(product.id);
            
            return (
              <div
                key={product.id}
                className="w-[161px] h-[236px] relative origin-top-left rounded outline-1 outline-offset-[-1px] outline-white/30 bg-black/30 backdrop-blur-sm p-4 cursor-pointer"
                onClick={(e) => handleProductClick(product, e)} // Add onClick handler for navigation
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
                      <AiFillHeart size={20} className="text-[#f67a45]" /> : 
                      <AiOutlineHeart size={20} className="text-white hover:text-[#f67a45]" />
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
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 text-white">
        <button className="underline">1</button>
        <button>2</button>
        <button>3</button>
        <button>Next {'>'}</button>
      </div>
    </div>
  );
};

export default SubcategoryView;