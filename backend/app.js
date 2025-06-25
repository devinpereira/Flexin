import express from "express";
import cors from "cors";
import path from "path";
import session from "express-session";
import passport from "./config/passport.js";
import connectToDB from "./config/db.js";
import logger from "./middleware/logger.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";

const app = express();

// Connect to DB
connectToDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use(session({ secret: "sessionSecret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/friends", followRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/workouts", workoutRoutes);

// Static folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

export default app;
