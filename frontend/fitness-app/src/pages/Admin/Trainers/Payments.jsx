import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDownload, FaEye, FaFilter, FaCheck, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { useNotification } from '../../../hooks/useNotification';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';

const Payments = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });

  // State for confirm dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });

  // Mock data for payments
  const allPayments = [
    {
      id: 'PMT-12345',
      trainerId: 1,
      trainerName: 'John Smith',
      amount: 850.50,
      currency: 'USD',
      status: 'pending',
      dueDate: '2023-10-30',
      invoiceDate: '2023-10-15',
      paymentMethod: null,
      services: [
        { description: 'Personal Training Sessions', hours: 12, rate: 65, amount: 780 },
        { description: 'Client Consultations', hours: 1.5, rate: 47, amount: 70.50 }
      ],
      notes: 'October 2023 services'
    },
    {
      id: 'PMT-12346',
      trainerId: 2,
      trainerName: 'Sarah Johnson',
      amount: 605.00,
      currency: 'USD',
      status: 'completed',
      dueDate: '2023-10-15',
      invoiceDate: '2023-10-01',
      paymentDate: '2023-10-14',
      paymentMethod: 'bank_transfer',
      transactionId: 'TRX-67890',
      services: [
        { description: 'Yoga Classes', hours: 11, rate: 55, amount: 605 }
      ],
      notes: 'October 2023 services - first half'
    },
    {
      id: 'PMT-12347',
      trainerId: 3,
      trainerName: 'Michael Williams',
      amount: 320.00,
      currency: 'USD',
      status: 'completed',
      dueDate: '2023-10-10',
      invoiceDate: '2023-09-30',
      paymentDate: '2023-10-08',
      paymentMethod: 'paypal',
      transactionId: 'PP-2468135',
      services: [
        { description: 'Weight Loss Program', hours: 8, rate: 40, amount: 320 }
      ],
      notes: 'September 2023 services - final payment'
    },
    {
      id: 'PMT-12348',
      trainerId: 4,
      trainerName: 'Emily Davis',
      amount: 705.00,
      currency: 'USD',
      status: 'overdue',
      dueDate: '2023-10-05',
      invoiceDate: '2023-09-20',
      paymentMethod: null,
      services: [
        { description: 'Nutrition Consultations', hours: 10, rate: 47, amount: 470 },
        { description: 'Meal Plan Development', hours: 5, rate: 47, amount: 235 }
      ],
      notes: 'September 2023 services - payment reminder sent'
    },
    {
      id: 'PMT-12349',
      trainerId: 1,
      trainerName: 'John Smith',
      amount: 780.00,
      currency: 'USD',
      status: 'completed',
      dueDate: '2023-09-30',
      invoiceDate: '2023-09-15',
      paymentDate: '2023-09-28',
      paymentMethod: 'bank_transfer',
      transactionId: 'TRX-54321',
      services: [
        { description: 'Personal Training Sessions', hours: 12, rate: 65, amount: 780 }
      ],
      notes: 'September 2023 services'
    },
    {
      id: 'PMT-12350',
      trainerId: 5,
      trainerName: 'David Brown',
      amount: 430.00,
      currency: 'USD',
      status: 'rejected',
      dueDate: '2023-10-20',
      invoiceDate: '2023-10-10',
      rejectionReason: 'Hours misreported - requires correction',
      services: [
        { description: 'HIIT Classes', hours: 10, rate: 43, amount: 430 }
      ],
      notes: 'October 2023 services - first half'
    }
  ];

  // Filter payments based on active tab
  const filteredPayments = allPayments
    .filter(payment => {
      if (activeTab === 'all') return true;
      return payment.status === activeTab;
    })
    .filter(payment => {
      // Filter by date range if provided
      if (dateRange.from && dateRange.to) {
        const paymentDate = new Date(payment.invoiceDate);
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        return paymentDate >= fromDate && paymentDate <= toDate;
      }
      return true;
    })
    .filter(payment => {
      // Filter by search query
      if (!searchQuery) return true;
      return (
        payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.trainerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.notes.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  // Counts for the tabs
  const counts = {
    all: allPayments.length,
    pending: allPayments.filter(p => p.status === 'pending').length,
    completed: allPayments.filter(p => p.status === 'completed').length,
    overdue: allPayments.filter(p => p.status === 'overdue').length,
    rejected: allPayments.filter(p => p.status === 'rejected').length
  };

  // Handle view payment details
  const handleViewPayment = (payment) => {
    // In a real application, this would navigate to a detailed view
    console.log('View payment details:', payment);
  };

  // Handle approve payment
  const handleApprovePayment = (payment) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Approve Payment',
      message: `Are you sure you want to approve payment ${payment.id} for ${payment.trainerName} (${payment.currency} ${payment.amount})?`,
      onConfirm: () => {
        showSuccess(`Payment ${payment.id} has been approved`);
        // Here you would make an API call to update the payment status
      }
    });
  };

  // Handle reject payment
  const handleRejectPayment = (payment) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reject Payment',
      message: `Are you sure you want to reject payment ${payment.id} for ${payment.trainerName}?`,
      type: 'danger',
      onConfirm: () => {
        showError(`Payment ${payment.id} has been rejected`);
        // Here you would make an API call to update the payment status
      }
    });
  };

  // Export payments data
  const handleExportData = (format) => {
    showSuccess(`Payments data exported as ${format.toUpperCase()}`);
    // Here you would implement the actual export functionality
  };

  // Handle date range filter changes
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Clear filters
  const handleClearFilters = () => {
    setDateRange({
      from: '',
      to: ''
    });
    setSearchQuery('');
  };

  // Function to render status badge
  const renderStatusBadge = (status) => {
    let badgeClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'pending':
        badgeClasses += ' bg-blue-500/20 text-blue-400';
        return <span className={badgeClasses}>Pending</span>;
      case 'completed':
        badgeClasses += ' bg-green-500/20 text-green-400';
        return <span className={badgeClasses}>Completed</span>;
      case 'overdue':
        badgeClasses += ' bg-yellow-500/20 text-yellow-400';
        return <span className={badgeClasses}>Overdue</span>;
      case 'rejected':
        badgeClasses += ' bg-red-500/20 text-red-400';
        return <span className={badgeClasses}>Rejected</span>;
      default:
        return <span className={badgeClasses + ' bg-gray-500/20 text-gray-400'}>{status}</span>;
    }
  };

  return (
    <AdminLayout pageTitle="Trainer Payments">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search payments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 bg-[#121225] border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 bg-[#1A1A2F] text-white rounded-lg flex items-center gap-2 hover:bg-[#232342] transition-colors"
            >
              <FaFilter size={14} /> Filters
            </button>
            <button
              onClick={() => handleExportData('csv')}
              className="px-3 py-2 bg-[#1A1A2F] text-white rounded-lg flex items-center gap-2 hover:bg-[#232342] transition-colors"
            >
              <FaDownload size={14} /> Export
            </button>
          </div>
        </div>

        {/* Filter options */}
        {showFilters && (
          <div className="mt-4 p-4 bg-[#0A0A1F] rounded-lg border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">From Date</label>
                <div className="relative">
                  <input
                    type="date"
                    name="from"
                    value={dateRange.from}
                    onChange={handleDateRangeChange}
                    className="bg-[#121225] border border-white/20 rounded-lg py-2 px-4 text-white w-full sm:w-auto focus:outline-none focus:border-[#f67a45]"
                  />
                  <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">To Date</label>
                <div className="relative">
                  <input
                    type="date"
                    name="to"
                    value={dateRange.to}
                    onChange={handleDateRangeChange}
                    className="bg-[#121225] border border-white/20 rounded-lg py-2 px-4 text-white w-full sm:w-auto focus:outline-none focus:border-[#f67a45]"
                  />
                  <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleClearFilters}
                  className="bg-[#121225] border border-white/20 rounded-lg py-2 px-4 text-white hover:bg-[#232342] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'all' ? 'bg-[#f67a45] text-white' : 'bg-[#1A1A2F] text-white/70 hover:text-white'
            }`}
        >
          All <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">{counts.all}</span>
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'pending' ? 'bg-[#f67a45] text-white' : 'bg-[#1A1A2F] text-white/70 hover:text-white'
            }`}
        >
          Pending <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">{counts.pending}</span>
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'completed' ? 'bg-[#f67a45] text-white' : 'bg-[#1A1A2F] text-white/70 hover:text-white'
            }`}
        >
          Completed <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">{counts.completed}</span>
        </button>
        <button
          onClick={() => setActiveTab('overdue')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'overdue' ? 'bg-[#f67a45] text-white' : 'bg-[#1A1A2F] text-white/70 hover:text-white'
            }`}
        >
          Overdue <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">{counts.overdue}</span>
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'rejected' ? 'bg-[#f67a45] text-white' : 'bg-[#1A1A2F] text-white/70 hover:text-white'
            }`}
        >
          Rejected <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">{counts.rejected}</span>
        </button>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="bg-[#0A0A1F] rounded-lg p-8 text-center">
          <p className="text-white/70 text-lg">No payments found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#121225] rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#1A1A2F] text-white/70">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Trainer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-[#1A1A2F]">
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {payment.trainerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {payment.currency} {payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white/70">
                    <div>{payment.invoiceDate}</div>
                    <div className="text-xs text-white/50">Due: {payment.dueDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewPayment(payment)}
                        className="text-white/70 hover:text-white transition-colors"
                        title="View Details"
                      >
                        <FaEye size={16} />
                      </button>

                      {payment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprovePayment(payment)}
                            className="text-green-400 hover:text-green-500 transition-colors"
                            title="Approve Payment"
                          >
                            <FaCheck size={16} />
                          </button>
                          <button
                            onClick={() => handleRejectPayment(payment)}
                            className="text-red-400 hover:text-red-500 transition-colors"
                            title="Reject Payment"
                          >
                            <FaTimes size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        type={confirmDialog.type || 'warning'}
      />
    </AdminLayout>
  );
};

export default Payments;