import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes, FaEye, FaPrint, FaFileDownload, FaCheckCircle, FaTruck, FaTimesCircle } from 'react-icons/fa';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { useNotification } from '../../../hooks/useNotification';
import ConfirmDialog from '../../../components/ConfirmDialog';

const Orders = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('new');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    type: 'warning'
  });

  // Mock orders data
  const orders = [
    {
      id: 'ORD-2025-001',
      customerName: 'John Smith',
      email: 'john.smith@example.com',
      date: '2025-06-20',
      status: 'new',
      total: 149.97,
      items: [
        { id: 1, name: 'Whey Protein', quantity: 1, price: 49.99 },
        { id: 2, name: 'BCAA Supplement', quantity: 2, price: 29.99 }
      ],
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      shippingAddress: '123 Main St, City, Country',
      notes: 'Priority shipping requested'
    },
    {
      id: 'ORD-2025-002',
      customerName: 'Emily Davis',
      email: 'emily.davis@example.com',
      date: '2025-06-20',
      status: 'processing',
      total: 89.99,
      items: [
        { id: 3, name: 'Yoga Mat', quantity: 1, price: 89.99 }
      ],
      paymentStatus: 'pending',
      paymentMethod: 'bank_transfer',
      shippingAddress: '456 Park Ave, City, Country'
    }
  ];

  // Filter orders based on tab, search, and date range
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === 'all' || order.status === activeTab;

    const matchesDateRange = (!dateRange.from || new Date(order.date) >= new Date(dateRange.from)) &&
      (!dateRange.to || new Date(order.date) <= new Date(dateRange.to));

    return matchesSearch && matchesTab && matchesDateRange;
  });

  // Handle view order details
  const handleViewOrder = (orderId) => {
    navigate(`/admin/store/orders/${orderId}`);
  };

  // Handle status change
  const handleStatusChange = (orderId, newStatus) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Update Order Status',
      message: `Are you sure you want to mark this order as ${newStatus}?`,
      onConfirm: () => {
        // Here you would typically make an API call to update the order status
        showSuccess(`Order ${orderId} marked as ${newStatus}`);
      },
      type: 'warning'
    });
  };

  // Export orders data
  const handleExportData = (format) => {
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

    showSuccess(`Orders exported as ${format}`);
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
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const styles = {
      new: 'bg-blue-500/20 text-blue-400 border-blue-500',
      processing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      shipped: 'bg-purple-500/20 text-purple-400 border-purple-500',
      completed: 'bg-green-500/20 text-green-400 border-green-500',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Render payment status badge
  const renderPaymentStatus = (status) => {
    const styles = {
      paid: 'bg-green-500/20 text-green-400 border-green-500',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      failed: 'bg-red-500/20 text-red-400 border-red-500'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <AdminLayout pageTitle="View Orders">
      <div className="mb-6">
        <div className="flex border-b border-white/10">
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${activeTab === 'new' ? 'text-[#f67a45] border-b-2 border-[#f67a45]' : 'text-white/70 hover:text-white'}`}
            onClick={() => setActiveTab('new')}
          >
            New Orders
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${activeTab === 'processing' ? 'text-[#f67a45] border-b-2 border-[#f67a45]' : 'text-white/70 hover:text-white'}`}
            onClick={() => setActiveTab('processing')}
          >
            Processing
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${activeTab === 'shipped' ? 'text-[#f67a45] border-b-2 border-[#f67a45]' : 'text-white/70 hover:text-white'}`}
            onClick={() => setActiveTab('shipped')}
          >
            Shipped
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${activeTab === 'completed' ? 'text-[#f67a45] border-b-2 border-[#f67a45]' : 'text-white/70 hover:text-white'}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${activeTab === 'cancelled' ? 'text-[#f67a45] border-b-2 border-[#f67a45]' : 'text-white/70 hover:text-white'}`}
            onClick={() => setActiveTab('cancelled')}
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
              {filteredOrders.map((order) => (
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
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleViewOrder(order.id)}
                        className="text-[#f67a45] hover:text-[#e56d3d] transition-colors"
                        title="View Order"
                      >
                        <FaEye size={18} />
                      </button>
                      {order.status === 'new' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'processing')}
                          className="text-yellow-400 hover:text-yellow-500 transition-colors"
                          title="Mark as Processing"
                        >
                          <FaCheckCircle size={18} />
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'shipped')}
                          className="text-purple-400 hover:text-purple-500 transition-colors"
                          title="Mark as Shipped"
                        >
                          <FaTruck size={18} />
                        </button>
                      )}
                      {['new', 'processing'].includes(order.status) && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'cancelled')}
                          className="text-red-400 hover:text-red-500 transition-colors"
                          title="Cancel Order"
                        >
                          <FaTimesCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
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