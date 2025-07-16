import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheck, FiPackage, FiTruck, FiHome, FiCalendar, FiMapPin, FiCreditCard, FiShoppingBag } from 'react-icons/fi';
import Navigation from '../../components/Navigation';
import LeftNavigation from '../../components/Store/LeftNavigation';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const {
        orderId,
        orderDetails,
        customerInfo,
        selectedAddress,
        items = [],
        total = "0.00"
    } = location.state || {};

    // If no order info, redirect to store
    if (!orderId) {
        navigate('/store');
        return null;
    }

    // Handle navigation for LeftNavigation component
    const handleNavigation = (view) => {
        switch (view) {
            case 'main':
                navigate('/store');
                break;
            case 'cart':
                navigate('/store', { state: { activeView: 'cart' } });
                break;
            case 'deals':
                navigate('/store', { state: { activeView: 'deals' } });
                break;
            case 'orders':
                navigate('/orders');
                break;
            default:
                navigate('/store');
        }
    };

    // Calculate estimated delivery date (7 days from now)
    const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const handleContinueShopping = () => {
        navigate('/store');
    };

    const handleViewOrders = () => {
        navigate('/orders');
    };

    const getOrderStatus = () => {
        return [
            { icon: FiCheck, label: 'Confirmed', active: true, completed: true },
            { icon: FiPackage, label: 'Processing', active: false, completed: false },
            { icon: FiTruck, label: 'Shipped', active: false, completed: false },
            { icon: FiHome, label: 'Delivered', active: false, completed: false }
        ];
    };

    return (
        <div className="min-h-screen bg-cover bg-center bg-fixed"
            style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
            <Navigation />

            <div className="container mx-auto pt-4 sm:pt-8 px-4 pb-24 md:pb-8">
                <div className="flex flex-col lg:flex-row">
                    {/* Left Navigation - Categories */}
                    <LeftNavigation
                        activeView="orders"
                        setActiveView={handleNavigation}
                        onCategorySelect={() => navigate('/store')}
                        cartItemsCount={0}
                        isMobileNavOpen={isMobileNavOpen}
                        setIsMobileNavOpen={setIsMobileNavOpen}
                        onProductClick={() => { }}
                    />

                    {/* Main Content Area with proper spacing for fixed sidebar */}
                    <div className="w-full lg:pl-[290px]">
                        <div className="max-w-4xl mx-auto">
                            {/* Success Header */}
                            <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-8 mb-8 text-center">
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FiCheck className="text-green-500 w-10 h-10" />
                                </div>
                                <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">Order received successfully</h1>
                                <p className="text-white/70 text-lg mb-4">Thank you for your purchase, {customerInfo?.firstName}!</p>
                                <div className="bg-[#1a1a2f] rounded-lg p-4 inline-block">
                                    <p className="text-[#f67a45] font-bold text-lg">Order #{orderId}</p>
                                    <p className="text-white/70 text-sm">Order placed on {new Date().toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                {/* Order Status */}
                                <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
                                    <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
                                        <FiPackage className="text-[#f67a45]" />
                                        Order Status
                                    </h2>

                                    <div className="space-y-4">
                                        {getOrderStatus().map((status, index) => {
                                            const Icon = status.icon;
                                            return (
                                                <div key={index} className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${status.completed
                                                        ? 'bg-[#f67a45] text-white'
                                                        : status.active
                                                            ? 'bg-[#f67a45] text-white'
                                                            : 'bg-gray-700 text-white/70'
                                                        }`}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`font-medium ${status.completed || status.active ? 'text-white' : 'text-white/70'
                                                            }`}>
                                                            {status.label}
                                                        </p>
                                                        {status.completed && (
                                                            <p className="text-green-400 text-sm">Completed</p>
                                                        )}
                                                        {status.active && !status.completed && (
                                                            <p className="text-[#f67a45] text-sm">In Progress</p>
                                                        )}
                                                    </div>
                                                    {index < getOrderStatus().length - 1 && (
                                                        <div className={`w-px h-8 ml-5 ${status.completed ? 'bg-[#f67a45]' : 'bg-gray-700'
                                                            }`}></div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Delivery Information */}
                                <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
                                    <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
                                        <FiTruck className="text-[#f67a45]" />
                                        Delivery Information
                                    </h2>

                                    <div className="space-y-4">
                                        <div className="bg-[#1a1a2f] rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <FiCalendar className="text-[#f67a45] w-5 h-5 mt-0.5" />
                                                <div>
                                                    <p className="text-white font-medium">Estimated Delivery</p>
                                                    <p className="text-white/70">
                                                        {estimatedDelivery.toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                    <p className="text-green-400 text-sm mt-1">FREE Delivery</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-[#1a1a2f] rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <FiMapPin className="text-[#f67a45] w-5 h-5 mt-0.5" />
                                                <div>
                                                    <p className="text-white font-medium">Shipping Address</p>
                                                    <p className="text-white/70">{selectedAddress?.fullName}</p>
                                                    <p className="text-white/70">
                                                        {selectedAddress?.addressLine1}
                                                        {selectedAddress?.addressLine2 && `, ${selectedAddress.addressLine2}`}
                                                    </p>
                                                    <p className="text-white/70">
                                                        {selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.postalCode}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 mb-8">
                                <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
                                    <FiShoppingBag className="text-[#f67a45]" />
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-6">
                                    {items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4 bg-[#1a1a2f] rounded-lg p-4">
                                            <div className="w-16 h-16 bg-gray-700/30 rounded-lg flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={item.image || '/public/default.jpg'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/public/default.jpg';
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-white font-medium">{item.name}</h3>
                                                <p className="text-white/70 text-sm">Quantity: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[#f67a45] font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-700 pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white/70">Subtotal:</span>
                                        <span className="text-white">${total}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white/70">Shipping:</span>
                                        <span className="text-green-400">FREE</span>
                                    </div>
                                    <div className="flex justify-between items-center text-lg font-bold border-t border-gray-700 pt-2">
                                        <span className="text-white">Total:</span>
                                        <span className="text-[#f67a45]">${total}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 mb-8">
                                <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                                    <FiCreditCard className="text-[#f67a45]" />
                                    Payment Information
                                </h2>
                                <div className="bg-[#1a1a2f] rounded-lg p-4">
                                    <p className="text-white/70">You will receive a confirmation email once your order is confirmed</p>
                                    <p className="text-white font-medium">{customerInfo?.email}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleContinueShopping}
                                    className="flex-1 bg-[#f67a45] text-white py-3 px-6 rounded-lg hover:bg-[#e56d3d] transition-colors font-medium"
                                >
                                    Continue Shopping
                                </button>

                                <button
                                    onClick={handleViewOrders}
                                    className="flex-1 bg-transparent border border-[#f67a45] text-[#f67a45] py-3 px-6 rounded-lg hover:bg-[#f67a45]/10 transition-colors font-medium"
                                >
                                    View All Orders
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
