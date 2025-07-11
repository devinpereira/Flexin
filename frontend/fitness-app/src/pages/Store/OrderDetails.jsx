import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersApi } from '../../api/storeApi';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import LeftNavigation from '../../components/Store/LeftNavigation';
import Navigation from '../../components/Navigation';

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    // Helper function to process Cloudinary images (matching ProductView pattern)
    const processCloudinaryImage = (imageData) => {
        if (!imageData) return '/public/default.jpg';

        // If it's an object with url property (Cloudinary format)
        if (typeof imageData === 'object' && imageData.url) {
            return imageData.url;
        }

        // If it's already a full URL, return as is
        if (typeof imageData === 'string' && imageData.startsWith('http')) {
            return imageData;
        }

        // If it's a string (likely a path), return as is
        if (typeof imageData === 'string') {
            return imageData;
        }

        return '/public/default.jpg';
    };

    // Helper function to get product image (matching ProductView pattern)
    const getProductImage = (product) => {
        if (!product) return '/public/default.jpg';

        // If product has images array, use first one
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            return processCloudinaryImage(product.images[0]);
        }

        // If product has a single image property
        if (product.image) {
            return processCloudinaryImage(product.image);
        }

        // Fallback to default image
        return '/public/default.jpg';
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await ordersApi.getOrder(orderId);
            if (response.success) {
                setOrder(response.order);
            } else {
                setError('Order not found');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            setError('Failed to load order details');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'processing':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'shipped':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'delivered':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'canceled':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getStatusSteps = (currentStatus) => {
        const steps = [
            { key: 'pending', label: 'Order Placed', icon: '📝' },
            { key: 'processing', label: 'Processing', icon: '⚙️' },
            { key: 'shipped', label: 'Shipped', icon: '🚚' },
            { key: 'delivered', label: 'Delivered', icon: '📦' }
        ];

        const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
        const currentIndex = statusOrder.indexOf(currentStatus);

        if (currentStatus === 'canceled') {
            return steps.map((step, index) => ({
                ...step,
                status: index === 0 ? 'completed' : 'canceled'
            }));
        }

        return steps.map((step, index) => ({
            ...step,
            status: index <= currentIndex ? 'completed' : 'pending'
        }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateSubtotal = () => {
        if (!order?.pricing) return order?.pricing?.subtotal || 0;
        return order.pricing.subtotal;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cover bg-center bg-fixed"
                style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
                <Navigation />

                <div className="container mx-auto pt-8 px-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Navigation - Categories */}
                        <LeftNavigation
                            activeView="orders"
                            setActiveView={() => { }}
                            onCategorySelect={() => { }}
                            cartItemsCount={0}
                            isMobileNavOpen={isMobileNavOpen}
                            setIsMobileNavOpen={setIsMobileNavOpen}
                            onProductClick={() => { }}
                        />

                        {/* Main Content Area */}
                        <div className="flex-1">
                            <div className="flex flex-col items-center justify-center h-64">
                                <div className="w-12 h-12 border-4 border-[#f67a45] border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-white text-lg">Loading order details...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-cover bg-center bg-fixed"
                style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
                <Navigation />

                <div className="container mx-auto pt-8 px-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Navigation - Categories */}
                        <LeftNavigation
                            activeView="orders"
                            setActiveView={() => { }}
                            onCategorySelect={() => { }}
                            cartItemsCount={0}
                            isMobileNavOpen={isMobileNavOpen}
                            setIsMobileNavOpen={setIsMobileNavOpen}
                            onProductClick={() => { }}
                        />

                        {/* Main Content Area */}
                        <div className="flex-1">
                            <div className="flex flex-col items-center justify-center h-64">
                                <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    ❌
                                </div>
                                <h3 className="text-white text-xl font-bold mb-2">Order Not Found</h3>
                                <p className="text-white/70 mb-6">{error}</p>
                                <button
                                    onClick={() => navigate('/orders')}
                                    className="bg-[#f67a45] text-white px-8 py-3 rounded-lg hover:bg-[#e56d3d] transition-colors font-medium"
                                >
                                    Back to Orders
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const statusSteps = getStatusSteps(order.orderStatus);
    const subtotal = calculateSubtotal();
    const shipping = order.pricing?.shippingCost || 10.99; // Use order shipping cost or fallback
    const total = order.pricing?.totalPrice || order.totalPrice || (subtotal + shipping);

    return (
        <div className="min-h-screen bg-cover bg-center bg-fixed"
            style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
            <Navigation />

            <div className="container mx-auto pt-8 px-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Navigation - Categories */}
                    <LeftNavigation
                        activeView="orders"
                        setActiveView={() => { }}
                        onCategorySelect={() => { }}
                        cartItemsCount={0}
                        isMobileNavOpen={isMobileNavOpen}
                        setIsMobileNavOpen={setIsMobileNavOpen}
                        onProductClick={() => { }}
                    />

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <button
                                onClick={() => navigate('/orders')}
                                className="bg-[#121225] border border-[#f67a45]/30 text-white p-3 rounded-lg hover:bg-[#1a1a35] transition-colors"
                            >
                                <AiOutlineArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-white text-3xl font-bold">
                                    Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                                </h1>
                                <p className="text-white/70">Placed on {formatDate(order.createdAt)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Order Status Progress */}
                                <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-white text-xl font-bold">Order Status</h2>
                                        <div className={`px-4 py-2 rounded-full border text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                        </div>
                                    </div>

                                    {order.orderStatus !== 'canceled' ? (
                                        <div className="relative">
                                            <div className="flex justify-between items-center">
                                                {statusSteps.map((step, index) => (
                                                    <div key={step.key} className="flex flex-col items-center relative">
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${step.status === 'completed'
                                                                ? 'bg-[#f67a45] border-[#f67a45] text-white'
                                                                : 'bg-transparent border-white/30 text-white/50'
                                                            }`}>
                                                            <span className="text-lg">{step.icon}</span>
                                                        </div>
                                                        <span className={`text-sm mt-2 font-medium ${step.status === 'completed' ? 'text-white' : 'text-white/50'
                                                            }`}>
                                                            {step.label}
                                                        </span>

                                                        {index < statusSteps.length - 1 && (
                                                            <div className={`absolute top-6 left-full w-full h-0.5 ${statusSteps[index + 1].status === 'completed'
                                                                    ? 'bg-[#f67a45]'
                                                                    : 'bg-white/20'
                                                                }`} style={{ width: 'calc(100% - 24px)', marginLeft: '12px' }} />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <span className="text-2xl">❌</span>
                                            </div>
                                            <p className="text-red-400 font-medium">This order has been canceled</p>
                                        </div>
                                    )}
                                </div>

                                {/* Order Items */}
                                <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
                                    <h2 className="text-white text-xl font-bold mb-6">Order Items</h2>

                                    <div className="space-y-4">
                                        {order.items?.map((item, index) => (
                                            <div key={index} className="flex items-center gap-4 p-4 bg-[#1a1a2f] rounded-lg">
                                                <div className="w-20 h-20 bg-gray-700/30 rounded-lg overflow-hidden">
                                                    <img
                                                        src={getProductImage(item.productId) || (item.productImage ? processCloudinaryImage(item.productImage) : '/public/default.jpg')}
                                                        alt={item.productName || item.productId?.productName || 'Product'}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = '/public/default.jpg';
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="text-white font-medium text-lg mb-1">
                                                        {item.productName || item.productId?.productName || 'Product Name'}
                                                    </h3>
                                                    <p className="text-white/70 text-sm mb-2">
                                                        {item.productId?.shortDescription || item.productId?.description || 'No description available'}
                                                    </p>
                                                    {item.sku && (
                                                        <p className="text-white/50 text-xs mb-2">SKU: {item.sku}</p>
                                                    )}
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-white/70">Quantity: {item.quantity}</span>
                                                        <span className="text-[#f67a45] font-bold">
                                                            ${(item.totalPrice || ((item.price || item.productId?.price || 0) * item.quantity)).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Information */}
                                <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
                                    <h2 className="text-white text-xl font-bold mb-4">Shipping Information</h2>

                                    <div className="bg-[#1a1a2f] p-4 rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="text-white font-medium mb-2">Delivery Address</h3>
                                                <p className="text-white/70 text-sm">
                                                    {order.shippingAddress?.fullName || 'Customer Name'}<br />
                                                    {order.shippingAddress?.addressLine1 || 'Address Line 1'}<br />
                                                    {order.shippingAddress?.addressLine2 && (
                                                        <>
                                                            {order.shippingAddress.addressLine2}<br />
                                                        </>
                                                    )}
                                                    {order.shippingAddress?.city || 'City'}, {order.shippingAddress?.state || 'State'} {order.shippingAddress?.postalCode || 'ZIP'}<br />
                                                    {order.shippingAddress?.country || 'Country'}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-white font-medium mb-2">Contact Information</h3>
                                                <p className="text-white/70 text-sm">
                                                    Phone: {order.shippingAddress?.phoneNumber || order.customerInfo?.phone || 'Not provided'}<br />
                                                    Email: {order.customerInfo?.email || order.userId?.email || 'Not provided'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Order Status Information */}
                                        <div className="mt-4 pt-4 border-t border-gray-700">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h3 className="text-white font-medium mb-2">Order Status</h3>
                                                    <p className="text-white/70 text-sm">
                                                        Current Status: <span className="text-[#f67a45] font-medium">{order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}</span><br />
                                                        Order Date: {formatDate(order.createdAt)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <h3 className="text-white font-medium mb-2">Payment Information</h3>
                                                    <p className="text-white/70 text-sm">
                                                        Payment Method: {order.paymentMethod?.charAt(0).toUpperCase() + order.paymentMethod?.slice(1).replace('_', ' ') || 'Not specified'}<br />
                                                        Payment Status: <span className="text-[#f67a45] font-medium">{order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}</span><br />
                                                        Total Amount: <span className="text-[#f67a45] font-medium">${order.pricing?.totalPrice?.toFixed(2) || order.totalPrice?.toFixed(2)}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary Sidebar */}
                            <div className="space-y-6">
                                <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 sticky top-6">
                                    <h2 className="text-white text-xl font-bold mb-6">Order Summary</h2>

                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-white/70">Subtotal:</span>
                                            <span className="text-white">${subtotal.toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-white/70">Shipping:</span>
                                            <span className="text-white">${shipping.toFixed(2)}</span>
                                        </div>

                                        {order.pricing?.taxAmount > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-white/70">Tax:</span>
                                                <span className="text-white">${order.pricing.taxAmount.toFixed(2)}</span>
                                            </div>
                                        )}

                                        {order.pricing?.discountAmount > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-white/70">Discount:</span>
                                                <span className="text-green-400">-${order.pricing.discountAmount.toFixed(2)}</span>
                                            </div>
                                        )}

                                        <div className="border-t border-gray-700 pt-4">
                                            <div className="flex justify-between">
                                                <span className="text-white font-medium text-lg">Total:</span>
                                                <span className="text-[#f67a45] font-bold text-xl">${total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-3">
                                        <div className="text-sm text-white/70">
                                            <strong className="text-white">Order Details:</strong><br />
                                            Order ID: {order._id}<br />
                                            Status: <span className="text-[#f67a45]">{order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}</span><br />
                                            Items: {order.items?.length || 0} item(s)
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 space-y-3">
                                        {order.orderStatus === 'pending' && (
                                            <button
                                                onClick={() => {
                                                    // Add cancel order functionality
                                                    console.log('Cancel order:', order._id);
                                                }}
                                                className="w-full bg-transparent border border-red-500 text-red-400 py-3 rounded-lg hover:bg-red-500/10 transition-colors font-medium"
                                            >
                                                Cancel Order
                                            </button>
                                        )}

                                        <button
                                            onClick={() => navigate('/store')}
                                            className="w-full bg-[#f67a45] text-white py-3 rounded-lg hover:bg-[#e56d3d] transition-colors font-medium"
                                        >
                                            Continue Shopping
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
