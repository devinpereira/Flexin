import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger" // 'danger', 'warning', 'info'
}) => {

  if (!isOpen) return null;

  // Determine button color based on type
  let buttonColor = '';
  switch (type) {
    case 'danger':
      buttonColor = 'bg-red-600 hover:bg-red-700';
      break;
    case 'warning':
      buttonColor = 'bg-yellow-600 hover:bg-yellow-700';
      break;
    case 'info':
    default:
      buttonColor = 'bg-blue-600 hover:bg-blue-700';
      break;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden shadow-lg max-w-md w-full z-10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-6">
              <h2 className="text-white text-xl font-bold mb-2">{title}</h2>
              <p className="text-white/70 mb-6">{message}</p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`px-4 py-2 ${buttonColor} text-white rounded-lg transition-colors`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ConfirmDialog;