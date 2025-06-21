import React from 'react';
import Modal from './Modal';
import { FaExclamationTriangle, FaInfoCircle, FaQuestionCircle } from 'react-icons/fa';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning' // 'warning', 'danger', 'info'
}) => {
  // Determine color scheme based on type
  let icon;
  let buttonColor;

  switch (type) {
    case 'danger':
      icon = <FaExclamationTriangle size={24} className="text-red-500" />;
      buttonColor = 'bg-red-600 hover:bg-red-700';
      break;
    case 'info':
      icon = <FaInfoCircle size={24} className="text-blue-500" />;
      buttonColor = 'bg-blue-600 hover:bg-blue-700';
      break;
    case 'warning':
    default:
      icon = <FaQuestionCircle size={24} className="text-yellow-500" />;
      buttonColor = 'bg-[#f67a45] hover:bg-[#e56d3d]';
  }

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const footer = (
    <div className="flex justify-end gap-3">
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
      >
        {cancelText}
      </button>
      <button
        onClick={handleConfirm}
        className={`px-4 py-2 ${buttonColor} text-white rounded-lg transition-colors`}
      >
        {confirmText}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size="sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          {icon}
        </div>
        <p className="text-white">{message}</p>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;