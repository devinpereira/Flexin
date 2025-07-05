import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes, FaEye, FaPrint, FaFileDownload, FaCheckCircle, FaTruck, FaTimesCircle, FaClipboardCheck, FaShippingFast, FaCheck, FaUndo, FaEdit } from 'react-icons/fa';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { useNotification } from '../../../hooks/useNotification';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import { adminOrdersApi } from '../../../api/adminStoreApi';

const Orders = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    returnedOrders: 0,
    refundedOrders: 0,
    canceledOrders: 0,
    totalRevenue: 0
  });

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    type: 'warning'
  });

  // Load orders on component mount and when filters change
  useEffect(() => {
    loadOrders();
    loadAnalytics();
  }, [activeTab, searchQuery, dateRange]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = {
        status: activeTab === 'all' ? '' : activeTab,
        search: searchQuery,
        startDate: dateRange.from,
        endDate: dateRange.to,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        limit: 50
      };

      const response = await adminOrdersApi.getOrders(params);
      if (response.success) {
        // Map backend data to frontend format
        const mappedOrders = response.data.map(order => ({
          id: order.orderNumber,
          orderId: order._id,
          customerName: order.customerInfo?.name || order.userId?.fullName || 'Unknown Customer',
          email: order.customerInfo?.email || order.userId?.email || '',
          date: new Date(order.createdAt).toLocaleDateString(),
          status: order.orderStatus,
          total: order.pricing.totalPrice,
          items: order.items || [],
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          shippingAddress: `${order.shippingAddress?.addressLine1 || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.country || ''}`,
          notes: order.notes?.customerNotes || order.notes?.adminNotes || ''
        }));
        setOrders(mappedOrders);
      }
    } catch (error) {
      showError(error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await adminOrdersApi.getOrderAnalytics('30');
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  // Filter orders based on tab, search, and date range (now handled by backend)
  const filteredOrders = orders;

  // Handle view order details
  const handleViewOrder = (orderNumber) => {
    // Use the actual order ID from the database for navigation
    const order = orders.find(o => o.id === orderNumber);
    if (order && order.orderId) {
      navigate(`/admin/store/orders/${order.orderId}`);
    }
  };

  // Handle status change
  const handleStatusChange = async (orderNumber, newStatus) => {
    const order = orders.find(o => o.id === orderNumber);
    if (!order) return;

    // Create human-readable status names
    const statusLabels = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      canceled: 'Canceled',
      returned: 'Returned',
      refunded: 'Refunded'
    };

    const currentStatusLabel = statusLabels[order.status] || order.status;
    const newStatusLabel = statusLabels[newStatus] || newStatus;

    setConfirmDialog({
      isOpen: true,
      title: 'Update Order Status',
      message: `Are you sure you want to change order ${orderNumber} from "${currentStatusLabel}" to "${newStatusLabel}"?`,
      onConfirm: async () => {
        try {
          const response = await adminOrdersApi.updateOrderStatus(order.orderId, newStatus);
          if (response.success) {
            showSuccess(`Order ${orderNumber} successfully updated to ${newStatusLabel}`);
            loadOrders(); // Reload orders to reflect the change
          }
        } catch (error) {
          showError(error.message || 'Failed to update order status');
        }
      },
      type: 'warning'
    });
  };

  // Export orders data
  const handleExportData = async (format) => {
    try {
      const filters = {
        status: activeTab === 'all' ? '' : activeTab,
        search: searchQuery,
        startDate: dateRange.from,
        endDate: dateRange.to
      };

      const response = await adminOrdersApi.exportOrders(format.toLowerCase(), filters);

      // Create download
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders-${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSuccess(`Orders exported as ${format}`);
    } catch (error) {
      showError(error.message || 'Failed to export orders');

      // Fallback to client-side export
      const data = filteredOrders.map(order => ({
        'Order ID': order.id,
        'Customer': order.customerName,
        'Email': order.email,
        'Date': order.date,
        'Total': order.total,
        'Status': order.status,
        'Payment Status': order.paymentStatus
      }));

      if (format === 'CSV') {
        const csv = convertToCSV(data);
        downloadFile(csv, 'orders.csv', 'text/csv');
      } else if (format === 'JSON') {
        const json = JSON.stringify(data, null, 2);
        downloadFile(json, 'orders.json', 'application/json');
      }
      showSuccess(`Orders exported as ${format} (client-side)`);
    }
  };

  // Convert data to CSV format
  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).join(','));
    return [headers, ...rows].join('\\n');
  };

  // Download file helper
  const downloadFile = (content, fileName, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Handle print orders
  const handlePrintOrders = () => {
    window.print();
  };

  // Clear filters
  const handleClearFilters = () => {
    setDateRange({ from: '', to: '' });
    setSearchQuery('');
    setActiveTab('pending');
    // Orders will reload automatically due to useEffect dependency
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const styles = {
      pending: 'bg-blue-500/20 text-blue-400 border-blue-500',
      confirmed: 'bg-cyan-500/20 text-cyan-400 border-cyan-500',
      processing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      shipped: 'bg-purple-500/20 text-purple-400 border-purple-500',
      delivered: 'bg-green-500/20 text-green-400 border-green-500',
      canceled: 'bg-red-500/20 text-red-400 border-red-500',
      refunded: 'bg-gray-500/20 text-gray-400 border-gray-500',
      returned: 'bg-indigo-500/20 text-indigo-400 border-indigo-500'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Render payment status badge
  const renderPaymentStatus = (status) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      paid: 'bg-green-500/20 text-green-400 border-green-500',
      failed: 'bg-red-500/20 text-red-400 border-red-500',
      refunded: 'bg-gray-500/20 text-gray-400 border-gray-500',
      partially_refunded: 'bg-orange-500/20 text-orange-400 border-orange-500'
    };

    const displayText = status === 'partially_refunded' ? 'Partially Refunded' :
      status.charAt(0).toUpperCase() + status.slice(1);

    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${styles[status] || styles.pending}`}>
        {displayText}
      </span>
    );
  };

  return (
    <AdminLayout pageTitle="View Orders">
      <div className="mb-6">
        <div className="flex border-b border-white/10 overflow-x-auto">
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none whitespace-nowrap ${activeTab === 'pending' ? 'text-[#f67a45] border-b-2 border-[#f67a45]' : 'text-white/70 hover:text-white'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Orders
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none whitespace-nowrap ${activeTab === 'confirmed' ? 'text-[#f67a45] border-b-2 border-[#f67a45]' : 'text-white/70 hover:text-white'}`}
            onClick={() => setActiveTab('confirmed')}
          >
            Confirmed
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none whitespace-nowrap ${activeTab === 'processing' ? 'text-[#f67a45] border-b-2 border-[#f67a45]' : 'text-white/70 hover:text-white'}`}
            onClick={() => setActiveTab('processing')}
          >
            Processing
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none whitespace-nowrap ${activeTab === 'shipped' ? 'text-[#f67a45] border-b-2 border-[#f67a45]' : 'text-white/70 hover:text-white'}`}
            onClick={() => setActiveTab('shipped')}
          >
            Shipped
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none whitespace-nowrap ${activeTab === 'delivered' ? 'text-[#f67a45] border-b-2 border-[#f67a45]' : 'text-white/70 hover:text-white'}`}
            onClick={() => setActiveTab('delivered')}
          >
            Delivered
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none whitespace-nowrap ${activeTab === 'returned' ? 'text-[#f67a45] border-b-2 border-[#f67a45]' : 'text-white/70 hover:text-white'}`}
            onClick={() => setActiveTab('returned')}
          >
            Returned
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none whitespace-nowrap ${activeTab === 'refunded' ? 'text-[#f67a45] border-b-2 border-[#f67a45]' : 'text-white/70 hover:text-white'}`}
            onClick={() => setActiveTab('refunded')}
          >
            Refunded
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none whitespace-nowrap ${activeTab === 'canceled' ? 'text-[#f67a45] border-b-2 border-[#f67a45]' : 'text-white/70 hover:text-white'}`}
            onClick={() => setActiveTab('canceled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 bg-[#121225] border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaSearch className="text-white/50" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintOrders}
              className="bg-[#121225] text-white px-4 py-2 rounded-lg hover:bg-[#1d1d3a] transition-colors flex items-center gap-2"
            >
              <FaPrint /> Print
            </button>
            <button
              onClick={() => handleExportData('CSV')}
              className="bg-[#121225] text-white px-4 py-2 rounded-lg hover:bg-[#1d1d3a] transition-colors flex items-center gap-2"
            >
              <FaFileDownload /> Export
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-[#121225] text-white px-4 py-2 rounded-lg hover:bg-[#1d1d3a] transition-colors flex items-center gap-2"
            >
              {showFilters ? <FaTimes /> : <FaFilter />}
              {showFilters ? 'Hide Filters' : 'Filters'}
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-[#121225] rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Date From</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="w-full bg-[#0A0A1F] border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Date To</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="w-full bg-[#0A0A1F] border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className="bg-[#1d1d3a] text-white px-4 py-2 rounded-lg hover:bg-[#2d2d4a] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#0A0A1F] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#121225]">
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Items</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Total</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="animate-spin h-8 w-8 text-[#f67a45] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-white/70">Loading orders...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <p className="text-white/70">No orders found</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#121225]/50">
                    <td className="px-6 py-4 text-sm text-white">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{order.customerName}</div>
                      <div className="text-xs text-white/70">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">{order.date}</td>
                    <td className="px-6 py-4 text-sm text-white">{order.items.length}</td>
                    <td className="px-6 py-4 text-sm text-white">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      {renderPaymentStatus(order.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {renderStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {/* View Order Button - Always available */}
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="text-[#f67a45] hover:text-[#e56d3d] transition-colors"
                          title="View Order Details"
                        >
                          <FaEye size={16} />
                        </button>

                        {/* Status-specific action buttons */}
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(order.id, 'confirmed')}
                              className="text-green-400 hover:text-green-500 transition-colors"
                              title="Confirm Order"
                            >
                              <FaCheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'canceled')}
                              className="text-red-400 hover:text-red-500 transition-colors"
                              title="Cancel Order"
                            >
                              <FaTimesCircle size={16} />
                            </button>
                          </>
                        )}

                        {order.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(order.id, 'processing')}
                              className="text-yellow-400 hover:text-yellow-500 transition-colors"
                              title="Start Processing"
                            >
                              <FaClipboardCheck size={16} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'canceled')}
                              className="text-red-400 hover:text-red-500 transition-colors"
                              title="Cancel Order"
                            >
                              <FaTimesCircle size={16} />
                            </button>
                          </>
                        )}

                        {order.status === 'processing' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(order.id, 'shipped')}
                              className="text-purple-400 hover:text-purple-500 transition-colors"
                              title="Mark as Shipped"
                            >
                              <FaTruck size={16} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'canceled')}
                              className="text-red-400 hover:text-red-500 transition-colors"
                              title="Cancel Order"
                            >
                              <FaTimesCircle size={16} />
                            </button>
                          </>
                        )}

                        {order.status === 'shipped' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(order.id, 'delivered')}
                              className="text-green-400 hover:text-green-500 transition-colors"
                              title="Mark as Delivered"
                            >
                              <FaCheck size={16} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'returned')}
                              className="text-indigo-400 hover:text-indigo-500 transition-colors"
                              title="Mark as Returned"
                            >
                              <FaUndo size={16} />
                            </button>
                          </>
                        )}

                        {order.status === 'delivered' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(order.id, 'returned')}
                              className="text-indigo-400 hover:text-indigo-500 transition-colors"
                              title="Mark as Returned"
                            >
                              <FaUndo size={16} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'refunded')}
                              className="text-gray-400 hover:text-gray-500 transition-colors"
                              title="Process Refund"
                            >
                              <FaEdit size={16} />
                            </button>
                          </>
                        )}

                        {order.status === 'canceled' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(order.id, 'pending')}
                              className="text-blue-400 hover:text-blue-500 transition-colors"
                              title="Reactivate Order"
                            >
                              <FaUndo size={16} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'refunded')}
                              className="text-gray-400 hover:text-gray-500 transition-colors"
                              title="Process Refund"
                            >
                              <FaEdit size={16} />
                            </button>
                          </>
                        )}

                        {(order.status === 'returned' || order.status === 'refunded') && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'pending')}
                            className="text-blue-400 hover:text-blue-500 transition-colors"
                            title="Reactivate Order"
                          >
                            <FaUndo size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        type={confirmDialog.type}
      />
    </AdminLayout>
  );
};

export default Orders;