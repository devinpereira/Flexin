import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes, FaDownload, FaUpload, FaExclamationTriangle, FaEdit, FaHistory, FaWarehouse, FaBoxes, FaSync } from 'react-icons/fa';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { useNotification } from '../../../hooks/useNotification';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import StockAdjustmentModal from '../../../components/Admin/Store/StockAdjustmentModal';
import StockHistoryModal from '../../../components/Admin/Store/StockHistoryModal';
import InventoryDashboard from '../../../components/Admin/Store/InventoryDashboard';
import { adminInventoryApi } from '../../../api/adminStoreApi';

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
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    type: 'warning'
  });

  // Stock adjustment modal state
  const [stockModal, setStockModal] = useState({
    isOpen: false,
    item: null,
    newQuantity: 0,
    reason: 'adjustment',
    notes: ''
  });

  // Stock history modal state
  const [historyModal, setHistoryModal] = useState({
    isOpen: false,
    item: null
  });

  // Handle stock adjustment with modal
  const handleStockAdjustment = (item) => {
    setStockModal({
      isOpen: true,
      item,
      newQuantity: item?.stock?.currentStock || item?.currentStock || 0,
      reason: 'adjustment',
      notes: ''
    });
  };

  // Handle stock update from modal
  const handleStockUpdate = async (itemId, updateData) => {
    try {
      setUpdating(true);
      await adminInventoryApi.updateStock(itemId, updateData);
      showSuccess('Stock updated successfully');
      loadInventory(); // Reload inventory data
      setStockModal({ ...stockModal, isOpen: false });
    } catch (error) {
      console.error('Error updating stock:', error);
      showError('Failed to update stock');
    } finally {
      setUpdating(false);
    }
  };

  // Load inventory data
  const loadInventory = async () => {
    try {
      setLoading(true);
      const response = await adminInventoryApi.getInventory({
        page,
        limit: itemsPerPage,
        search: searchQuery,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        lowStock: stockFilter === 'low_stock' ? true : undefined,
        outOfStock: stockFilter === 'out_of_stock' ? true : undefined,
        sortBy: sortField,
        sortOrder
      });

      console.log('Inventory API Response:', response);

      if (response.success) {
        // Handle different possible response structures
        const inventoryData = response.data || [];
        const paginationData = response.pagination || {};

        setInventory(inventoryData);
        setTotalItems(paginationData.total || inventoryData.length || 0);

        // Calculate analytics immediately after setting inventory
        setTimeout(() => {
          calculateAnalyticsFromInventoryData(inventoryData);
        }, 50);
      } else {
        setInventory([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
      showError('Failed to load inventory data. Using mock data for testing.');

      // Use mock data for testing when backend is not available
      const mockData = [
        {
          _id: '1',
          productId: {
            _id: 'prod1',
            productName: 'Whey Protein',
            sku: 'WP-2000-CHOC',
            categoryId: { name: 'Supplements' },
            price: 49.99,
            images: []
          },
          stock: {
            currentStock: 120,
            reservedStock: 0,
            availableStock: 120
          },
          thresholds: {
            lowStockThreshold: 20,
            reorderPoint: 10
          },
          location: {
            warehouse: 'Warehouse A'
          }
        },
        {
          _id: '2',
          productId: {
            _id: 'prod2',
            productName: 'Yoga Mat',
            sku: 'YM-6MM-BLK',
            categoryId: { name: 'Equipment' },
            price: 29.99,
            images: []
          },
          stock: {
            currentStock: 8,
            reservedStock: 0,
            availableStock: 8
          },
          thresholds: {
            lowStockThreshold: 10,
            reorderPoint: 5
          },
          location: {
            warehouse: 'Warehouse B'
          }
        },
        {
          _id: '3',
          productId: {
            _id: 'prod3',
            productName: 'Pre-Workout',
            sku: 'PW-300G-BERRY',
            categoryId: { name: 'Supplements' },
            price: 39.99,
            images: []
          },
          stock: {
            currentStock: 0,
            reservedStock: 0,
            availableStock: 0
          },
          thresholds: {
            lowStockThreshold: 15,
            reorderPoint: 8
          },
          location: {
            warehouse: 'Warehouse A'
          }
        }
      ];

      setInventory(mockData);
      setTotalItems(mockData.length);

      // Calculate analytics from mock data immediately
      setTimeout(() => {
        calculateAnalyticsFromInventoryData(mockData);
      }, 50);
    } finally {
      setLoading(false);
    }
  };

  // Load low stock alerts
  const loadLowStockAlerts = async () => {
    try {
      const response = await adminInventoryApi.getLowStockAlerts();
      console.log('Low Stock Alerts Response:', response);

      if (response.success) {
        // Handle different possible response structures
        const alertsData = response.data?.lowStock || response.data || [];
        setLowStockAlerts(alertsData);
      }
    } catch (error) {
      console.error('Error loading low stock alerts:', error);
      setLowStockAlerts([]);
    }
  };

  // Load analytics
  const loadAnalytics = async () => {
    try {
      const response = await adminInventoryApi.getInventoryAnalytics();
      console.log('Analytics Response:', response);

      if (response.success) {
        setAnalytics(response.data);
      } else {
        // Create analytics from current data
        calculateAnalyticsFromData();
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Create analytics from current data when API fails
      calculateAnalyticsFromData();
    }
  };

  // Calculate analytics from current inventory data
  const calculateAnalyticsFromData = () => {
    calculateAnalyticsFromInventoryData(inventory);
  };

  // Calculate analytics from given inventory data
  const calculateAnalyticsFromInventoryData = (inventoryData) => {
    const totalProducts = inventoryData.length;

    const totalValue = inventoryData.reduce((sum, item) => {
      const currentStock = item.stock?.currentStock || item.currentStock || 0;
      const price = item.productId?.price || item.price || 0;
      return sum + (currentStock * price);
    }, 0);

    const lowStockItems = inventoryData.filter(item => {
      const currentStock = item.stock?.currentStock || item.currentStock || 0;
      const threshold = item.thresholds?.lowStockThreshold || item.lowStockThreshold || 10;
      return currentStock > 0 && currentStock <= threshold;
    });

    const outOfStockItems = inventoryData.filter(item =>
      (item.stock?.currentStock || item.currentStock || 0) === 0
    );

    const calculatedAnalytics = {
      totalProducts,
      totalValue,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length
    };

    console.log('Calculated Analytics:', calculatedAnalytics);
    console.log('From inventory data:', inventoryData);
    setAnalytics(calculatedAnalytics);
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    const loadData = async () => {
      await loadInventory();
      await loadLowStockAlerts();
    };
    loadData();
  }, [page, itemsPerPage, searchQuery, categoryFilter, stockFilter, sortField, sortOrder]);

  // Calculate analytics whenever inventory data changes
  useEffect(() => {
    if (inventory.length > 0) {
      // Small delay to ensure state is updated
      setTimeout(() => {
        calculateAnalyticsFromData();
      }, 100);
    } else {
      // Reset analytics when no data
      setAnalytics({
        totalProducts: 0,
        totalValue: 0,
        lowStockCount: 0,
        outOfStockCount: 0
      });
    }
  }, [inventory, lowStockAlerts]);

  // Get filtered and sorted inventory (for display only, filtering is done on backend)
  const getFilteredInventory = () => {
    return inventory;
  };

  // Get paginated data (pagination is handled on backend)
  const getPaginatedData = () => {
    return inventory;
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
  const handleUpdateStock = async (itemId, newQuantity) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Update Stock Level',
      message: `Are you sure you want to update the stock level to ${newQuantity}?`,
      onConfirm: async () => {
        try {
          await adminInventoryApi.updateStock(itemId, {
            quantity: newQuantity,
            reason: 'manual_adjustment',
            notes: 'Manual stock adjustment from admin panel'
          });
          showSuccess('Stock level updated successfully');
          loadInventory(); // Reload inventory data
        } catch (error) {
          console.error('Error updating stock:', error);
          showError('Failed to update stock level');
        }
      },
      type: 'warning'
    });
  };

  // Handle bulk import inventory
  const handleImportInventory = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          await adminInventoryApi.importInventory(file);
          showSuccess('Inventory imported successfully');
          loadInventory(); // Reload inventory data
        } catch (error) {
          console.error('Error importing inventory:', error);
          showError('Failed to import inventory data');
        }
      }
    };
    input.click();
  };

  // Handle export inventory data
  const handleExportInventory = async () => {
    try {
      const response = await adminInventoryApi.exportInventory();

      // Create download link for the CSV data
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      showSuccess('Inventory data exported successfully');
    } catch (error) {
      console.error('Error exporting inventory:', error);
      showError('Failed to export inventory data');
    }
  };

  // Handle sync inventory with products
  const handleSyncInventory = async () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Sync Inventory with Products',
      message: 'This will create inventory records for any products that don\'t have them. Are you sure you want to continue?',
      onConfirm: async () => {
        try {
          setUpdating(true);
          const response = await adminInventoryApi.syncWithProducts();
          console.log('Sync Response:', response);
          showSuccess('Inventory synced with products successfully');
          loadInventory(); // Reload inventory data
        } catch (error) {
          console.error('Error syncing inventory:', error);
          showError('Failed to sync inventory with products');
        } finally {
          setUpdating(false);
        }
      },
      type: 'info'
    });
  };

  // Handle view stock history
  const handleViewHistory = (item) => {
    setHistoryModal({
      isOpen: true,
      item: item
    });
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

      {/* Inventory Dashboard */}
      <InventoryDashboard
        analytics={analytics}
        lowStockCount={analytics?.lowStockCount || 0}
        outOfStockCount={analytics?.outOfStockCount || 0}
      />

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
              onClick={handleSyncInventory}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaSync /> Sync with Products
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

      {/* Low Stock Alerts */}
      {lowStockAlerts.length > 0 && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <FaExclamationTriangle className="text-red-400" />
            <h3 className="text-white font-medium">Low Stock Alerts ({lowStockAlerts.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockAlerts.length > 0 ? (
              lowStockAlerts.map((alert) => {
                const productName = alert.productId?.productName || alert.name || 'N/A';
                const sku = alert.productId?.sku || alert.sku || 'N/A';
                const currentStock = alert.stock?.currentStock || alert.currentStock || alert.inStock || 0;
                const threshold = alert.thresholds?.lowStockThreshold || alert.lowStockThreshold || 10;

                return (
                  <div key={alert._id || alert.id} className="bg-[#121225] p-3 rounded-lg">
                    <div className="text-white text-sm font-medium">{productName}</div>
                    <div className="text-white/70 text-xs">{sku}</div>
                    <div className="text-red-400 text-xs mt-1">
                      {currentStock} / {threshold} (threshold)
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center text-white/70 py-4">
                No low stock alerts
              </div>
            )}
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
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-white/70">
                    Loading inventory data...
                  </td>
                </tr>
              ) : getPaginatedData().length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-white/70">
                    No inventory items found
                  </td>
                </tr>
              ) : (
                getPaginatedData().map((item) => {
                  console.log('Rendering item:', item); // Debug log
                  console.log('Product data:', item.productId); // Debug product data
                  console.log('Category data:', item.productId?.categoryId); // Debug category data

                  const productName = item.productId?.productName || item.name || 'N/A';
                  const sku = item.productId?.sku || item.sku || 'N/A';
                  const category = item.productId?.categoryId?.name || item.product?.category?.name || item.category || 'N/A';
                  const currentStock = item.stock?.currentStock || item.currentStock || item.inStock || 0;
                  const price = item.productId?.price || item.price || 0;
                  const location = item.location?.warehouse || item.location || 'N/A';
                  const lowThreshold = item.thresholds?.lowStockThreshold || item.lowStockThreshold || 10;

                  // Determine status based on stock levels
                  let status = 'in_stock';
                  if (currentStock === 0) {
                    status = 'out_of_stock';
                  } else if (currentStock <= lowThreshold) {
                    status = 'low_stock';
                  }

                  return (
                    <tr key={item._id || item.id} className="hover:bg-[#121225]">
                      <td className="px-4 py-3 text-white">{productName}</td>
                      <td className="px-4 py-3 text-white/70">{sku}</td>
                      <td className="px-4 py-3 text-white/70">{category}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleStockAdjustment(item)}
                          className="bg-[#121225] border border-white/20 rounded px-3 py-1 text-white hover:border-[#f67a45] min-w-[60px]"
                        >
                          {currentStock}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">{renderStatusBadge(status)}</td>
                      <td className="px-4 py-3 text-right text-white/70">${price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-white/70">{location}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/store/products/edit/${item.productId?._id || item._id || item.id}`)}
                            className="p-1 hover:text-[#f67a45] text-white/70"
                            title="Edit Product"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleViewHistory(item)}
                            className="p-1 hover:text-[#f67a45] text-white/70"
                            title="View History"
                          >
                            <FaHistory size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
          <div className="text-white/70 text-sm">
            Showing {((page - 1) * itemsPerPage) + 1} to {Math.min(page * itemsPerPage, totalItems)} of {totalItems} items
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
              onClick={() => setPage(prev => Math.min(Math.ceil(totalItems / itemsPerPage), prev + 1))}
              disabled={page >= Math.ceil(totalItems / itemsPerPage)}
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

      <StockAdjustmentModal
        isOpen={stockModal.isOpen}
        onClose={() => setStockModal({ ...stockModal, isOpen: false })}
        item={stockModal.item}
        onUpdate={handleStockUpdate}
      />
      <StockHistoryModal
        isOpen={historyModal.isOpen}
        onClose={() => setHistoryModal({ ...historyModal, isOpen: false })}
        item={historyModal.item}
      />

      {/* Loading/Updating Overlay */}
      {updating && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-40 animate-in fade-in duration-200">
          <div className="bg-[#0A0A1F] rounded-lg p-8 border border-white/10 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f67a45]"></div>
              <p className="text-white font-medium">Updating inventory...</p>
              <p className="text-white/60 text-sm">Please wait while we process your request</p>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Inventory;