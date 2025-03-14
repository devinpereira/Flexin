import express from "express";
import cors from "cors";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/error.js";
import notFound from "./middleware/notFound.js";
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

// Setup routes

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB
connectDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});