import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../utils/apiPaths";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // (Re)connect / disconnect whenever `token` changes
  useEffect(() => {
    // If there's no token, tear down any existing socket
    if (!token) {
      setSocket((prev) => {
        if (prev) prev.disconnect();
        return null;
      });
      return;
    }

    // Otherwise, build a fresh socket
    const newSocket = io(BASE_URL, {
      auth: { token },
      autoConnect: true,
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });
    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // Clean up on unmount or before reconnect
    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  // Listen for your login/logout events to update the token
  useEffect(() => {
    const handleLogin = () => {
      const t = localStorage.getItem("token");
      setToken(t);
    };
    const handleLogout = () => {
      setToken(null);
    };

    window.addEventListener("login", handleLogin);
    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("login", handleLogin);
      window.removeEventListener("logout", handleLogout);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
