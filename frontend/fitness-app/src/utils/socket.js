import { io } from "socket.io-client";
import { BASE_URL } from "./apiPaths";

let socket = null;

export const connectSocket = (token) => {
  if (socket && socket.connected) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(BASE_URL, {
    auth: { token },
    transports: ["websocket"],
    autoConnect: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 1000,
    forceNew: true, // Force new connection
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
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

// Text message validation utilities
export const validateTextMessage = (message) => {
  if (typeof message !== 'string') {
    return { isValid: false, error: 'Message must be a string' };
  }
  
  if (!message.trim()) {
    return { isValid: false, error: 'Message cannot be empty' };
  }
  
  if (message.length > 1000) {
    return { isValid: false, error: 'Message is too long (max 1000 characters)' };
  }
  
  return { isValid: true };
};

// Text message helper functions
export const emitTextMessage = (to, message) => {
  if (!socket || !socket.connected) {
    throw new Error('Socket not connected');
  }
  
  const validation = validateTextMessage(message);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }
  
  socket.emit("sendTextMessage", { 
    to, 
    message: message.trim(), 
    chatType: "text" 
  });
};

export const emitTypingStatus = (to, isTyping) => {
  if (!socket || !socket.connected) return;
  
  socket.emit("typing", { to, isTyping });
};