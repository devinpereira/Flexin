import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes, FaDownload, FaUpload, FaExclamationTriangle, FaEdit, FaHistory } from 'react-icons/fa';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { useNotification } from '../../../hooks/useNotification';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';

const Inventory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    type: 'warning'
  });

  // Mock inventory data
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: 'Whey Protein',
      sku: 'WP-2000-CHOC',
      category: 'Supplements',
      inStock: 120,
      lowStockThreshold: 20,
      optimalStock: 150,
      price: 49.99,
      lastRestocked: '2023-10-15',
      supplier: 'MusclePro',
      location: 'Warehouse A',
      status: 'in_stock'
    },
    {
      id: 2,
      name: 'Yoga Mat',
      sku: 'YM-6MM-BLK',
      category: 'Equipment',
      inStock: 8,
      lowStockThreshold: 10,
      optimalStock: 50,
      price: 29.99,
      lastRestocked: '2023-10-10',
      supplier: 'FlexFit',
      location: 'Warehouse B',
      status: 'low_stock'
    },
    {
      id: 3,
      name: 'Pre-Workout',
      sku: 'PW-300G-BERRY',
      category: 'Supplements',
      inStock: 0,
      lowStockThreshold: 15,
      optimalStock: 100,
      price: 39.99,
      lastRestocked: '2023-09-28',
      supplier: 'NutriPro',
      location: 'Warehouse A',
      status: 'out_of_stock'
    }
  ]);

  // Get filtered and sorted inventory
  const getFilteredInventory = () => {
    return inventory
      .filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.supplier.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

        const matchesStock = stockFilter === 'all' || item.status === stockFilter;

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === 'string') {
          return sortOrder === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });
  };

  // Get paginated data
  const getPaginatedData = () => {
    const filtered = getFilteredInventory();
    const startIndex = (page - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Handle stock update
  const handleUpdateStock = (itemId, newQuantity) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Update Stock Level',
      message: `Are you sure you want to update the stock level to ${newQuantity}?`,
      onConfirm: () => {
        setInventory(prev => prev.map(item => {
          if (item.id === itemId) {
            const status = newQuantity === 0 ? 'out_of_stock' :
              newQuantity <= item.lowStockThreshold ? 'low_stock' : 'in_stock';
            return { ...item, inStock: newQuantity, status };
          }
          return item;
        }));
        showSuccess('Stock level updated successfully');
      },
      type: 'warning'
    });
  };

  // Handle bulk import inventory
  const handleImportInventory = () => {
    // Import logic will be implemented later
    showSuccess('Import functionality will be implemented soon');
  };

  // Handle export inventory data
  const handleExportInventory = () => {
    const csvData = inventory.map(item => ({
      Name: item.name,
      SKU: item.sku,
      Category: item.category,
      'In Stock': item.inStock,
      'Low Stock Threshold': item.lowStockThreshold,
      'Optimal Stock': item.optimalStock,
      Price: item.price,
      'Last Restocked': item.lastRestocked,
      Supplier: item.supplier,
      Location: item.location,
      Status: item.status
    }));

    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(item => Object.values(item).join(','))
    ].join('\\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'inventory_export.csv';
    link.click();
    showSuccess('Inventory data exported successfully');
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const styles = {
      in_stock: 'bg-green-500/20 text-green-400 border-green-500',
      low_stock: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      out_of_stock: 'bg-red-500/20 text-red-400 border-red-500'
    };

    const labels = {
      in_stock: 'In Stock',
      low_stock: 'Low Stock',
      out_of_stock: 'Out of Stock'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <AdminLayout pageTitle="Inventory Management">
      <div className="mb-6">
        <div className="flex border-b border-white/10">
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${location.pathname === '/admin/store/inventory' ? 'text-[#f67a45] border-b-2 border-[#f67a45]' : 'text-white/70 hover:text-white'}`}
            onClick={() => navigate('/admin/store/inventory')}
          >
            Inventory Overview
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search inventory..."
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
              onClick={handleImportInventory}
              className="bg-[#121225] text-white px-4 py-2 rounded-lg hover:bg-[#1d1d3a] transition-colors flex items-center gap-2"
            >
              <FaUpload /> Import
            </button>
            <button
              onClick={handleExportInventory}
              className="bg-[#121225] text-white px-4 py-2 rounded-lg hover:bg-[#1d1d3a] transition-colors flex items-center gap-2"
            >
              <FaDownload /> Export
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-[#0A0A1F] border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]"
              >
                <option value="all">All Categories</option>
                <option value="Supplements">Supplements</option>
                <option value="Equipment">Equipment</option>
                <option value="Apparel">Apparel</option>
              </select>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Stock Status</label>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full bg-[#0A0A1F] border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]"
              >
                <option value="all">All Stock</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#0A0A1F] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#121225]">
                <th className="px-4 py-3 text-left text-white font-medium text-sm cursor-pointer hover:bg-[#1d1d3a]" onClick={() => handleSort('name')}>
                  Product Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-white font-medium text-sm">SKU</th>
                <th className="px-4 py-3 text-left text-white font-medium text-sm">Category</th>
                <th className="px-4 py-3 text-center text-white font-medium text-sm cursor-pointer hover:bg-[#1d1d3a]" onClick={() => handleSort('inStock')}>
                  In Stock {sortField === 'inStock' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-center text-white font-medium text-sm">Status</th>
                <th className="px-4 py-3 text-right text-white font-medium text-sm cursor-pointer hover:bg-[#1d1d3a]" onClick={() => handleSort('price')}>
                  Price {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-white font-medium text-sm">Location</th>
                <th className="px-4 py-3 text-center text-white font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {getPaginatedData().map((item) => (
                <tr key={item.id} className="hover:bg-[#121225]">
                  <td className="px-4 py-3 text-white">{item.name}</td>
                  <td className="px-4 py-3 text-white/70">{item.sku}</td>
                  <td className="px-4 py-3 text-white/70">{item.category}</td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      value={item.inStock}
                      onChange={(e) => handleUpdateStock(item.id, parseInt(e.target.value))}
                      min="0"
                      className="w-20 bg-[#121225] border border-white/20 rounded px-2 py-1 text-white text-center"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">{renderStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-right text-white/70">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-white/70">{item.location}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/store/products/edit/${item.id}`)}
                        className="p-1 hover:text-[#f67a45] text-white/70"
                        title="Edit Product"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        className="p-1 hover:text-[#f67a45] text-white/70"
                        title="View History"
                      >
                        <FaHistory size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
          <div className="text-white/70 text-sm">
            Showing {((page - 1) * itemsPerPage) + 1} to {Math.min(page * itemsPerPage, getFilteredInventory().length)} of {getFilteredInventory().length} items
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-[#121225] text-white rounded hover:bg-[#1d1d3a] disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(prev => Math.min(Math.ceil(getFilteredInventory().length / itemsPerPage), prev + 1))}
              disabled={page >= Math.ceil(getFilteredInventory().length / itemsPerPage)}
              className="px-3 py-1 bg-[#121225] text-white rounded hover:bg-[#1d1d3a] disabled:opacity-50"
            >
              Next
            </button>
          </div>
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

export default Inventory;