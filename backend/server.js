import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import logger from "./middleware/logger.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

const port = process.env.PORT || 8000;
const app = express();

// Enable CORS
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

// Serve uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.listen(port, () => console.log(`Server running on port ${port}`));