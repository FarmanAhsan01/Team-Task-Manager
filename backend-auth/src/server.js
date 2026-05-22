import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import prisma from "./config/database.js";
import logger from "./config/logger.js";
import { initSocket } from "./sockets/index.js";

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

const checkDatabaseConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("Database connection failed", {
      message: error.message,
      stack: error.stack,
    });
  }
};

const startServer = () => {
  const server = app.listen(PORT, HOST, () => {
    logger.info(`TaskForge server listening on ${HOST}:${PORT}`);
    checkDatabaseConnection();
  });

  initSocket(server);

  const shutdown = async () => {
    logger.info("Shutting down gracefully...");
    server.close(async () => {
      await prisma.$disconnect();
      logger.info("Database connection closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer();
