// context/SocketContext.jsx
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../utils/apiPaths";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(BASE_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};