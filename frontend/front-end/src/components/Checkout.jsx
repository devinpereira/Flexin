import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { AiOutlineClose } from 'react-icons/ai';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items = [], total = "0.00" } = location.state || {};
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [useNewAddress, setUseNewAddress] = useState(true);
  
  // Form state
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  
  // Demo saved addresses
  const savedAddresses = [
    { id: 1, name: 'Home', address: '123 Main St, Colombo', isDefault: true },
    { id: 2, name: 'Work', address: '456 Business Ave, Kandy', isDefault: false }
  ];
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Process order logic would go here
    alert('Order submitted successfully!');
    navigate('/store');
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />
      
      <div className="container mx-auto pt-8 px-4">
        <h1 className="text-white text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Customer Details */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
              {/* Customer Information */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 mb-6">
                <h2 className="text-white text-xl font-bold mb-4">Customer Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={customerInfo.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={customerInfo.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Shipping Information */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white text-xl font-bold">Shipping Address</h2>
                  <button
                    type="button"
                    className="bg-[#f67a45] text-white px-4 py-2 rounded-md text-sm"
                    onClick={() => setShowAddressModal(true)}
                  >
                    {selectedAddress ? 'Change' : 'Add'} Address
                  </button>
                </div>
                
                {selectedAddress ? (
                  <div className="bg-[#1e1e35] p-4 rounded-lg">
                    <p className="text-white font-medium">{selectedAddress.name}</p>
                    <p className="text-white/70">{selectedAddress.address}</p>
                  </div>
                ) : (
                  <p className="text-white/70">No shipping address selected</p>
                )}
              </div>
              
              {/* Payment Method */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white text-xl font-bold">Payment Method</h2>
                  <button
                    type="button"
                    className="bg-[#f67a45] text-white px-4 py-2 rounded-md text-sm"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    {selectedPayment ? 'Change' : 'Add'} Payment
                  </button>
                </div>
                
                {selectedPayment ? (
                  <div className="bg-[#1e1e35] p-4 rounded-lg">
                    <p className="text-white font-medium">{selectedPayment.type}</p>
                    {selectedPayment.type === 'Card' && (
                      <p className="text-white/70">**** **** **** {selectedPayment.lastFour}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-white/70">No payment method selected</p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#f67a45] text-white py-3 rounded-md hover:bg-[#e56d3d] transition-colors font-medium"
                disabled={!selectedAddress || !selectedPayment}
              >
                Place Order
              </button>
            </form>
          </div>
          
          {/* Right Column - Order Summary */}
          <div>
            <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 sticky top-6">
              <h2 className="text-white text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="max-h-80 overflow-y-auto mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-700/30 rounded-lg mr-3">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-white">{item.name}</p>
                      <div className="flex justify-between">
                        <span className="text-white/70">x{item.quantity}</span>
                        <span className="text-[#f67a45]">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Subtotal:</span>
                  <span className="text-white">${parseFloat(total) - 10.99}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Shipping:</span>
                  <span className="text-white">$10.99</span>
                </div>
                <div className="flex justify-between mt-4">
                  <span className="text-white font-medium">Total:</span>
                  <span className="text-[#f67a45] font-bold text-lg">${total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-xl font-bold">Select Payment Method</h3>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-white/70 hover:text-white"
              >
                <AiOutlineClose size={20} />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <button
                className={`w-full text-left p-4 rounded-lg border ${
                  paymentMethod === 'card' ? 'border-[#f67a45]' : 'border-white/30'
                }`}
                onClick={() => handlePaymentMethodSelect('card')}
              >
                <p className="text-white font-medium">Credit/Debit Card</p>
                <p className="text-white/70 text-sm">Pay with Visa, Mastercard, etc.</p>
              </button>
              
              <button
                className={`w-full text-left p-4 rounded-lg border ${
                  paymentMethod === 'online' ? 'border-[#f67a45]' : 'border-white/30'
                }`}
                onClick={() => handlePaymentMethodSelect('online')}
              >
                <p className="text-white font-medium">Online Payment</p>
                <p className="text-white/70 text-sm">Pay with PayPal, Apple Pay, etc.</p>
              </button>
            </div>
            
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                      placeholder="MM/YY"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                      placeholder="123"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}
            
            <button
              className="w-full mt-6 bg-[#f67a45] text-white py-3 rounded-md hover:bg-[#e56d3d] transition-colors font-medium"
              onClick={() => {
                if (paymentMethod === 'card') {
                  setSelectedPayment({ type: 'Card', lastFour: '4242' });
                } else if (paymentMethod === 'online') {
                  setSelectedPayment({ type: 'Online Payment' });
                }
                setShowPaymentModal(false);
              }}
            >
              Save Payment Method
            </button>
          </div>
        </div>
      )}
      
      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-xl font-bold">Shipping Address</h3>
              <button 
                onClick={() => setShowAddressModal(false)}
                className="text-white/70 hover:text-white"
              >
                <AiOutlineClose size={20} />
              </button>
            </div>
            
            <div className="flex mb-6">
              <button
                className={`flex-1 py-2 ${!useNewAddress ? 'bg-[#f67a45] text-white' : 'bg-transparent text-white/70'}`}
                onClick={() => setUseNewAddress(false)}
              >
                Use Saved Address
              </button>
              <button
                className={`flex-1 py-2 ${useNewAddress ? 'bg-[#f67a45] text-white' : 'bg-transparent text-white/70'}`}
                onClick={() => setUseNewAddress(true)}
              >
                Add New Address
              </button>
            </div>
            
            {!useNewAddress ? (
              <div className="space-y-3">
                {savedAddresses.map(address => (
                  <div
                    key={address.id}
                    className={`p-3 rounded-lg cursor-pointer ${
                      address.isDefault ? 'bg-[#1e1e35] border border-[#f67a45]/30' : 'bg-[#1a1a2f]'
                    }`}
                    onClick={() => setSelectedAddress(address)}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium">{address.name}</p>
                      {address.isDefault && (
                        <span className="text-xs bg-[#f67a45]/20 text-[#f67a45] px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-white/70">{address.address}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Address Name (e.g., Home, Work)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="makeDefault"
                    className="w-4 h-4 accent-[#f67a45]"
                  />
                  <label htmlFor="makeDefault" className="ml-2 text-white">
                    Make this my default address
                  </label>
                </div>
              </div>
            )}
            
            <button
              className="w-full mt-6 bg-[#f67a45] text-white py-3 rounded-md hover:bg-[#e56d3d] transition-colors font-medium"
              onClick={() => {
                if (!useNewAddress) {
                  setSelectedAddress(savedAddresses.find(a => a.isDefault) || savedAddresses[0]);
                } else {
                  // In a real app, you'd save the new address
                  setSelectedAddress({ 
                    id: Date.now(),
                    name: 'New Address', 
                    address: '789 New St, Colombo',
                    isDefault: false
                  });
                }
                setShowAddressModal(false);
              }}
            >
              {useNewAddress ? 'Add Address' : 'Use Selected Address'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;