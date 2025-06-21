import React, { createContext, useState, useCallback } from 'react';
import Notification from '../components/Admin/Notification';

// Create context
const NotificationContext = createContext();

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success',
    message: '',
    autoClose: true,
    duration: 5000,
  });

  // Show a notification
  const showNotification = useCallback((type, message, options = {}) => {
    setNotification({
      isVisible: true,
      type,
      message,
      autoClose: options.autoClose !== undefined ? options.autoClose : true,
      duration: options.duration || 5000,
    });
  }, []);

  // Hide the notification
  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  }, []);

  // Helper methods for common notification types
  const showSuccess = useCallback((message, options) => {
    showNotification('success', message, options);
  }, [showNotification]);

  const showError = useCallback((message, options) => {
    showNotification('error', message, options);
  }, [showNotification]);

  const showInfo = useCallback((message, options) => {
    showNotification('info', message, options);
  }, [showNotification]);

  const showWarning = useCallback((message, options) => {
    showNotification('warning', message, options);
  }, [showNotification]);

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        hideNotification,
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}
      <Notification
        isVisible={notification.isVisible}
        type={notification.type}
        message={notification.message}
        onClose={hideNotification}
        autoClose={notification.autoClose}
        duration={notification.duration}
      />
    </NotificationContext.Provider>
  );
};

// Export the context for direct usage
export { NotificationContext };