import express from "express";
import cors from "cors";
import path from "path";
import logger from "./middleware/logger.js";
import connectDB from "./config/db.js";

const port = process.env.PORT || 8000;
const app = express();

// Enable CORS
app.use(cors());

// Bodyparser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Init middleware
app.use(logger);

// Connect to MongoDB
connectDB();

// Setup routes

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.listen(port, () => console.log(`Server running on port ${port}`));