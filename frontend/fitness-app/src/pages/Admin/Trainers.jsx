import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Admin/AdminLayout';
import { useNotification } from '../../hooks/useNotification';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  FaUserPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheck,
  FaTimes,
  FaUserFriends,
  FaUserCheck,
  FaMoneyBillWave,
  FaChartLine,
  FaUserEdit,
  FaFilter
} from 'react-icons/fa';

const Trainers = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useNotification();

  // State for confirm dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });

  // Navigation links for trainer management
  const trainerManagementLinks = [
    {
      title: 'View Trainers',
      path: '/admin/trainers',
      description: 'Manage all trainer profiles',
      icon: <FaUserFriends className="text-[#f67a45]" size={24} />
    },
    {
      title: 'Add New Trainer',
      path: '/admin/trainers/edit-trainer',
      description: 'Create new trainer profiles',
      icon: <FaUserEdit className="text-[#f67a45]" size={24} />
    },
    {
      title: 'Approve Applications',
      path: '/admin/trainers/approve-trainers',
      description: 'Review trainer applications',
      icon: <FaUserCheck className="text-[#f67a45]" size={24} />
    },
    {
      title: 'Manage Payments',
      path: '/admin/trainers/payments',
      description: 'Process trainer payments',
      icon: <FaMoneyBillWave className="text-[#f67a45]" size={24} />
    },
    {
      title: 'Performance Reports',
      path: '/admin/trainers/reports',
      description: 'View trainer statistics',
      icon: <FaChartLine className="text-[#f67a45]" size={24} />
    }
  ];

  // Mock data for trainers
  const allTrainers = [
    {
      id: 1,
      name: 'John Smith',
      specialty: 'Strength & Conditioning',
      experience: '8 years',
      clients: 24,
      rating: 4.8,
      status: 'active',
      email: 'john.smith@example.com',
      phone: '+1 555-123-4567',
      verified: true
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      specialty: 'Yoga & Flexibility',
      experience: '5 years',
      clients: 18,
      rating: 4.5,
      status: 'active',
      email: 'sarah.johnson@example.com',
      phone: '+1 555-234-5678',
      verified: true
    },
    {
      id: 3,
      name: 'Michael Williams',
      specialty: 'Weight Loss',
      experience: '3 years',
      clients: 12,
      rating: 4.2,
      status: 'active',
      email: 'michael.williams@example.com',
      phone: '+1 555-345-6789',
      verified: true
    },
    {
      id: 4,
      name: 'Emily Davis',
      specialty: 'Nutrition',
      experience: '6 years',
      clients: 15,
      rating: 4.7,
      status: 'inactive',
      email: 'emily.davis@example.com',
      phone: '+1 555-456-7890',
      verified: true
    },
    {
      id: 5,
      name: 'David Brown',
      specialty: 'Cardio & HIIT',
      experience: '4 years',
      clients: 10,
      rating: 4.3,
      status: 'pending',
      email: 'david.brown@example.com',
      phone: '+1 555-567-8901',
      verified: false
    },
    {
      id: 6,
      name: 'Jessica Wilson',
      specialty: 'Pilates',
      experience: '7 years',
      clients: 20,
      rating: 4.9,
      status: 'pending',
      email: 'jessica.wilson@example.com',
      phone: '+1 555-678-9012',
      verified: false
    }
  ];

  // Filter trainers based on active tab and search query
  const filteredTrainers = allTrainers
    .filter(trainer => {
      if (activeTab === 'all') return true;
      return trainer.status === activeTab;
    })
    .filter(trainer =>
      trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Counts for the tabs
  const counts = {
    all: allTrainers.length,
    active: allTrainers.filter(t => t.status === 'active').length,
    inactive: allTrainers.filter(t => t.status === 'inactive').length,
    pending: allTrainers.filter(t => t.status === 'pending').length
  };

  // Handle view trainer action
  const handleViewTrainer = (trainer) => {
    navigate(`/admin/trainers/edit-trainer?id=${trainer.id}`);
  };

  // Handle edit action
  const handleEditTrainer = (trainer) => {
    navigate(`/admin/trainers/edit-trainer?id=${trainer.id}`);
  };

  // Handle delete action with confirmation dialog
  const handleDeleteTrainer = (trainer) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Trainer',
      message: `Are you sure you want to delete ${trainer.name}'s account? This cannot be undone.`,
      onConfirm: () => {
        // In a real app this would be an API call
        showSuccess(`Trainer ${trainer.name} has been deleted.`);
      }
    });
  };

  // Handle status change with confirmation dialog
  const handleStatusChange = (trainer, newStatus) => {
    let title, message;

    if (newStatus === 'active') {
      title = 'Activate Trainer';
      message = `Are you sure you want to activate ${trainer.name}'s account?`;
    } else if (newStatus === 'inactive') {
      title = 'Deactivate Trainer';
      message = `Are you sure you want to deactivate ${trainer.name}'s account?`;
    }

    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        // In a real app this would be an API call
        showSuccess(`Trainer ${trainer.name}'s status has been changed to ${newStatus}.`);
      }
    });
  };

  // Navigate to a specific trainer management page
  const navigateToTrainerPage = (path) => {
    navigate(path);
  };

  // Function to render status badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Active</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">Inactive</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">Pending</span>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout pageTitle="Trainer Management">
      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {trainerManagementLinks.map((link, index) => (
          <div
            key={index}
            onClick={() => navigateToTrainerPage(link.path)}
            className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 hover:bg-[#1a1a30] cursor-pointer transition-colors"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-3">
                {link.icon}
              </div>
              <h3 className="text-white font-medium mb-1">{link.title}</h3>
              <p className="text-white/60 text-sm">{link.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#121225] text-white border border-gray-700 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
            placeholder="Search trainers..."
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
          >
            <FaFilter />
          </button>
        </div>

        <div>
          <button
            onClick={() => navigate('/admin/trainers/edit-trainer')}
            className="bg-[#f67a45] hover:bg-[#e56d3d] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <FaUserPlus size={14} />
            <span>Add New Trainer</span>
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <div className="flex flex-wrap -mb-px">
          <button
            onClick={() => setActiveTab('all')}
            className={`inline-flex items-center py-4 px-4 text-sm font-medium text-center border-b-2 ${activeTab === 'all'
                ? 'text-[#f67a45] border-[#f67a45]'
                : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-300'
              }`}
          >
            All Trainers
            <span className="ml-2 bg-gray-700 px-2 py-0.5 rounded-full text-xs">{counts.all}</span>
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`inline-flex items-center py-4 px-4 text-sm font-medium text-center border-b-2 ${activeTab === 'active'
                ? 'text-[#f67a45] border-[#f67a45]'
                : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-300'
              }`}
          >
            Active
            <span className="ml-2 bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full text-xs">{counts.active}</span>
          </button>
          <button
            onClick={() => setActiveTab('inactive')}
            className={`inline-flex items-center py-4 px-4 text-sm font-medium text-center border-b-2 ${activeTab === 'inactive'
                ? 'text-[#f67a45] border-[#f67a45]'
                : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-300'
              }`}
          >
            Inactive
            <span className="ml-2 bg-gray-700 px-2 py-0.5 rounded-full text-xs">{counts.inactive}</span>
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`inline-flex items-center py-4 px-4 text-sm font-medium text-center border-b-2 ${activeTab === 'pending'
                ? 'text-[#f67a45] border-[#f67a45]'
                : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-300'
              }`}
          >
            Pending
            <span className="ml-2 bg-yellow-900/30 text-yellow-400 px-2 py-0.5 rounded-full text-xs">{counts.pending}</span>
          </button>
        </div>
      </div>

      {/* Trainers Table */}
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Trainer</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Specialty</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Clients</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rating</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredTrainers.length > 0 ? (
                filteredTrainers.map((trainer) => (
                  <tr key={trainer.id} className="hover:bg-gray-800/30">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {trainer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{trainer.name}</div>
                          <div className="text-sm text-gray-400">{trainer.experience}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-white">
                      {trainer.specialty}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-sm text-white">{trainer.email}</div>
                      <div className="text-sm text-gray-400">{trainer.phone}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-white">
                      {trainer.clients}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-white mr-2">{trainer.rating}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(trainer.rating) ? 'text-yellow-400' : 'text-gray-600'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {renderStatusBadge(trainer.status)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewTrainer(trainer)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="View Trainer"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditTrainer(trainer)}
                          className="text-white/70 hover:text-white transition-colors"
                          title="Edit Trainer"
                        >
                          <FaEdit size={16} />
                        </button>
                        {trainer.status === 'active' ? (
                          <button
                            onClick={() => handleStatusChange(trainer, 'inactive')}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                            title="Deactivate"
                          >
                            <FaTimes size={16} />
                          </button>
                        ) : trainer.status === 'inactive' || trainer.status === 'pending' ? (
                          <button
                            onClick={() => handleStatusChange(trainer, 'active')}
                            className="text-green-400 hover:text-green-300 transition-colors"
                            title="Activate"
                          >
                            <FaCheck size={16} />
                          </button>
                        ) : null}
                        <button
                          onClick={() => handleDeleteTrainer(trainer)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-white/70">
                    No trainers found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Tips */}
      <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h3 className="text-white font-medium mb-2">Trainer Management Tips</h3>
        <ul className="text-white/70 text-sm space-y-1 list-disc list-inside">
          <li>Review pending trainer applications regularly from the 'Approve Trainers' page</li>
          <li>Set up trainer payment schedules from the 'Payments' section</li>
          <li>Monitor trainer performance metrics in the 'Reports' area</li>
          <li>Ensure all trainers have complete profiles with proper certifications</li>
        </ul>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />
    </AdminLayout>
  );
};

export default Trainers;
