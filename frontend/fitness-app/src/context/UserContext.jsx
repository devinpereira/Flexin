import React, { createContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to update user data
  const updateUser = (userData) => {
    setUser(userData);
    setLoading(false);
  };

  // Function to clear user data
  const clearUser = () => {
    setUser(null);
    setLoading(false);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        clearUser,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;