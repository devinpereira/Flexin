import React, { useState } from 'react';
import { FiShoppingCart, FiTag, FiX } from 'react-icons/fi';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import { MdKeyboardArrowRight } from 'react-icons/md';

const LeftNavigation = ({ activeView, setActiveView, onCategorySelect, cartItemsCount, isMobileNavOpen, setIsMobileNavOpen }) => {
  const [categoryOpen, setCategoryOpen] = useState(true);
  
  // Categories for products
  const categories = [
    { id: 'supplements', name: 'Supplements', subcategories: ['Protein', 'Pre-Workout', 'Vitamins', 'Weight Gainers'] },
    { id: 'equipment', name: 'Equipment', subcategories: ['Dumbbells', 'Resistance Bands', 'Benches', 'Bars'] },
    { id: 'apparel', name: 'Apparel', subcategories: ['Men\'s', 'Women\'s', 'Footwear', 'Accessories'] },
    { id: 'nutrition', name: 'Nutrition', subcategories: ['Healthy Snacks', 'Meal Replacements', 'Superfoods'] }
  ];
  
  // Toggle category dropdown
  const toggleCategoryDropdown = () => {
    setCategoryOpen(!categoryOpen);
  };
  
  // Handle category click
  const handleCategoryClick = (category) => {
    onCategorySelect(category);
    setIsMobileNavOpen(false);
  };
  
  // Handle view change
  const handleViewChange = (view) => {
    setActiveView(view);
    setIsMobileNavOpen(false);
  };

  return (
    <>
      {/* Mobile Navigation Overlay - Only appears when mobile menu is open */}
      {isMobileNavOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/70 z-30"
          onClick={() => setIsMobileNavOpen(false)}
        ></div>
      )}
      
      {/* Mobile Navigation Toggle Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="bg-[#f67a45] text-white p-4 rounded-full shadow-lg"
        >
          {isMobileNavOpen ? <FiX size={24} /> : <MdKeyboardArrowRight size={24} />}
        </button>
      </div>
      
      {/* Navigation Sidebar - Hidden on mobile unless toggled open */}
      <div className={`fixed lg:relative z-40 lg:z-0 inset-y-0 left-0 w-72 bg-[#121225] border-r border-gray-700 lg:border-none transform ${
        isMobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } transition-transform duration-300 ease-in-out lg:transition-none overflow-y-auto`}>
        
        <div className="p-6">
          {/* Main Navigation Items */}
          <div className="space-y-3 mb-8">
            <button
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${
                activeView === 'main' ? 'bg-[#f67a45] text-white' : 'text-white hover:bg-[#1e1e35]'
              }`}
              onClick={() => handleViewChange('main')}
            >
              <span>Main Store</span>
            </button>
            
            <button
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${
                activeView === 'cart' ? 'bg-[#f67a45] text-white' : 'text-white hover:bg-[#1e1e35]'
              }`}
              onClick={() => handleViewChange('cart')}
            >
              <span>Shopping Cart</span>
              {cartItemsCount > 0 && (
                <span className="bg-[#f67a45] text-white text-xs px-2 py-1 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>
            
            <button
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${
                activeView === 'deals' ? 'bg-[#f67a45] text-white' : 'text-white hover:bg-[#1e1e35]'
              }`}
              onClick={() => handleViewChange('deals')}
            >
              <div className="flex items-center">
                <FiTag className="mr-2" />
                <span>Offers & Deals</span>
              </div>
            </button>
          </div>
          
          {/* Categories Section */}
          <div>
            <div 
              className="flex items-center justify-between text-white mb-4 cursor-pointer"
              onClick={toggleCategoryDropdown}
            >
              <h3 className="font-bold text-lg">Categories</h3>
              {categoryOpen ? <AiFillCaretUp /> : <AiFillCaretDown />}
            </div>
            
            {categoryOpen && (
              <div className="space-y-1">
                {categories.map(category => (
                  <div key={category.id} className="mb-3">
                    <button
                      className="w-full text-left px-4 py-2 rounded-lg text-white hover:bg-[#1e1e35]"
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category.name}
                    </button>
                    
                    <div className="ml-4 mt-1 space-y-1">
                      {category.subcategories.map(sub => (
                        <button
                          key={sub}
                          className="w-full text-left px-4 py-1.5 text-sm rounded-lg text-gray-400 hover:text-white hover:bg-[#1e1e35]"
                          onClick={() => handleCategoryClick({ ...category, selectedSubcategory: sub })}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Cart Button - Mobile Only */}
          <div className="mt-6 lg:hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-[#f67a45] text-white rounded-lg"
              onClick={() => handleViewChange('cart')}
            >
              <div className="flex items-center">
                <FiShoppingCart className="mr-2" />
                <span>View Cart</span>
              </div>
              {cartItemsCount > 0 && (
                <span className="bg-white text-[#f67a45] text-xs px-2 py-1 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftNavigation;
