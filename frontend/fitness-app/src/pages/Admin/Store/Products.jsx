import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import AdminLayout from '../../../components/Admin/AdminLayout';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import { useNotification } from '../../../hooks/useNotification';

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError, showInfo } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // State for confirm dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });

  // Navigation to sub-pages
  const handleAddProduct = () => {
    navigate('/admin/store/products/add');
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/store/products/edit/${productId}`);
  };

  const handleViewProduct = (productId) => {
    navigate(`/admin/store/products/view/${productId}`);
  };

  // Mock categories
  const categories = ['all', 'Supplements', 'Equipment', 'Apparel'];

  // Mock products data (replace with real data or API call later)
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Whey Protein',
      price: 49.99,
      discount: 10,
      image: '/src/assets/products/product1.png',
      category: 'Supplements',
    },
    {
      id: 2,
      name: 'Yoga Mat',
      price: 19.99,
      discount: 0,
      image: '/src/assets/products/product2.png',
      category: 'Equipment',
    },
    {
      id: 3,
      name: 'Dumbbells Set',
      price: 89.99,
      discount: 15,
      image: '/src/assets/products/product3.png',
      category: 'Equipment',
    },
    {
      id: 4,
      name: 'BCAA Supplement',
      price: 29.99,
      discount: 5,
      image: '/src/assets/products/product4.png',
      category: 'Supplements',
    },
    {
      id: 5,
      name: 'Running Shoes',
      price: 59.99,
      discount: 20,
      image: '/src/assets/products/product5.png',
      category: 'Apparel',
    },
  ]);

  // Filtered products
  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === 'all' || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete product handler
  const handleDeleteProduct = (productId) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      onConfirm: () => {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        showSuccess('Product deleted successfully');
      },
      type: 'danger',
    });
  };

  return (
    <AdminLayout pageTitle="Product Management">
      <div className="mb-6">
        <div className="flex border-b border-white/10">
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${location.pathname === '/admin/store/products' ? 'text-[#f67a45] border-b-2 border-[#f67a45]' : 'text-white/70 hover:text-white'}`}
            onClick={() => navigate('/admin/store/products')}
          >
            All Products
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${location.pathname === '/admin/store/products/add' ? 'text-[#f67a45] border-b-2 border-[#f67a45]' : 'text-white/70 hover:text-white'}`}
            onClick={() => navigate('/admin/store/products/add')}
          >
            Add New Product
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121225] border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaSearch className="text-white/50" />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#121225] border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45] ml-2"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddProduct}
            className="bg-[#f67a45] text-white px-4 py-2 rounded-lg hover:bg-[#e56d3d] transition-colors flex items-center gap-2"
          >
            <FaPlus /> Add New Product
          </button>
        </div>
      </div>

      <div className="bg-[#0A0A1F] rounded-lg p-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center text-white/70 py-12">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="w-full h-[270px] relative origin-top-left rounded-xl outline-1 outline-offset-[-1px] outline-white/30 bg-black/40 backdrop-blur-sm p-4 flex flex-col justify-between shadow-lg hover:scale-[1.03] transition-transform group"
              >
                {product.discount > 0 && (
                  <div className="w-[32px] h-[32px] absolute top-2 right-2 bg-[#e50909] rounded-tr-md rounded-bl-lg flex items-center justify-center text-white text-xs font-bold shadow-md">
                    -{product.discount}%
                  </div>
                )}
                <div className="w-full h-24 bg-gray-700/30 mb-3 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-1 truncate">{product.name}</h3>
                  <p className="text-[#f67a45] text-base font-bold">${product.price.toFixed(2)}</p>
                  <p className="text-xs text-white/60 mt-1">{product.category}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-3 w-full">
                  <button
                    className="bg-[#f67a45] text-white px-3 py-1 rounded text-xs hover:bg-[#e56d3d] transition-colors flex items-center gap-1 mb-1"
                    onClick={() => handleEditProduct(product.id)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="bg-gray-700 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition-colors flex items-center gap-1 mb-1"
                    onClick={() => handleViewProduct(product.id)}
                  >
                    <FaEye /> View
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors flex items-center gap-1 mb-1"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </AdminLayout>
  );
};

export default Products;