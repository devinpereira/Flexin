import React, { useState, useEffect, useCallback } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Notification = ({
  type = 'success', // 'success', 'error', 'info', 'warning'
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000 // milliseconds
}) => {
  const [isClosing, setIsClosing] = useState(false);

  // Handle closing animation with useCallback to avoid dependency issues
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Animation duration
  }, [onClose]);

  // Auto-close the notification after specified duration
  useEffect(() => {
    let timer;
    if (isVisible && autoClose) {
      timer = setTimeout(() => {
        handleClose();
      }, duration);
    }
    return () => clearTimeout(timer);
  }, [isVisible, autoClose, duration, handleClose]);

  // If not visible, don't render anything
  if (!isVisible) return null;

  // Set icon and color based on notification type
  let icon;
  let bgColor;
  let borderColor;

  switch (type) {
    case 'success':
      icon = <FaCheckCircle className="text-green-400" size={20} />;
      bgColor = 'bg-green-500/20';
      borderColor = 'border-green-500';
      break;
    case 'error':
      icon = <FaExclamationTriangle className="text-red-400" size={20} />;
      bgColor = 'bg-red-500/20';
      borderColor = 'border-red-500';
      break;
    case 'warning':
      icon = <FaExclamationTriangle className="text-yellow-400" size={20} />;
      bgColor = 'bg-yellow-500/20';
      borderColor = 'border-yellow-500';
      break;
    case 'info':
    default:
      icon = <FaInfoCircle className="text-blue-400" size={20} />;
      bgColor = 'bg-blue-500/20';
      borderColor = 'border-blue-500';
      break;
  }

  return (
    <div
      className={`fixed top-6 right-6 z-50 max-w-sm transition-all duration-300 transform ${isClosing ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
        }`}
    >
      <div className={`${bgColor} border ${borderColor} rounded-lg shadow-lg px-5 py-4 flex items-start gap-3`}>
        <div className="flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div className="flex-grow mr-2">
          <p className="text-white text-sm">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="text-white/70 hover:text-white flex-shrink-0 transition-colors"
          aria-label="Close notification"
        >
          <FaTimes size={16} />
        </button>
      </div>
    </div>
  );
};

export default Notification;