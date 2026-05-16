import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "./config/logger.js";
import { formatResponse } from "./utils/helpers.js";
import authRoutes from "./routes/auth.routes.js";
// import userRoutes from "./routes/user.route.js";
import teamRoutes from "./routes/team.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

// ============== MIDDLEWARE ==============

// Logging Middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// CORS
app.use(
  cors({
    origin: [
      process.env.CORS_ORIGIN || "http://localhost:3000",
      "http://127.0.0.1:3000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parser
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));

// Cookie Parser
app.use(cookieParser());

// ============== ROUTES ==============

// Health Check
app.get("/api/v1/health", (req, res) => {
  res.json(formatResponse({ status: "ok" }, "Server is healthy"));
});

// API Routes
app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/users", userRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);
// app.use("/api/v1/analytics", analyticsRoutes);

// ============== ERROR HANDLING ==============

// 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  logger.error(`${statusCode} ${message}`, { error: err });

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export { app };
