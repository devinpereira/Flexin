// SocketProvider.jsx
import { createContext, useEffect, useState } from "react";
import {
  connectSocket,
  getSocket,
  disconnectSocket,
} from "../utils/socket";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const s = connectSocket(token);
      setSocket(s);

      s.on("connect", () => console.log("Connected:", s.id));
      s.on("disconnect", () => console.log("Disconnected"));
    }

    return () => {
      disconnectSocket();
    };
  }, []);

  // Listen for login/logout events
  useEffect(() => {
    const handleLogin = () => {
      const t = localStorage.getItem("token");
      const s = connectSocket(t);
      setSocket(s);
    };
    const handleLogout = () => {
      disconnectSocket();
      setSocket(null);
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
