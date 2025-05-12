import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import { Server } from "socket.io";
import http from "http";
import socketAuth from "./middleware/socketAuth.js";
import logger from "./middleware/logger.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);

// Initialize socket.io with CORS handled in socketAuth middleware
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.set("io", io);
socketAuth(io);

// Enable CORS for Express API routes
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Bodyparser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Init middleware
app.use(logger);

// Connect to MongoDB
connectDB();

// Setup routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/friends", followRoutes);
app.use("/api/v1/profile", profileRoutes);

// Real-time Event Handling
io.on("connection", (socket) => {
  if (!socket.user) {
    console.error("User not authenticated.");
    return;
  }

  console.log(`User connected: ${socket.user.id}`);

  socket.on("like-post", (data) => {
    console.log(`${socket.user.id} liked a post`);
    // handle like post logic
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user.id}`);
  });
});

// Serve uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Start server
server.listen(port, () => console.log(`Server running on port ${port}`));