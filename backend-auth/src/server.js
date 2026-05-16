import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import prisma from "./config/database.js";
import logger from "./config/logger.js";
import { initSocket } from "./sockets/index.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    logger.info("✅ Database connected successfully");

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`
╔════════════════════════════════════════╗
║  🚀 TaskForge Server Started           ║
║  Port: ${PORT}                             ║
║  Environment: ${process.env.NODE_ENV}        ║
║  API Docs: http://localhost:${PORT}/api/docs ║
╚════════════════════════════════════════╝
      `);
    });

    // Initialize Socket.io
    initSocket(server);

    // Graceful shutdown
    process.on("SIGINT", async () => {
      logger.info("Shutting down gracefully...");
      server.close(async () => {
        await prisma.$disconnect();
        logger.info("Database connection closed");
        process.exit(0);
      });
    });

    process.on("SIGTERM", async () => {
      logger.info("Shutting down gracefully...");
      server.close(async () => {
        await prisma.$disconnect();
        logger.info("Database connection closed");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("❌ Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();
