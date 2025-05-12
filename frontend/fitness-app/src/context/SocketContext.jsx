// context/SocketContext.jsx
import { createContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../utils/apiPaths";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(BASE_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
