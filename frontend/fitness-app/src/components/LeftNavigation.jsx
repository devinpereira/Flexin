import React, { useState } from 'react';
import { AiOutlineHome, AiOutlineHeart } from 'react-icons/ai';
import { BiCategoryAlt } from 'react-icons/bi';
import { MdLocalOffer, MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { FiShoppingCart } from 'react-icons/fi';
import { GiMuscleUp } from 'react-icons/gi';
import { CgPill } from 'react-icons/cg';
import { BiDrink } from 'react-icons/bi';

const LeftNavigation = ({ 
  activeSection = 'Home', 
  onSectionChange,
  selectedSubcategory, 
  onSubcategorySelect 
}) => {
  const [showCategories, setShowCategories] = useState(false);

  const navItems = [
    { name: 'Home', icon: <AiOutlineHome size={20} /> },
    { name: 'Categories', icon: <BiCategoryAlt size={20} /> },
    { name: 'Offers & Deals', icon: <MdLocalOffer size={20} /> },
    { name: 'Favorites', icon: <AiOutlineHeart size={20} /> },
    { name: 'Shopping Cart', icon: <FiShoppingCart size={20} /> },
  ];

  const subCategories = [
    { name: 'Supplements', icon: <CgPill size={16} /> },
    { name: 'Lifting Accessories', icon: <GiMuscleUp size={16} /> },
    { name: 'Shakers & Bottles', icon: <BiDrink size={16} /> },
  ];

  return (
    <div className="fixed left-0 top-50 z-10 h-screen">
      <nav className="bg-[#03020d] rounded-tr-[30px] w-[275px] p-6 h-full">
        <div className="space-y-6">
          {navItems.map((item) => (
            <div key={item.name}>
              <a
                href="#"
                className={`flex items-center justify-between gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === item.name
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  onSectionChange(item.name);
                  if (item.name === 'Categories') {
                    setShowCategories(!showCategories);
                  } else {
                    // Close categories dropdown when selecting other items
                    setShowCategories(false);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                {item.name === 'Categories' && (
                  showCategories ? <MdKeyboardArrowUp size={20} /> : <MdKeyboardArrowDown size={20} />
                )}
              </a>

              {item.name === 'Categories' && showCategories && (
                <div className="ml-10 mt-2 space-y-2">
                  {subCategories.map((subItem) => (
                    <a
                      key={subItem.name}
                      href="#"
                      className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                        selectedSubcategory === subItem.name
                          ? 'text-[#f67a45] font-medium'
                          : 'text-white hover:text-[#f67a45]'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSubcategorySelect(subItem.name);
                      }}
                    >
                      <span className="flex-shrink-0">{subItem.icon}</span>
                      <span>{subItem.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="mt-32 border-t border-white/20 pt-6">
            <div className="flex items-center gap-3">
              <img src="/src/assets/profile1.png" className="w-10 h-10 rounded-full" alt="Profile" />
              <span className="text-white">Account</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default LeftNavigation;