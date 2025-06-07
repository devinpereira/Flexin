import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';

const MainStoreView = ({ favorites = [], onToggleFavorite, onAddToCart }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      // Simulating API call with setTimeout
      setTimeout(() => {
        const mockProducts = generateMockProducts(12);
        setProducts(mockProducts);
        setFeaturedProducts(mockProducts.slice(0, 5));
        setIsLoading(false);
      }, 500);
      
      // In a real app, you'd fetch from your API:
      // const response = await fetch('/api/products');
      // const data = await response.json();
      // setProducts(data);
      // setIsLoading(false);
    };
    
    fetchProducts();
  }, []);

  // Generate mock product data
  const generateMockProducts = (count) => {
    return Array(count).fill().map((_, i) => ({
      id: `product-${i + 1}`,
      name: `Fitness Product ${i + 1}`,
      category: i % 2 === 0 ? 'Supplements' : 'Equipment',
      price: ((i + 1) * 9.99).toFixed(2),
      rating: (3 + Math.random() * 2).toFixed(1),
      image: `/src/assets/products/product${(i % 5) + 1}.png`
    }));
  };
  
  // Helper function to check if a product is in favorites
  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };
  
  // Handle product click to view details
  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  // Render featured product carousel
  const renderFeaturedProducts = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      );
    }
    
    return (
      <div className="featured-products mb-8">
        <h3 className="text-white text-xl font-bold mb-4">Featured Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {featuredProducts.map(product => (
            <div 
              key={product.id}
              className="bg-black/30 backdrop-blur-sm rounded-lg p-4 cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative">
                <div className="w-full h-40 bg-gray-700/30 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(product);
                  }}
                  className="absolute top-2 left-2 bg-black/30 rounded-full p-2 transition-colors hover:bg-black/50"
                >
                  {isFavorite(product.id) ? 
                    <AiFillHeart size={18} className="text-[#f67a45]" /> : 
                    <AiOutlineHeart size={18} className="text-white" />
                  }
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="absolute top-2 right-2 bg-black/30 rounded-full p-2 transition-colors hover:bg-black/50"
                >
                  <FiShoppingCart size={18} className="text-white" />
                </button>
              </div>
              <h4 className="text-white font-medium truncate">{product.name}</h4>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[#f67a45] font-bold">${product.price}</span>
                <span className="text-white/70 text-sm">{product.rating} ★</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render product grid
  const renderProductGrid = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      );
    }
    
    return (
      <div className="product-grid">
        <h3 className="text-white text-xl font-bold mb-4">All Products</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {products.map(product => (
            <div 
              key={product.id}
              className="bg-black/30 backdrop-blur-sm rounded-lg p-2 sm:p-3 cursor-pointer relative"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative">
                <div className="w-full aspect-square bg-gray-700/30 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(product);
                  }}
                  className="absolute top-1 left-1 bg-black/30 rounded-full p-1 sm:p-2 transition-colors hover:bg-black/50"
                >
                  {isFavorite(product.id) ? 
                    <AiFillHeart size={16} className="text-[#f67a45]" /> : 
                    <AiOutlineHeart size={16} className="text-white" />
                  }
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="absolute top-1 right-1 bg-black/30 rounded-full p-1 sm:p-2 transition-colors hover:bg-black/50"
                >
                  <FiShoppingCart size={16} className="text-white" />
                </button>
              </div>
              <h4 className="text-white text-sm sm:font-medium truncate">{product.name}</h4>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[#f67a45] text-sm sm:font-bold">${product.price}</span>
                <span className="text-white/70 text-xs">{product.rating} ★</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Page Heading */}
      <h2 className="text-white text-2xl font-bold mb-4">Store</h2>
      <hr className="border-gray-600 mb-6" />
      
      {/* Hero Section */}
      <div className="rounded-lg overflow-hidden mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
        <img 
          src="/src/assets/store-banner.jpg" 
          alt="Store Banner" 
          className="w-full h-64 md:h-80 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/1200x400?text=Store+Banner';
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12 z-20">
          <h2 className="text-white text-2xl md:text-4xl font-bold mb-2 md:mb-4">Summer Sale</h2>
          <p className="text-white/90 text-base md:text-xl mb-4 max-w-md">Get up to 40% off on selected fitness products</p>
          <button className="bg-[#f67a45] text-white py-2 px-6 rounded-full w-fit hover:bg-[#e56d3d] transition-colors">
            Shop Now
          </button>
        </div>
      </div>
      
      {/* Featured Products */}
      {renderFeaturedProducts()}
      
      {/* Product Categories */}
      <div className="mb-8">
        <h3 className="text-white text-xl font-bold mb-4">Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 text-center cursor-pointer hover:bg-[#121225] transition-colors">
            <div className="w-12 h-12 bg-[#f67a45]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <img src="/src/assets/icons/supplements.png" alt="Supplements" className="w-6 h-6" />
            </div>
            <h4 className="text-white">Supplements</h4>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 text-center cursor-pointer hover:bg-[#121225] transition-colors">
            <div className="w-12 h-12 bg-[#f67a45]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <img src="/src/assets/icons/equipment.png" alt="Equipment" className="w-6 h-6" />
            </div>
            <h4 className="text-white">Equipment</h4>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 text-center cursor-pointer hover:bg-[#121225] transition-colors">
            <div className="w-12 h-12 bg-[#f67a45]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <img src="/src/assets/icons/apparel.png" alt="Apparel" className="w-6 h-6" />
            </div>
            <h4 className="text-white">Apparel</h4>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 text-center cursor-pointer hover:bg-[#121225] transition-colors">
            <div className="w-12 h-12 bg-[#f67a45]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <img src="/src/assets/icons/accessories.png" alt="Accessories" className="w-6 h-6" />
            </div>
            <h4 className="text-white">Accessories</h4>
          </div>
        </div>
      </div>
      
      {/* All Products */}
      {renderProductGrid()}
    </div>
  );
};

export default MainStoreView;
