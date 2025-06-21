import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaChartBar, FaDumbbell, FaUserFriends, FaShoppingCart, FaUsers, FaCog, FaTimes, FaBars } from 'react-icons/fa';
import Navigation from '../Navigation';

const AdminLayout = ({ children, pageTitle = 'Admin Dashboard' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine active section based on current path
  const getActiveSection = useCallback(() => {
    const path = location.pathname;
    if (path.startsWith('/admin/trainers')) return 'Trainers';
    if (path.startsWith('/admin/fitness')) return 'Fitness';
    if (path.startsWith('/admin/store')) return 'Store';
    if (path.startsWith('/admin/community')) return 'Community';
    if (path.startsWith('/admin/settings')) return 'Settings';
    if (path === '/admin') return 'Dashboard';
    return 'Dashboard';
  }, [location.pathname]);

  const [activeSection, setActiveSection] = useState(() => getActiveSection());

  // Update active section when route changes
  useEffect(() => {
    setActiveSection(getActiveSection());
  }, [getActiveSection]);

  // Handle window resize to close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Check if specific path is active (for subitems highlighting)
  const isPathActive = (path) => {
    // For exact matches
    if (location.pathname === path) return true;
    // Store Products: highlight for add/edit/view
    if (path === '/admin/store/products' &&
      (location.pathname.startsWith('/admin/store/products/add') ||
        location.pathname.startsWith('/admin/store/products/edit') ||
        location.pathname.startsWith('/admin/store/products/view'))
    ) {
      return true;
    }
    // Store Add Product
    if (path === '/admin/store/products/add' && location.pathname.startsWith('/admin/store/products/add')) {
      return true;
    }
    // Store Orders: highlight for order details
    if (path === '/admin/store/orders' &&
      (location.pathname.startsWith('/admin/store/orders/') || location.pathname === '/admin/store/orders')
    ) {
      return true;
    }
    // Store Inventory: highlight for inventory subpages
    if (path === '/admin/store/inventory' && location.pathname.startsWith('/admin/store/inventory')) {
      return true;
    }
    return false;
  };

  // Navigation items with icons and paths
  const navItems = [
    { id: 'Dashboard', icon: <FaChartBar size={20} />, path: '/admin' },
    {
      id: 'Fitness',
      icon: <FaDumbbell size={20} />,
      path: '/admin/fitness',
      subItems: [
        { id: 'All Fitness', path: '/admin/fitness' },
        { id: 'Add Exercise', path: '/admin/fitness/add-exercise' },
        { id: 'Edit Exercise', path: '/admin/fitness/edit-exercise' }
      ]
    },
    {
      id: 'Trainers',
      icon: <FaUserFriends size={20} />,
      path: '/admin/trainers',
      subItems: [
        { id: 'View Trainers', path: '/admin/trainers' },
        { id: 'Edit Trainers', path: '/admin/trainers/edit-trainer' },
        { id: 'Approve Trainers', path: '/admin/trainers/approve-trainers' },
        { id: 'Payments', path: '/admin/trainers/payments' },
        { id: 'Reports', path: '/admin/trainers/reports' }
      ]
    },
    {
      id: 'Store',
      icon: <FaShoppingCart size={20} />,
      path: '/admin/store',
      subItems: [
        { id: 'Product Management', path: '/admin/store/products' },
        { id: 'View Orders', path: '/admin/store/orders' },
        { id: 'Inventory Management', path: '/admin/store/inventory' }
      ]
    },
    { id: 'Community', icon: <FaUsers size={20} />, path: '/admin/community' },
    { id: 'Settings', icon: <FaCog size={20} />, path: '/admin/settings' }
  ];

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed overflow-x-hidden"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />

      {/* Development mode banner */}
      <div className="bg-yellow-600 text-white text-center py-2 px-4 fixed top-0 left-0 right-0 z-[100]">
        ⚠️ Development Mode: Admin access is unrestricted for development purposes
      </div>

      {/* Add padding to accommodate the dev banner */}
      <div className="pt-8"></div>

      {/* Mobile Menu Toggle Button - Only visible on mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-[#f67a45] text-white p-4 rounded-full shadow-lg"
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu - Slide up from bottom when open */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#03020d] rounded-t-3xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}>
        <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-6"></div>
        <div className="px-6 pb-8 pt-2">
          <div className="flex flex-col space-y-4">
            {navItems.map(item => (
              <div key={item.id}>
                <a
                  href="#"
                  className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${activeSection === item.id
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                    }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(item.id);
                    setIsMobileMenuOpen(false);
                    navigate(item.path);
                  }}
                >
                  {item.icon}
                  <span>{item.id}</span>
                </a>

                {/* Show subitems if they exist and section is active */}
                {item.subItems && activeSection === item.id && (
                  <div className="ml-8 mt-2 space-y-2">
                    {item.subItems.map(subItem => (
                      <a
                        key={subItem.id}
                        href="#"
                        className={`block text-sm py-2 px-4 transition-colors rounded-md ${location.pathname === subItem.path
                          ? 'text-[#f67a45] font-medium bg-[#f67a45]/10'
                          : 'text-white/80 hover:text-[#f67a45] hover:bg-[#1A1A2F]'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          setIsMobileMenuOpen(false);
                          navigate(subItem.path);
                        }}
                      >
                        {subItem.id}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="border-t border-white/20 pt-4 mt-4">
              <div className="flex items-center gap-3 px-6 py-2">
                <img src="/src/assets/profile1.png" className="w-10 h-10 rounded-full" alt="Admin" />
                <span className="text-white">Admin Panel</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto pt-4 sm:pt-8 px-2 sm:px-4 max-w-8xl">
        {/* Left Navigation - Hidden on mobile, visible on md screens and up */}
        <div className="hidden md:block fixed left-0 top-50 z-10 h-screen">
          <nav className="bg-[#03020d] rounded-tr-[30px] w-[220px] lg:w-[275px] p-4 lg:p-6 h-full overflow-y-auto">
            {/* Logo or brand area */}
            <div className="mb-10 mt-6 px-4">
              <div className="text-white text-xl font-bold">Admin Dashboard</div>
            </div>

            <div className="space-y-3">
              {navItems.map(item => (
                <div key={item.id}>
                  <a
                    href="#"
                    className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${activeSection === item.id
                      ? 'bg-[#f67a45] text-white font-medium'
                      : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                      }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection(item.id);
                      navigate(item.path);
                    }}
                  >
                    {item.icon}
                    <span>{item.id}</span>
                  </a>

                  {/* Show subitems if they exist and this section is active */}
                  {item.subItems && activeSection === item.id && (
                    <div className="ml-8 mt-2 space-y-2">
                      {item.subItems.map(subItem => (
                        <a
                          key={subItem.id}
                          href="#"
                          className={`block text-sm py-2 px-4 transition-colors rounded-md ${location.pathname === subItem.path
                            ? 'text-[#f67a45] font-medium bg-[#f67a45]/10'
                            : 'text-white/80 hover:text-[#f67a45] hover:bg-[#1A1A2F]'
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(subItem.path);
                          }}
                        >
                          {subItem.id}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-6 border-t border-white/20 mt-32">
                <a
                  href="#"
                  className="flex items-center gap-3 px-6 py-3 rounded-full text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45] transition-all duration-200"
                >
                  <img src="/src/assets/profile1.png" className="w-10 h-10 rounded-full" alt="Admin" />
                  <span>Admin User</span>
                </a>
              </div>
            </div>
          </nav>
        </div>

        <div className="w-full md:pl-[220px] lg:pl-[275px] pr-0">
          <div className="max-w-full overflow-x-hidden">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-white text-xl sm:text-2xl font-bold">{pageTitle}</h2>
            </div>

            {children}
          </div>
        </div>
      </div>

      <div className="h-24 md:h-0"></div>
    </div>
  );
};

export default AdminLayout;
