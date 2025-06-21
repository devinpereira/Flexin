import React from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md', // 'sm', 'md', 'lg', 'xl', 'full'
  closeOnBackdropClick = true,
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  // Calculate modal size class
  let sizeClass = '';
  switch (size) {
    case 'sm':
      sizeClass = 'max-w-md';
      break;
    case 'md':
      sizeClass = 'max-w-lg';
      break;
    case 'lg':
      sizeClass = 'max-w-2xl';
      break;
    case 'xl':
      sizeClass = 'max-w-4xl';
      break;
    case 'full':
      sizeClass = 'max-w-full m-4';
      break;
    default:
      sizeClass = 'max-w-lg';
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className={`bg-[#121225] border border-[#f67a45]/30 rounded-lg w-full ${sizeClass} shadow-lg max-h-[90vh] flex flex-col`}>
        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-white text-lg font-medium">{title}</h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <FaTimes size={18} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-700">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;