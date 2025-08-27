import socketAuth from "../middleware/socketAuth.js";
import Trainer from "../models/Trainer.js";

const setupSocket = (io, app) => {
  const onlineUsers = app.get("onlineUsers");

  socketAuth(io); // Authenticate first

  io.on("connection", async (socket) => {
    const userId = socket.user?.id;

    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    console.log(`User connected: ${userId}`);
    
    // Store the user ID in online users
    onlineUsers.set(userId, socket.id);
    onlineUsers.set(userId.toString(), socket.id);
    
    // Check if this user is also a trainer and store trainer ID mapping
    try {
      const trainer = await Trainer.findOne({ userId: userId }).select("_id");
      if (trainer) {
        // Map trainer ID to the same socket ID
        onlineUsers.set(trainer._id.toString(), socket.id);
        onlineUsers.set(trainer._id, socket.id);
      }
    } catch (error) {
      console.error("Error checking trainer status:", error);
    }

    // Listen for text messages only
    // Listen for text messages only
    socket.on("sendTextMessage", ({ to, message, chatType = "text" }) => {
      // Validate that this is a text message
      if (chatType !== "text" || typeof message !== "string" || !message.trim()) {
        socket.emit("error", { message: "Invalid text message format" });
        return;
      }

      // Try both string and ObjectId formats
      let recipientSocketId = onlineUsers.get(to) || onlineUsers.get(to.toString());
      
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveTextMessage", {
          from: userId,
          message: message.trim(),
          chatType: "text",
          time: new Date(),
          messageId: `${Date.now()}-${Math.random()}`,
        });
      }
    });

    // LEGACY SUPPORT: Keep old sendMessage for backward compatibility
    socket.on("sendMessage", ({ to, message, from }) => {
      // Validate message
      if (typeof message !== "string" || !message.trim()) {
        socket.emit("error", { message: "Invalid message format" });
        return;
      }

      const recipientSocketId = onlineUsers.get(to);
      if (recipientSocketId) {
        // Send both old and new format for compatibility
        io.to(recipientSocketId).emit("receiveMessage", {
          from: from || userId,
          message: message.trim(),
          time: new Date(),
        });
        
        io.to(recipientSocketId).emit("receiveTextMessage", {
          from: from || userId,
          message: message.trim(),
          chatType: "text",
          time: new Date(),
          messageId: Date.now() + Math.random(),
        });
      }
    });

    // Handle typing indicators for text messages
    socket.on("typing", ({ to, isTyping }) => {
      const recipientSocketId = onlineUsers.get(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("userTyping", {
          from: userId,
          isTyping,
        });
      }
    });

    // Handle message read status
    socket.on("markMessageRead", ({ messageId, chatId }) => {
      socket.broadcast.emit("messageRead", {
        messageId,
        chatId,
        readBy: userId,
      });
    });

    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${userId}`);
      onlineUsers.delete(userId);
      onlineUsers.delete(userId.toString());
      
      // Also remove trainer ID mapping if this user is a trainer
      try {
        const trainer = await Trainer.findOne({ userId: userId }).select("_id");
        if (trainer) {
          onlineUsers.delete(trainer._id.toString());
          onlineUsers.delete(trainer._id);
        }
      } catch (error) {
        console.error("Error checking trainer status on disconnect:", error);
      }
    });
  });
};

export default setupSocket;
