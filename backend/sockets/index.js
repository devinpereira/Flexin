import socketAuth from "../middleware/socketAuth.js";

const setupSocket = (io, app) => {
  const onlineUsers = app.get("onlineUsers");

  socketAuth(io); // Authenticate first

  io.on("connection", (socket) => {
    const userId = socket.user?.id;

    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    console.log(`User connected: ${userId}`);
    onlineUsers.set(userId, socket.id);

    // Listen for chat messages
    socket.on("sendMessage", ({ to, message }) => {
      const recipientSocketId = onlineUsers.get(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", {
          from: userId,
          message,
          time: new Date(),
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
      onlineUsers.delete(userId.toString());
    });
  });
};

export default setupSocket;
