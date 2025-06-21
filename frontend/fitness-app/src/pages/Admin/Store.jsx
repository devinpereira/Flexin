import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaShoppingCart, FaWarehouse, FaChevronRight } from 'react-icons/fa';
import AdminLayout from '../../components/Admin/AdminLayout';

const Store = () => {
  const navigate = useNavigate();

  // Store management sections
  const storeManagementLinks = [
    {
      title: 'Product Management',
      path: '/admin/store/products',
      description: 'Manage product listings, add new products, and update existing ones',
      icon: <FaBoxOpen className="text-[#f67a45]" size={24} />,
      subItems: [
        { title: 'All Products', path: '/admin/store/products' },
        { title: 'Add New Product', path: '/admin/store/products/add' }
      ]
    },
    {
      title: 'View Orders',
      path: '/admin/store/orders',
      description: 'Process orders, check order history, and manage customer purchases',
      icon: <FaShoppingCart className="text-[#f67a45]" size={24} />,
      subItems: [
        { title: 'New Orders', path: '/admin/store/orders' }
      ]
    },
    {
      title: 'Inventory Management',
      path: '/admin/store/inventory',
      description: 'Track stock levels, manage inventory, and get low stock alerts',
      icon: <FaWarehouse className="text-[#f67a45]" size={24} />
    }
  ];

  // Navigate to a specific store management page
  const navigateToStorePage = (path) => {
    navigate(path);
  };

  return (
    <AdminLayout pageTitle="Store Management">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats cards will be implemented here */}
      </div>

      <div className="mb-8">
        <h3 className="text-white text-xl font-bold mb-4">Store Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storeManagementLinks.map((link, index) => (
            <div
              key={index}
              className="bg-[#121225] rounded-xl p-6 hover:bg-[#1d1d3a] transition-colors cursor-pointer border border-white/10"
              onClick={() => navigateToStorePage(link.path)}
            >
              <div className="flex items-center gap-4 mb-4">
                {link.icon}
                <h4 className="text-white text-lg font-medium">{link.title}</h4>
              </div>
              <p className="text-white/70 mb-4 text-sm">{link.description}</p>

              {link.subItems && (
                <div className="mt-4 border-t border-white/10 pt-4">
                  {link.subItems.map((subItem, idx) => (
                    <div
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToStorePage(subItem.path);
                      }}
                      className="flex items-center justify-between py-2 text-white/70 hover:text-white transition-colors"
                    >
                      <span>{subItem.title}</span>
                      <FaChevronRight size={14} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Store;
