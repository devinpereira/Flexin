import React, { useState } from 'react';
import { AiOutlineDelete, AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

const ShoppingCartView = ({ cartItems = [], updateCartItem, removeCartItem, onCheckout }) => {
  const [selectedItems, setSelectedItems] = useState(cartItems.map(item => item.id));
  
  // Demo data for shipping cost
  const shippingCost = 10.99;
  
  // Calculate subtotal of selected items
  const calculateSubtotal = () => {
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0)
      .toFixed(2);
  };
  
  // Calculate total including shipping
  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    return (subtotal + (subtotal > 0 ? shippingCost : 0)).toFixed(2);
  };
  
  // Toggle item selection
  const toggleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  // Toggle select all items
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  // Handle quantity change
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      updateCartItem(itemId, newQuantity);
    }
  };
  
  // Handle checkout button
  const handleCheckout = () => {
    onCheckout(selectedItems, calculateTotal());
  };

  return (
    <div>
      {/* Page Heading */}
      <h2 className="text-white text-2xl font-bold mb-4">Shopping Cart</h2>
      <hr className="border-gray-600 mb-6" />

      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-white text-lg mb-4">Your shopping cart is empty.</p>
          <p className="text-white/70">Browse products and add items to your cart.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-1">
            {/* Select all checkbox */}
            <div className="mb-4 flex items-center">
              <input 
                type="checkbox"
                checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                onChange={toggleSelectAll}
                className="w-5 h-5 accent-[#f67a45] mr-3"
              />
              <span className="text-white">Select All Items</span>
            </div>
            
            {cartItems.map(item => (
              <div 
                key={item.id} 
                className={`mb-4 p-4 rounded-lg backdrop-blur-sm ${
                  selectedItems.includes(item.id) 
                    ? 'bg-[#121225] border border-[#f67a45]/30' 
                    : 'bg-black/30'
                }`}
              >
                <div className="flex items-center">
                  {/* Checkbox for selection */}
                  <div className="mr-4">
                    <input 
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="w-5 h-5 accent-[#f67a45]"
                    />
                  </div>
                  
                  {/* Product image */}
                  <div className="w-24 h-24 bg-gray-700/30 rounded-lg mr-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Product details */}
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{item.name}</h3>
                    <p className="text-[#f67a45]">${item.price}</p>
                  </div>
                  
                  {/* Quantity controls */}
                  <div className="flex items-center mr-6">
                    <button 
                      className="bg-gray-700/50 p-1 rounded-full text-white"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <AiOutlineMinus size={16} />
                    </button>
                    <span className="mx-3 text-white">{item.quantity}</span>
                    <button 
                      className="bg-gray-700/50 p-1 rounded-full text-white"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <AiOutlinePlus size={16} />
                    </button>
                  </div>
                  
                  {/* Item total */}
                  <div className="text-white font-medium mr-4">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </div>
                  
                  {/* Remove button */}
                  <button 
                    className="text-gray-400 hover:text-[#f67a45]"
                    onClick={() => removeCartItem(item.id)}
                  >
                    <AiOutlineDelete size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-80 bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 h-fit sticky top-6">
            <h3 className="text-white text-lg font-bold mb-4">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Selected Items:</span>
                <span className="text-white">{selectedItems.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-white/70">Subtotal:</span>
                <span className="text-white">${calculateSubtotal()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-white/70">Shipping:</span>
                <span className="text-white">${selectedItems.length > 0 ? shippingCost.toFixed(2) : '0.00'}</span>
              </div>
              
              <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
                <span className="text-white font-medium">Total:</span>
                <span className="text-[#f67a45] font-bold text-lg">${calculateTotal()}</span>
              </div>
              
              <button 
                className="w-full bg-[#f67a45] text-white py-3 rounded-md hover:bg-[#e56d3d] transition-colors font-medium"
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCartView;
