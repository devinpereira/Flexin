import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import MainStoreView from '../../components/Store/MainStoreView';
import ShoppingCartView from '../../components/Store/ShoppingCartView';
import OffersAndDealsView from '../../components/Store/OffersAndDealsView';
import SubcategoryView from '../../components/Store/SubcategoryView';
import LeftNavigation from '../../components/Store/LeftNavigation';

const Store = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('main');
  const [activeCategory, setActiveCategory] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  // Fetch cart items from local storage on component mount
  useEffect(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
    
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);
  
  // Save cart items to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Save favorites to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  // Handle toggling favorites
  const handleToggleFavorite = (product) => {
    const isFavorite = favorites.some(item => item.id === product.id);
    
    if (isFavorite) {
      setFavorites(favorites.filter(item => item.id !== product.id));
    } else {
      setFavorites([...favorites, product]);
    }
  };
  
  // Handle adding product to cart
  const handleAddToCart = (product, quantity = 1) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
  };
  
  // Handle updating cart item quantity
  const handleUpdateCartItem = (productId, newQuantity) => {
    const updatedCartItems = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCartItems);
  };
  
  // Handle removing item from cart
  const handleRemoveCartItem = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };
  
  // Handle checkout process
  const handleCheckout = (selectedItems, total) => {
    // Filter cart items to only include selected items
    const itemsToCheckout = cartItems.filter(item => 
      selectedItems.includes(item.id)
    );
    
    // Navigate to checkout page with items and total
    navigate('/checkout', { 
      state: { 
        items: itemsToCheckout,
        total: total
      }
    });
  };
  
  // Handle category selection
  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setActiveView('subcategory');
    setIsMobileNavOpen(false);
  };
  
  // Render the active view
  const renderView = () => {
    switch(activeView) {
      case 'cart':
        return (
          <ShoppingCartView 
            cartItems={cartItems}
            updateCartItem={handleUpdateCartItem}
            removeCartItem={handleRemoveCartItem}
            onCheckout={handleCheckout}
          />
        );
      case 'deals':
        return (
          <OffersAndDealsView 
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
          />
        );
      case 'subcategory':
        return (
          <SubcategoryView 
            category={activeCategory}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
          />
        );
      case 'main':
      default:
        return (
          <MainStoreView 
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />
      
      <div className="container mx-auto pt-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Navigation - Categories */}
          <LeftNavigation
            activeView={activeView}
            setActiveView={setActiveView}
            onCategorySelect={handleCategorySelect}
            cartItemsCount={cartItems.length}
            isMobileNavOpen={isMobileNavOpen}
            setIsMobileNavOpen={setIsMobileNavOpen}
          />
          
          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden">
            {renderView()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
