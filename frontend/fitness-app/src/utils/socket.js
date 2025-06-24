// socket.js (Singleton Socket File)
import { io } from "socket.io-client";
import { BASE_URL } from "./apiPaths";

let socket = null;

export const connectSocket = (token) => {
  if (socket) socket.disconnect();
  socket = io(BASE_URL, {
    auth: { token },
    transports: ["websocket"],
    autoConnect: true,
  });
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};