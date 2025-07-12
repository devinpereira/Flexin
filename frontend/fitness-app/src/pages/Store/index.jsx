import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import MainStoreView from '../../components/Store/MainStoreView';
import ShoppingCartView from '../../components/Store/ShoppingCartView';
import OffersAndDealsView from '../../components/Store/OffersAndDealsView';
import SubcategoryView from '../../components/Store/SubcategoryView';
import LeftNavigation from '../../components/Store/LeftNavigation';
import { recentlyViewedUtils } from '../../utils/recentlyViewed';

const Store = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState('main');
  const [activeCategory, setActiveCategory] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Handle navigation state from other pages
  useEffect(() => {
    if (location.state?.activeView) {
      setActiveView(location.state.activeView);
      // Clear the state to prevent it from persisting on subsequent visits
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.pathname, navigate]);

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

  // Handle product click from recently viewed
  const handleProductClick = (product) => {
    try {
      console.log('Product clicked from recently viewed:', product);

      if (!product || !product.id) {
        console.error('Product is undefined or missing ID!');
        return;
      }

      // Add to recently viewed again to update the timestamp/order
      recentlyViewedUtils.addToRecentlyViewed(product);

      console.log('Navigating to:', `/product/${product.id}`);
      navigate(`/product/${product.id}`, { state: { product } });
    } catch (error) {
      console.error('Error in handleProductClick:', error);
      alert('Error navigating to product page. Please try again.');
    }
  };

  // Render the active view
  const renderView = () => {
    switch (activeView) {
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
        <div className="flex flex-col lg:flex-row">
          {/* Left Navigation - Categories */}
          <LeftNavigation
            activeView={activeView}
            setActiveView={setActiveView}
            onCategorySelect={handleCategorySelect}
            cartItemsCount={cartItems.length}
            isMobileNavOpen={isMobileNavOpen}
            setIsMobileNavOpen={setIsMobileNavOpen}
            onProductClick={handleProductClick}
          />

          {/* Main Content Area with proper spacing for fixed sidebar */}
          <div className="w-full lg:pl-80">
            {renderView()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
