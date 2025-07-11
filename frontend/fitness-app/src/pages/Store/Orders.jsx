import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../../api/storeApi';
import LeftNavigation from '../../components/Store/LeftNavigation';
import Navigation from '../../components/Navigation';

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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
                // Already on orders page, do nothing
                break;
            default:
                navigate('/store');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await ordersApi.getOrders();
            if (response.success) {
                setOrders(response.orders || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter and sort orders
    const filteredOrders = orders
        .filter(order => {
            const matchesSearch = searchTerm === '' ||
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.items?.some(item =>
                    item.productId?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'amount-high':
                    return getOrderTotal(b) - getOrderTotal(a);
                case 'amount-low':
                    return getOrderTotal(a) - getOrderTotal(b);
                default:
                    return 0;
            }
        });

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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleViewOrder = (orderId) => {
        navigate(`/orders/${orderId}`);
    };

    // Helper function to get order total price
    const getOrderTotal = (order) => {
        return order.pricing?.totalPrice || order.totalPrice || 0;
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
                            setActiveView={handleNavigation}
                            onCategorySelect={() => navigate('/store')}
                            cartItemsCount={0}
                            isMobileNavOpen={isMobileNavOpen}
                            setIsMobileNavOpen={setIsMobileNavOpen}
                            onProductClick={() => { }}
                        />

                        {/* Main Content Area */}
                        <div className="flex-1">
                            <div className="flex flex-col items-center justify-center h-64">
                                <div className="w-12 h-12 border-4 border-[#f67a45] border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-white text-lg">Loading your orders...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cover bg-center bg-fixed"
            style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
            <Navigation />

            <div className="container mx-auto pt-8 px-4">
                <div className="flex flex-col lg:flex-row gap-8">
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

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                            <div>
                                <h1 className="text-white text-3xl font-bold mb-2">My Orders</h1>
                                <p className="text-white/70">Track and manage your orders</p>
                            </div>
                            <button
                                onClick={() => navigate('/store')}
                                className="bg-[#f67a45] text-white px-6 py-3 rounded-lg hover:bg-[#e56d3d] transition-colors font-medium mt-4 md:mt-0"
                            >
                                Continue Shopping
                            </button>
                        </div>

                        {/* Filters and Search */}
                        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Search */}
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Search Orders
                                    </label>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#f67a45] transition-colors"
                                        placeholder="Order ID or product name..."
                                    />
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Filter by Status
                                    </label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#121225] border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45] transition-colors"
                                    >
                                        <option value="all">All Orders</option>
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="canceled">Canceled</option>
                                    </select>
                                </div>

                                {/* Sort */}
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Sort by
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#121225] border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45] transition-colors"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="amount-high">Amount (High to Low)</option>
                                        <option value="amount-low">Amount (Low to High)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Orders List */}
                        {filteredOrders.length === 0 ? (
                            <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-12 text-center">
                                <div className="w-24 h-24 bg-[#f67a45]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    📦
                                </div>
                                <h3 className="text-white text-xl font-bold mb-2">
                                    {searchTerm || statusFilter !== 'all' ? 'No matching orders found' : 'No orders yet'}
                                </h3>
                                <p className="text-white/70 mb-6">
                                    {searchTerm || statusFilter !== 'all'
                                        ? 'Try adjusting your search or filter criteria.'
                                        : 'Start shopping to create your first order!'}
                                </p>
                                <button
                                    onClick={() => navigate('/store')}
                                    className="bg-[#f67a45] text-white px-8 py-3 rounded-lg hover:bg-[#e56d3d] transition-colors font-medium"
                                >
                                    Browse Products
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredOrders.map((order) => (
                                    <div key={order._id} className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 hover:bg-[#1a1a35] transition-colors">
                                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                                                    <div>
                                                        <h3 className="text-white font-bold text-lg mb-1">
                                                            Order #{order._id.slice(-8).toUpperCase()}
                                                        </h3>
                                                        <p className="text-white/70 text-sm">
                                                            Placed on {formatDate(order.createdAt)}
                                                        </p>
                                                    </div>

                                                    <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                                                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                                    </div>
                                                </div>

                                                {/* Order Items Preview */}
                                                <div className="mb-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="text-white font-medium">Items ({order.items?.length || 0})</h4>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {order.items?.slice(0, 3).map((item, index) => (
                                                            <div key={index} className="bg-[#1a1a2f] px-3 py-1 rounded-lg">
                                                                <span className="text-white/80 text-sm">
                                                                    {item.productId?.productName || 'Product'} x{item.quantity}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {order.items?.length > 3 && (
                                                            <div className="bg-[#1a1a2f] px-3 py-1 rounded-lg">
                                                                <span className="text-white/80 text-sm">
                                                                    +{order.items.length - 3} more
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                    <div className="text-white">
                                                        <span className="text-lg font-bold text-[#f67a45]">
                                                            ${getOrderTotal(order).toFixed(2)}
                                                        </span>
                                                    </div>

                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => handleViewOrder(order._id)}
                                                            className="bg-[#f67a45] text-white px-6 py-2 rounded-lg hover:bg-[#e56d3d] transition-colors font-medium"
                                                        >
                                                            View Details
                                                        </button>

                                                        {order.orderStatus === 'pending' && (
                                                            <button
                                                                onClick={() => {
                                                                    // Add cancel order functionality if needed
                                                                    console.log('Cancel order:', order._id);
                                                                }}
                                                                className="bg-transparent border border-red-500 text-red-400 px-6 py-2 rounded-lg hover:bg-red-500/10 transition-colors font-medium"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Results Summary */}
                        {filteredOrders.length > 0 && (
                            <div className="mt-6 text-center">
                                <p className="text-white/70">
                                    Showing {filteredOrders.length} of {orders.length} orders
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;
