import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Create context
const NavigationContext = createContext();

// Custom provider component
export const NavigationProvider = ({ children }) => {
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // Check authentication status when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Update history when location changes
  useEffect(() => {
    setNavigationHistory(prev => [...prev, location.pathname]);
  }, [location]);

  // Return to previous page, skipping duplicates if needed
  const goBack = (defaultPath = '/') => {
    // Need at least 2 entries to go back (current page + previous page)
    if (navigationHistory.length < 2) {
      return defaultPath;
    }

    // Get previous location (excluding current one)
    const previousPaths = navigationHistory.slice(0, -1);
    // Find the most recent unique location (different from current)
    const previousPath = previousPaths[previousPaths.length - 1];
    
    return previousPath || defaultPath;
  };

  return (
    <NavigationContext.Provider value={{ 
      navigationHistory, 
      goBack, 
      isAuthenticated,
      setIsAuthenticated 
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook to use the navigation history
export const useNavigationHistory = () => {
  const context = useContext(NavigationContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('useNavigationHistory must be used within a NavigationProvider');
  }

  // Enhanced back function that automatically navigates
  const goBack = (defaultPath = '/') => {
    const previousPath = context.goBack(defaultPath);
    navigate(previousPath);
  };

  return {
    navigationHistory: context.navigationHistory,
    goBack,
    isAuthenticated: context.isAuthenticated,
    setIsAuthenticated: context.setIsAuthenticated
  };
};
